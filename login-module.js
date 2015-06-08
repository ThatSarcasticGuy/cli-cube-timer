module.exports = function(){

	var clc = require("cli-color");

	console.log(clc.blue("Welcome to the one-time-authentication module."));
	console.log("This module will take your github username and password\nand exchange it for an OAuth token");

	var username, password;

	var read = require("read");
	var request = require('request-json');
	var configstore = require('configstore');
	var pkg = require('./package.json');

	read({

		prompt: "Enter your GitHub username: ",

	}, function(err, result, isDef){
		username = result;

		read({

			prompt: "Enter your GitHub password: ",
			silent: true

		}, function(err, result, isDef){
			password = result;
			var client = request.createClient("https://api.github.com/");

			client.setBasicAuth(username, password);

			var data = {
				"scopes": ["gist"],
				"note": "OAuth token for node-cube-cli-timer.",
				"client_id": "678a9606a01d79c24046",
				"client_secret": "266c833862498ac55856cf276a26c8b680515e91"
			};

			client.post("authorizations", data, function(err, res, body){

				if(res.statusCode == 201 && !err){

					var conf = new configstore(pkg.name);

					for (var i in conf.all) {
						conf.del(i);
					};

					conf.set('username', username);
					conf.set('oauth_token', body.token);

					console.log(clc.green("Authenticated!") + " We have stored your OAuth Token in the ~/.config directory.");
				}

				else{
					console.log("HTTP Status Code: " + res.statusCode);
					console.log("We encountered an error!");
				}
			});

		});
	});

}
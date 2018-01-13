const uuid4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const Client = require('../models/schemas/client');



findMasterAndTagChild = function(req, res, next) {
	console.log("looking for Master")
	Client.findOne({
		isMaster: true,
		organizationName: req.body.employerLookup
	}, 
			function(err, boss) {
				if (err) return next(err);
				console.log("Found Master:");
				console.log(boss);
				console.log("Master's Mongo key:");
				console.log(boss.mongoCollectionKey)
				req.body.mongoCollectionKey = boss.mongoCollectionKey;
				req.body.organizationName = boss.organizationName;
				req.body.boss_id = boss._id;
				// Give new employee simple and easily memorable number to use as a Clock-In number. 
					// Update Master's records and increment the number of employees 
				
				req.body.clockInNumber = boss.employeeCounter; 
				console.log("Updating new user's Clock-In Number")
				console.log("Boss' old employeeCounter is: ")
				console.log(boss.employeeCounter)
				console.log("Appending this to the new employee: ")
				console.log(req.body.clockInNumber)
				req.body.newEmployeeCount = boss.employeeCounter + 1
				console.log("Incrementing new counter: ")
				console.log(req.body.newEmployeeCount)
				console.log("Running findByIdAndUpdate...")
				updateEmployerEmployeeCount(req, res, next);
				// create custom fallbacks for not finding organization
				console.log("New req.body:")
				console.log(req.body)
			}).then(() => next())
}

updateEmployerEmployeeCount = function(req, res, next) {
		Client.findByIdAndUpdate(req.body.boss_id, { employeeCounter: req.body.newEmployeeCount }, {new: true}, function(err, newBoss) { 
			console.log("Employer's Employer Counter Updated: ")
				console.log(newBoss)
				return;
			})
}
createTerminalAccount = function(req, res, next) {
	data = {
		email: req.body.mongoCollectionKey + '@terminal.com',
		isMaster: false,
		isAdmin: false,
		mongoCollectionKey: req.body.mongoCollectionKey, 
		organizationName: req.body.organizationName,
		password: req.body.mongoCollectionKey, // change later
		accountType: "Terminal"
	}

	var newClient = new Client(data);
	if (!newClient.hash) {
			var plaintext = data.password;
			const saltRounds = 10;
			
			bcrypt.hash(plaintext, saltRounds).then(function(hash) {
				
				newClient.hash = hash;
				
				newClient.save(function(err, client) {
					if (err) return next(err);
					console.log("New Terminal Account Created:")
					console.log(client)
				});
			}).catch(function(error){
				console.log("Unexpected Error: " + error);
		});
	};

}

module.exports.configureNewUser = function(req, res, next) {
	if (req.body.isBusinessOwner) {
		req.body.isMaster = true;
		req.body.isAdmin = true;
		req.body.employeeCounter = 0;
		req.body.accountType = "Master";
		// Generate unique identifier for Organization
			const mongoCollectionKey = uuid4().slice(0, 7);
			req.body.mongoCollectionKey = mongoCollectionKey;
			// Create Point Of Sale Bot
			createTerminalAccount(req, res, next)
			next();
	}

	if (req.body.isEmployee) {
		req.body.isMaster = false;
		req.body.accountType = "Employee"
			findMasterAndTagChild(req, res, next)		
	}
}
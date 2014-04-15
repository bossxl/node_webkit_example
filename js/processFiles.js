/**
* File: processFiles.js
*/
function main (listener, data){
	var users = [];
	var proccessedDevices = [];
	var countries = [];
	var devices = data.devices;
	for(var i = 0; i < devices.length; i++){
		var device = devices[i];
		proccessedDevices[device.deviceId] = device.description;
	}
	proccessedDevices[0] = "All";
	var testers = data.testers;
	for(var i = 0; i < testers.length; i++){
		var tester = testers[i];
		users[parseInt(tester.testerId)] = tester;
		if(countries.indexOf(tester.country) === -1){
			countries.push(tester.country);
		}
	}
	var bugs = data.bugs;
	for(var i = 0; i < bugs.length; i++){
		var bug = bugs[i];
		var user = users[bug.testerId]
		if(typeof user['bugs'] === "undefined"){
			user['bugs'] = [];
			user['bugsByDevice'] = {};
		}
		if(typeof user['bugsByDevice'][bug.deviceId] === "undefined"){
			user['bugsByDevice'][bug.deviceId] = []	
		}
		delete bug.testerId;
		user['bugsByDevice'][bug.deviceId].push(bug);
		delete bug.deviceId;
		user['bugs'].push(bug);
	}
	var tester_devices = data.tester_device;
	for(var i = 0; i < tester_devices.length; i++){
		var tester_device = tester_devices[i];
		var user = users[tester_device.testerId];
		if(typeof user['devices'] === "undefined"){
			user['devices'] = [];
		}
		delete tester_device.testerId;
		user['devices'].push(tester_device);
	}
	var newData = {};
	if(!users[0]){
		users.shift();
	}
	newData.testers = users;
	newData.devices = proccessedDevices;
	newData.countries = countries;
	listener.emit("processComplete", newData);

}
exports.main = main;
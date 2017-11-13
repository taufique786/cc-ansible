// Description:
//   Our ChatOps Satellite Servers can not execute help commands without violating
//   Slack's Rate Limit for Bot Users. Continuing to send messages after being rate limited
//   runs the risk of having your application permanently disabled. That is why we only allow
//   the Global Cluster Server to respond to "Alice help" requests. The Global Cluster Servers
//   do not contain the Satellite Server's code and are only providing available help commands
//   on their behalf.
//
// Dependencies:
//   "hubot-help": "latest"
//
// Notes:
//   The order of the help commands does not matter. They are alphabetized by the hubot-help module.
//   Leave all of them lowercase
//
// Commands:
//   hubot chatops help
//

// Export to the robot
module.exports = function (robot) {

// ChatOps Help Section
    robot.respond(/chatops help/i, function (msg) {
// Logging
        if (msg.envelope.user.name === msg.message.room) {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in PRIVATE_DIRECT_MESSAGE issued " + msg.message);}
        else {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in " + msg.message.room + " issued " + msg.message);}
// Begin response
        var ipToolsHelp = [];
        ipToolsHelp.push(robot.name + " dig <datacenter> <ip address or name>");
        ipToolsHelp.push(robot.name + " mtr <datacenter> <ip address or name>");
        ipToolsHelp.push(robot.name + " nslookup <datacenter> <ip address or name>");
        ipToolsHelp.push(robot.name + " ping <datacenter> <ip address or name>");
        ipToolsHelp.push(robot.name + " traceroute <datacenter> <ip address or name>");
        ipToolsHelp.push(robot.name + " whois <datacenter> <ip address or name>");
        msg.send(ipToolsHelp.join("\n"));
    });

};

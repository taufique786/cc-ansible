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
//   hubot ansible help
//   hubot ip tools help
//   hubot zenoss help
//   hubot srx help
//   hubot zendesk help
//   hubot custcare help
//

// Export to the robot
module.exports = function (robot) {

// Zenoss Help Section
    robot.respond(/zenoss help/i, function (msg) {
// Logging
        if (msg.envelope.user.name === msg.message.room) {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in PRIVATE_DIRECT_MESSAGE issued " + msg.message);}
        else {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in " + msg.message.room + " issued " + msg.message);}
// Begin response
        var zenossHelp = [];
        zenossHelp.push(robot.name + " zenoss status <device name>");
        zenossHelp.push(robot.name + " zenoss set <device name> <state> - _Your choices are: production, preprod and maintenance_");
        msg.send(zenossHelp.join("\n"));
    });

// IP Tools Help Section
    robot.respond(/ip tools help/i, function (msg) {
// Logging
        if (msg.envelope.user.name === msg.message.room) {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in PRIVATE_DIRECT_MESSAGE issued " + msg.message);}
        else {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in " + msg.message.room + " issued " + msg.message);}
// Begin response
        var ipToolsHelp = [];
        ipToolsHelp.push(robot.name + " <datacenter> mtr <ip address>");
        msg.send(ipToolsHelp.join("\n"));
    });

// SRX help Section
    robot.respond(/srx help/i, function (msg) {
// Logging
        if (msg.envelope.user.name === msg.message.room) {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in PRIVATE_DIRECT_MESSAGE issued " + msg.message);}
        else {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in " + msg.message.room + " issued " + msg.message);}
// Begin response
        var srxHelp = [];
        srxHelp.push(robot.name + " srx toptalkers <datacenter> core - _displays the Juniper SRX Core top talkers in the specified datacenter_");
        srxHelp.push(robot.name + " srx toptalkers <datacenter> edge - _displays the Juniper SRX Edge top talkers in the specified datacenter_");
        srxHelp.push(robot.name + " srx interface stats <datacenter> - _displays interface statistics on the Core SRX in the specified datacenter (Parse-InterfaceStatistics)_");
        srxHelp.push(robot.name + " srx public-ip <datacenter> <x.x.x.x> - _displays public IP to private IP static NAT mapping as seen on the Edge SRX_");
        srxHelp.push(robot.name + " srx public-ip <datacenter> report - _displays a top ten report of the most recent public IP assignments as seen on the Edge SRX_");
        srxHelp.push(robot.name + " srx public-ip <datacenter> audit summary - _displays a short report for total public IP usage on the Edge SRX and shared Load Balancer for a specificed datacenter_");
        srxHelp.push(robot.name + " srx public-ip <datacenter> audit full - _displays a detailed report for total public IP usage on the Edge SRX and shared Load Balancer for a specified datacenter_");
        srxHelp.push(robot.name + " srx sessions <datacenter> [ip|port|protocol] <what to look up> - _displays a report of SRX flow sessions based upon a IP address, port or protocol as seen on the Edge SRX_");
        msg.send(srxHelp.join("\n"));
    });

// ZenDesk Help Section
    robot.respond(/zendesk help/i, function (msg) {
// Logging
        if (msg.envelope.user.name === msg.message.room) {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in PRIVATE_DIRECT_MESSAGE issued " + msg.message);}
        else {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in " + msg.message.room + " issued " + msg.message);}
// Begin response
        var zendeskHelp = [];
        zendeskHelp.push(robot.name + " zd tickets - _Displays tickets in your own queue_");
        zendeskHelp.push(robot.name + " zd tickets <first.last> - _Displays tickets assigned to the engineer you request_");
        zendeskHelp.push(robot.name + " zd search kb <string> - _Searches our internal KB Library_");
        msg.send(zendeskHelp.join("\n"));
    });

// Customer Care Help Section
    robot.respond(/custcare help/i, function (msg) {
// Logging
        if (msg.envelope.user.name === msg.message.room) {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in PRIVATE_DIRECT_MESSAGE issued " + msg.message);}
        else {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in " + msg.message.room + " issued " + msg.message);}
// Begin response
        var custcareHelp = [];
        custcareHelp.push(robot.name + " eos");
        custcareHelp.push(robot.name + " online");
        custcareHelp.push(robot.name + " zdvon");
        custcareHelp.push(robot.name + " zdvoff");
        msg.send(custcareHelp.join("\n"));
    });

}; // Robot out"

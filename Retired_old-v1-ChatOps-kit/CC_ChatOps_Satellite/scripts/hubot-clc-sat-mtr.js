// Description:
//  This runs an MTR from the datacenter provided, against the IP address provided.
//     Ex. Alice va1 mtr 8.8.8.8
//
// Configuration:
//  Requires child_process - This comes installed with Node.js v5.5.0 or later
// 
// OS Level Dependencies:
//  On the Satellite Server install the following:
//  yum install mtr
//
// Help is kept on the Global Cluster Servers. Satellite Servers do not contain help (FOR ANY REASON).
//

//Global Variables
var child_process = require('child_process');
var localDC = process.env.HUBOT_DC_LOC;

// Export to the robot
module.exports = function(robot) {
  robot.respond(/(...) mtr (.*)/i, function(msg) {
   // Begin response
    var mtrIpAddr = escape(msg.match[2]);
    var inputDc = msg.match[1]; var inputDcUp = inputDc.toUpperCase();
    // Logging
    if ((msg.envelope.user.name === msg.message.room) && (inputDcUp === localDC)) {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in PRIVATE_DIRECT_MESSAGE issued " + msg.message);}
    else if (inputDcUp === localDC) {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in " + msg.message.room + " issued " + msg.message);}
    else {}
    if (inputDcUp === localDC && mtrIpAddr.match(/http/gi)) {
      msg.send("Please specify an IP address.");
      return;
    }
    else if(inputDcUp === localDC) {
      msg.send("It's going to take a few moments for me to get your MTR results. Please stand by...");
      child_process.exec("mtr " + mtrIpAddr + " --report --show-ips --aslookup --report-wide", function(error, stdout, stderr) {
      msg.send("Here are your MTR results for " + "*" + mtrIpAddr + "*" + " from " + "*" + localDC + "*" + "\n" + "```" + stdout + "```");
      return;
      });
    }
    else {
      return;
    }
  });
}; // Robot out
// Description:
//   This is for testing what bots can hear and respond. It is not available on the help menu
//
// Dependencies:
//   "child_process": "latest"
//
// Configuration:
//   HUBOT_DIAGS_DELAY - This is required to be set on each bot. It prevents the bots from responding at the same time (Slack Rate Limit Issue).
//
// Notes Section:
//   diags check-in - This is a robot hear command. It will return the robot.name, the datacenter it is executing in, along with the server name.
//   We use the HUBOT_DIAGS_DELAY to prevent rate limit issues.

// Export to the robot
module.exports = function (robot) {
var delay = process.env.HUBOT_DIAGS_DELAY

// Robot hear
robot.hear(/diags check-in/i, function (msg) {

  if (msg.envelope.user.name === msg.message.room) {

// This will get the local hostname and respond
  var getHostName = require('child_process').exec;
  getHostName('hostname', function (err, stdout, stderr) {
    var locHostName = (stdout);
    var dcName = locHostName.slice(0,3);
    var hostUp = locHostName.toUpperCase();
    var dcUp = dcName.toUpperCase();

// Robot Message Send
  setTimeout(function(){
    msg.send(robot.name + " in " + dcUp + " checking in. " + "Hostname: " + hostUp);
  }, delay);
  });
getHostName();
  }
  else {
    console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in " + msg.message.room + " issued " + msg.message + " - I did not execute!")
    return;
  }
});
}; // Robot out

// Description:
//   Use a ChatOps global Hubot (Carebot) to perform HA ChatOps functions (start/stop other bots like Alice and Skynet)!
//
// Dependencies:
//   "hubot": "latest"
//   "hubot-slack": "latest"
//   "hubot-redis-brain": "latest"
//   "redis": "latest"
//
// Configuration:
//   HUBOT_SLACK_TOKEN - This is the Hubot's Slack API token key
//
// Author:
//   Ernest G. Wilson II <Ernest.Wilson@ctl.io>
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
// Ensure startup configuration  //
///////////////////////////////////
var ensureConfig = function () {
    if (!process.env.HUBOT_SLACK_TOKEN) {
        throw new Error("Error: HUBOT_SLACK_TOKEN environment variable is not set");
    }
};
ensureConfig();
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
// Global variables //
//////////////////////
var debug = true; // In production turn OFF debugging!
var botKey = process.env.HUBOT_SLACK_TOKEN;
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
module.exports = function (robot) {

    robot.respond(/chatops (.*)/i, function(msg) {
        
        // Optional debug is helpful for trouble shooting
        if (debug === true){console.log("msg.envelope.user.name: " + msg.envelope.user.name);} // See value of msg.envelope.user.name
        if (debug === true){console.log("msg.envelope.user.id: " + msg.envelope.user.id);} // See value of msg.envelope.user.id
        if (debug === true){console.log("msg.message.room: " + msg.message.room);} // See value of msg.message.room
        
        // Logging
        if (msg.envelope.user.name === msg.message.room) {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in PRIVATE_DIRECT_MESSAGE issued " + msg.message);}
        else {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in " + msg.message.room + " issued " + msg.message);}
        
        // Determine which Slack channel to have the output sent to (was the request sent to Hubot in a private message or in a specific channel)
        var SendToChannel;
        if (msg.envelope.user.name === msg.message.room) {SendToChannel=msg.envelope.user.id;} // Send it to the human in a private response where they requested it
        else {SendToChannel=msg.message.room;} // Send it to the specific channel where the human sent the request from

        // Read the human's input
        var AllArguments = msg.match[0];
        var Arg = AllArguments.split(" ");
        // Argument debugging
        if (debug === true){console.log("AllArguments: " + AllArguments);} // See value of AllArguments
        if (debug === true){console.log("Arg0: " + Arg[0]);} // See value of Arg[0]
        if (debug === true){console.log("Arg1: " + Arg[1]);} // See value of Arg[1]
        if (debug === true){console.log("Arg2: " + Arg[2]);} // See value of Arg[2]
        if (debug === true){console.log("Arg3: " + Arg[3]);} // See value of Arg[3]
        if (debug === true){console.log("Arg4: " + Arg[4]);} // See value of Arg[4]
        
        // 
        if (Arg[2].toUpperCase() == "GB3" && Arg[3].toUpperCase() == "START") {
            // Reply to the human so they know we heard the request!
            msg.send("I heard chatops gb3 start...");
            if (debug === true) { console.log("heard: chatops gb3 start"); }
        }
        else if (Arg[2].toUpperCase() == "GB3" && Arg[3].toUpperCase() == "STOP") {
            // Reply to the human so they know we heard the request!
            msg.send("I heard chatops gb3 stop...");
            if (debug === true) { console.log("heard: chatops gb3 stop"); }
        }
        else {
            if (debug === true) { console.log("Oops!"); }
            msg.send("Aw, :sadpanda:");
        }

    });
};
////////////////////////////////////////////////////////////

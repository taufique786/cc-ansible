// Description:
//    This script is used for going end of shift.
//
// Dependencies:
//    "node-rest-client": "latest"
//
// Example:
//    hubot eos
//    hubot online
//    hubot zdvon
//    hubot zdvoff

// ZenDesk Global Variables
var Client = require('node-rest-client').Client;
var zdUrl = ("https://t3n.zendesk.com/api/v2/search.json?query=");
var zdUser = process.env.ALICE_ZD_USERNAME;
var zdPassword = process.env.ALICE_ZD_PASSWORD;
var zdAuth = new Buffer(zdUser + ":" + zdPassword).toString('base64');
var client = new Client();

// ZenDesk API Arguments
var args = {
    data: { },
    headers: { "Authorization": "Basic " + zdAuth, "Content-Type": "application/json", "Accept": "application/json" }
};

// ZenDesk Voice Global Variables
var ZDVU =  process.env.ZDV_USER;
var ZDVP =  process.env.ZDV_TOKEN;
var zdVoiceAuth = new Buffer(ZDVU + "/token:" + ZDVP).toString('base64');

// ZenDesk Voice API Arguments
var ZDVOICEOFFARGS = {
    data: {"availability":{"available":false,"via":"client","status":"not_available"}},
    headers: { "Authorization": "Basic " + zdVoiceAuth, "Content-Type": "application/json"}
};

var ZDVOICEONARGS = {
    data: {"availability":{"available":true,"via":"client","status":"available"}},
    headers: { "Authorization": "Basic " + zdVoiceAuth, "Content-Type": "application/json"}
};

// Export to the robot
module.exports = function (robot) {

    robot.respond(/eos/i, function (msg) {

// Logging
        if (msg.envelope.user.name === msg.message.room) {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in PRIVATE_DIRECT_MESSAGE issued " + msg.message);}
        else {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in " + msg.message.room + " issued " + msg.message);}

// Capturing and manipulating user input
        var SearchItem = msg.message.user.email_address;
        var searchString = "type:ticket ticket_type:task ticket_type:incident ticket_type:question -subject:PM* status<solved order_by:updated_at sort:desc assignee:"+ SearchItem;
        var search = (zdUrl + searchString);

// ZenDesk API Call
        client.get(search, args, function (data) {
            var tickets = data.results;
            var arrayReportdata = [];
            for(var i=0; i < tickets.length; i++) {
                var title = tickets[i].subject;
                title = title.substring(0,55);
                var Output = "<https://t3n.zendesk.com/agent/tickets/" + tickets[i].id + "|" + tickets[i].id + "> - " + title;
                arrayReportdata.push(Output);
            }
            var report = arrayReportdata.join(" \n ");

// Message back to the requester
            msg.send("@here "+msg.message.user.name + " going End of Shift:");
            robot.emit('slack-attachment', {
                channel: msg.message.user.room ,
                content: {
                    "fallback": "End of Customer Care Engineers shift.",
                    "title": "",
                    "title_link": "",
                    "text": "" + report + "",
                    "color": "#0000FF"
                }
            });
        });

        var ZDVsearchString = "type:user email:" + msg.message.user.email_address;
        var ZDVsearch = (zdUrl + ZDVsearchString);

// ZenDesk API Call
        client.get(ZDVsearch, args, function (IDdata) {
            var ZendeskData = IDdata.results;
            var ZendeskID = "";
            for(var i=0; i < ZendeskData.length; i++) {
                ZendeskID = ZendeskData[i].id;
            }
            var ZDVURL = "https://t3n.zendesk.com/api/v2/channels/voice/availabilities/"+ ZendeskID +".json";
// ZenDesk API Call
            client.put(ZDVURL, ZDVOICEOFFARGS, function () {
                var Output = "```"
                    + "Zendesk OFFLINE for " + ZendeskID +": " + msg.message.user.name
                    + "```";

// Message back to the requester
                robot.messageRoom (msg.message.user.name, Output);
            });

        });
    }); // End robot respond section (SearchZD)


// Robot respond section (online / zdvon)
    robot.respond(/online|zdvon/i, function (msg) {

// Logging Section
        if (msg.envelope.user.name === msg.message.room) {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in PRIVATE_DIRECT_MESSAGE issued " + msg.message);}
        else {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in " + msg.message.room + " issued " + msg.message);}

// Capturing and manipulating user input
        var searchString = "type:user email:" + msg.message.user.email_address;
        var search = (zdUrl + searchString);

// ZenDesk API Call
        client.get(search, args, function (data) {
            var ZendeskData = data.results;
            var ZendeskOutput = "";
            for(var i=0; i < ZendeskData.length; i++) {
                ZendeskOutput = ZendeskData[i].id;
            }

// ZenDesk API Call
            var ZDVURL = "https://t3n.zendesk.com/api/v2/channels/voice/availabilities/"+ ZendeskOutput +".json";
            client.put(ZDVURL, ZDVOICEONARGS, function () {
                var Output = "```"
                    + "Zendesk voice ONLINE for " + ZendeskOutput +": " + msg.message.user.name
                    + "```";

// Message back to the requester
                robot.messageRoom (msg.message.user.name, Output);

            });
        });

    }); // End robot respond section (online / zdvon)


// Robot respond section (zdvoff)
    robot.respond(/zdvoff/i, function (msg) {

// Logging
        if (msg.envelope.user.name === msg.message.room) {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in PRIVATE_DIRECT_MESSAGE issued " + msg.message);}
        else {console.log(msg.envelope.user.id + " " + msg.envelope.user.name + " in " + msg.message.room + " issued " + msg.message);}

// Capturing and manipulating user input
        var searchString = "type:user email:" + msg.message.user.email_address;
        var search = (zdUrl + searchString);

// ZenDesk API Call
        client.get(search, args, function (data) {
            var ZendeskData = data.results;
            var ZendeskOutput = "";
            for(var i=0; i < ZendeskData.length; i++) {
                ZendeskOutput = ZendeskData[i].id;
            }
// ZenDesk API Call
            var ZDVURL = "https://t3n.zendesk.com/api/v2/channels/voice/availabilities/"+ ZendeskOutput +".json";
            client.put(ZDVURL, ZDVOICEOFFARGS, function () {
                var Output = "```"
                    + "Zendesk OFFLINE for " + ZendeskOutput +": " + msg.message.user.name
                    + "```";

// Message back to the requester
                robot.messageRoom (msg.message.user.name, Output);
            });
        });

    }); // End robot respond section (zdvoff)

}; // Robot out
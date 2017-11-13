#!/bin/sh
#
# skyminion-slack-adapter-watchdog.sh
#
# On occasion, hubot will disconnect from slack.  This is usually due
# to network conditions affecting connectivity to slack.  The skyminion
# service will remain running but with it disconnected from slack, hubot
# will not be listening for commands.  This script will monitor the status
# of that connector and restart the skyminion service if it finds it disconnected.
# This script is intended to be run out of cron on a regular basis.
#

# Make sure you're on a RHEL7 box. This will only run on RHEL7.
cat /etc/redhat-release | grep "Red Hat Enterprise Linux Server release 7" >/dev/null 2>&1
if [ ${?} -eq 1 ]; then
   logger -p local0.info "skyminion-slack-adapter-watchdog.sh tried to run on a server that isn't a RHEL7 server."
   exit 1
fi

# Check to see if the service is running.  If it is down, leave it down.
# It might be down for maintenance.
#
systemctl status skyminion.service -l | grep "Active: active (running)" > /dev/null 2>&1
if [ ${?} -eq 1 ]; then
   exit 0
fi

# Check to see if skyminion.service status shows disconnected. If yes,
# set a flag for use later.
#
DISCONNECTED=0
systemctl status skyminion.service -l | grep "Slack client closed, waiting for reconnect" > /dev/null 2>&1
if [ ${?} -eq 0 ]; then
   DISCONNECTED=1
fi


# Check to see if skyminion.service status shows connected.
# If it does but also shows disconnected in the status, it is disconnected.
# If it just shows connected, exit.
#
systemctl status skyminion.service -l | grep "Slack client now connected" > /dev/null 2>&1
if [ ${?} -eq 0 -a ${DISCONNECTED} -eq 0 ]; then
   exit 0
fi

# Make sure you can ping the Slack API server.  If not, Slack might be down
# or the datacenter might have a problem reaching it due to a network issue.
# If you can't get to the Slack API server, exit.
#
ping -c 3 api.slack.com > /dev/null 2>&1
if [ ${?} -ne 0 ]; then
   exit 0
fi

# If you've made it this far, the slack connector is disconnected, skyminion service
# is not down for maintenance reasons, and you can reach Slack API.  Restart the
# service after some random delay between 1 and 9 seconds to prevent all of the
# hubots from connecting at the same moment.
#
sleep `grep IP /etc/sysconfig/network-scripts/ifcfg-ens160 | cut -d"." -f4 | cut -c1`
logger -p local0.info "skyminion-slack-adapter-watchdog.sh detected a disconnect.  Restarting skyminion.service"
systemctl restart skyminion.service >/dev/null  2>&1

exit 0

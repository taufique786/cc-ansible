#!/bin/sh
#
# slack-adapter-watchdog.sh 
#
# On occasion, hubot will disconnect from slack.  This is usually due 
# to network conditions affecting connectivity to slack.  The chatops
# service will remain running but with it disconnected from slack, hubot
# will not be listening for commands.  This script will monitor the status
# of that connector and resart the hubot service if it finds it disconnected.
# This script is intended to be run out of cron on a regular basis.
#

# Pick the service name you want to have monitored and supply it as an argument.  
# That way you only have to declare it once in the script and have it dictated on 
# the command line.  No need for multiple copies of the script.  You can give the
# .service name or omit it.
#
# For example, slack-adapter-watchdog.sh chatops-prod.service 
#              slack-adapter-watchdog.sh skynet-prod
#
DOTSERVICE=${1}

# Make sure you give the script an argument.
#
if [ ${DOTSERVICE:-BoGuS} = "BoGuS" ]; then
  logger -p local0.info "ERROR: slack-adapter-watchdog.sh requires an argument of the service to be monitored."
  exit 1
fi

# Make sure you're on a RHEL7 or CentOS7 box. This will only run on those versions.
#
FLAG=0

if [ -f /etc/redhat-release ]; then
  cat /etc/redhat-release | grep "Red Hat Enterprise Linux Server release 7" >/dev/null 2>&1
  if [ ${?} -eq 0 ]; then
    FLAG=1
  fi
fi

if [ -f /etc/centos-release ]; then
  cat /etc/centos-release | grep "CentOS Linux release 7" >/dev/null 2>&1
  if [ ${?} -eq 0 ]; then
    FLAG=1
  fi
fi

if [ ${FLAG} -eq 0 ]; then 
  logger -p local0.info "ERROR: slack-adapter-watchdog.sh for ${DOTSERVICE} tried to run on a server that isn't a CentOS 7 or RHEL 7 server."
  exit 1
fi


# Make sure the service actually exists.  If not, error and exit.
#
systemctl status ${DOTSERVICE} > /dev/null 2>&1
if [ ${?} -eq 3 ]; then
  logger -p local0.info "ERROR: Service ${DOTSERVICE} for slack-adapter-watchdog.sh does not exist."
  exit 1
fi

# Check to see if the service is running.  If it is down, leave it down.
# It might be down for maintenance.
#
systemctl status ${DOTSERVICE} -l | grep "Active: active (running)" > /dev/null 2>&1
if [ ${?} -eq 1 ]; then
  exit 0
fi

# Check to see if slack is disconnected for the service. If you do not see a reconnect
# message, assume you're still connected and exit gracefully.
#
systemctl status ${DOTSERVICE} -l | egrep "Attempting reconnect|waiting for reconnect" > /dev/null 2>&1
if [ ${?} -eq 0 ]; then
  # Make sure you can ping the Slack API server.  If not, Slack might be down
  # or the datacenter might have a problem reaching it due to a network issue.
  # If you can't get to the Slack API server, exit.
  #
  ping -c 3 api.slack.com > /dev/null 2>&1
  if [ ${?} -ne 0 ]; then
    exit 0
  fi

  # If you've made it this far, the slack connector is disconnected, chatops service
  # is not down for maintenance reasons, and you can reach Slack API.  Restart the
  # service after some random delay between 1 and 9 seconds to prevent all of the 
  # hubots from connecting at the same moment.
  #
  sleep `grep IP /etc/sysconfig/network-scripts/ifcfg-ens160 | cut -d"." -f4 | cut -c1`
  logger -p local0.info "slack-adapter-watchdog.sh detected a disconnect.  Restarting ChatOps ${DOTSERVICE} service."
  systemctl restart ${DOTSERVICE} >/dev/null  2>&1 
fi

exit 0
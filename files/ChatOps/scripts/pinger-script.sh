#!/bin/bash
#
# pinger-script.sh - script to ping slack and google to check internet status
#

# Function to ping a host and return its status
#
ping_host() {
  ping -q -c 3 -W 3 ${1} > /dev/null 2>&1
  echo ${?}
}


# Ping Slack and Google to see which one(s) is/are pingable.
#
PINGSLACK=`ping_host api.slack.com`
PINGGOOGLE=`ping_host 8.8.8.8`


# Report if one or neither are pingable.
#
if [ ${PINGSLACK} -eq 0 -a ${PINGGOOGLE} -eq 0 ]; then
  exit 0
elif [ ${PINGSLACK} -eq 1 -a ${PINGGOOGLE} -eq 1 ]; then
  logger -p local0.info -t PINGER "Neither google nor api.slack.com are pingable."
  exit 1
elif  [ ${PINGSLACK} -eq 1 -a ${PINGGOOGLE} -eq 0 ]; then
  logger -p local0.info -t PINGER "google is pingable but api.slack.com is not."
  exit 1
else
  logger -p local0.info -t PINGER "api.slack.com is pingable but google is not."
  exit 1
fi

exit 0
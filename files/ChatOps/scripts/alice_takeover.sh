#!/bin/bash
#
# takeover.sh - Script to easily start/stop alice on a global server.
# 
# USAGE: 
#      takeover start alice
#      takeover stop alice
#      takeover status alice


###################################################################
# Setup
###################################################################


# Setup variables from arguments to the script.
#
STARTSTOP=${1}
WHATTOACTION=${2:-all}

# FUNCTION: Insert a blank line
#
blank_line()
{
  echo ""
}

# FUNCTION: enable and start a service.
# Takes an argument of a service.
#
enable_and_start()
{
  echo "Enabling and starting ${1} service...."
  systemctl enable ${1}
  systemctl start ${1}
  blank_line
}

# FUNCTION: disable and stop a service.
# Takes the argument of a service.
#
disable_and_stop()
{
  echo "Disabling and stopping ${1} service...."
  systemctl stop ${1}
  systemctl disable ${1}
  blank_line
}


###################################################################
# Main
###################################################################

case ${STARTSTOP} in
start)
  case ${WHATTOACTION} in
  alice)
      enable_and_start chatops-prod
      ;;
  esac
  ;;

stop)
  case ${WHATTOACTION} in
  alice)
      disable_and_stop chatops-prod
      ;;
  esac
  ;;

status)
  systemctl list-unit-files | egrep 'chatops|skynet|skyminion'
  blank_line
  for SERVICE in chatops-prod
  do
    systemctl status ${SERVICE} | egrep "Loaded|Active|service"
    blank_line
  done
  ;;

*)
  echo "Use the takeover script to start or stop chatops-prod (alice) manually on this server."
  blank_line
  echo "USAGE:"
  echo "      ${0} start alice"
  echo "      ${0} stop alice"
  echo "      ${0} status alice"
  blank_line
  ;;
esac

exit 0

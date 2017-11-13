#!/bin/bash
#
# takeover.sh - Script to easily start/stop skynet-prod/skyminion on a global server.
# 
# USAGE: 
#      takeover start skynet
#      takeover stop skynet
#      takeover status skynet


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
  skynet)
      enable_and_start skynet-prod
      enable_and_start skyminion
      ;;
  esac
  ;;

stop)
  case ${WHATTOACTION} in
  skynet)
      disable_and_stop skynet-prod
      disable_and_stop skyminion
      ;;
  esac
  ;;

status)
  systemctl list-unit-files | egrep 'skynet|skyminion'
  blank_line
  for SERVICE in skynet-prod skyminion
  do
    systemctl status ${SERVICE} | egrep "Loaded|Active|service"
    blank_line
  done
  ;;

*)
  echo "Use the takeover script to start or stop skynet-prod/skyminion manually on this server."
  blank_line
  echo "USAGE:"
  echo "      ${0} start skynet"
  echo "      ${0} stop skynet"
  echo "      ${0} status skynet"
  blank_line
  ;;
esac

exit 0

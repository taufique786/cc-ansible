#!/bin/bash
#
# takeover.sh - Script to easily start/stop chatops and skynet on a ChatOps global server.
#               Takes two arguments: one to start/stop/status a service and the second to
#               pick a particular service or all.  Default is all.
# 
# USAGE: 
#      takeover.sh start [chatops|chatops-prod|skynet|skynet-prod|all]
#      takeover.sh stop [chatops|chatops-prod|skynet|skynet-prod|all]
#      takeover.sh status [chatops|chatops-prod|skynet|skynet-prod|all]
#
# EXAMPLES:
#      takeover.sh start chatops
#      takeover.sh stop skynet-prod
#      takovrer.sh status
#


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
  chatops|chatops-prod)
      enable_and_start chatops-prod
      ;;
  skynet|sknet-prod)
      enable_and_start skynet-prod
      enable_and_start skyminion
      ;;
  all)
      enable_and_start chatops-prod
      enable_and_start skynet-prod
      enable_and_start skyminion
      ;;
  esac
  ;;

stop)
  case ${WHATTOACTION} in
  chatops|chatops-prod)
      disable_and_stop chatops-prod
      ;;
  skynet|sknet-prod)
      disable_and_stop skynet-prod
      disable_and_stop skyminion
      ;;
  all)
      disable_and_stop chatops-prod
      disable_and_stop skynet-prod
      disable_and_stop skyminion
      ;;
  esac
  ;;

status)
  systemctl list-unit-files | egrep 'chatops|skynet|skyminion'
  blank_line
  for SERVICE in chatops-prod skynet-prod skyminion
  do
    systemctl status ${SERVICE} | egrep "Loaded|Active|service"
    blank_line
  done
  ;;

*)
  echo "Use the takeover script to start or stop chatops-prod or skynet-prod/skyminion manually on this server."
  blank_line
  echo "USAGE:"
  echo "      ${0} start [chatops|chatops-prod|skynet|skynet-prod|all]"
  echo "      ${0} stop [chatops|chatops-prod|skynet|skynet-prod|all]"
  echo "      ${0} status [chatops|chatops-prod|skynet|skynet-prod|all]"
  blank_line
  echo "EXAMPLES:"
  echo "         ${0} start chatops"
  echo "         ${0} start skynet-prod"
  echo "         ${0} status"
  blank_line
  ;;
esac

exit 0


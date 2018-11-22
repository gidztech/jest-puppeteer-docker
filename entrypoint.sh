#!/bin/sh

HOST_DOMAIN="host.docker.internal"
ping -q -c1 $HOST_DOMAIN > /dev/null 2>&1
if [ $? -ne 0 ]; then
  # Try using default interface
  DOCKER_IP="$(ip -4 route show default | cut -d' ' -f3)"
  ping -q -c1 $DOCKER_IP > /dev/null 2>&1
  if [ $? -e 0 ]; then
      # Default interface was good so patch hosts
      echo -e $DOCKER_IP '\thost.docker.internal' >> /etc/hosts
  else 
      # Try eth0 instead and then patch hosts
      DOCKER_IP="$(ip addr show eth0 | grep 'inet ' | awk '{ print $2}' | cut -d'/' -f1)"
      echo -e $DOCKER_IP '\thost.docker.internal' >> /etc/hosts
  fi  
fi

# Taken from https://github.com/alpeware/chrome-headless-trunk/blob/master/start.sh
###
# Run the NSSDB updating utility in background
import_cert.sh $HOME &
CHROME_ARGS="--disable-gpu --headless --no-sandbox --remote-debugging-address=$DEBUG_ADDRESS --remote-debugging-port=$DEBUG_PORT --user-data-dir=/data --disable-dev-shm-usage"
if [ -n "$CHROME_OPTS" ]; then
  CHROME_ARGS="${CHROME_ARGS} ${CHROME_OPTS}"
fi
# Start Chrome
sh -c "/usr/bin/google-chrome-unstable $CHROME_ARGS"
###
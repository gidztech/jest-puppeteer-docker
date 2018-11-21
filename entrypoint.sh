#!/bin/sh

HOST_DOMAIN="host.docker.internal"
DOCKER_IP="$(getent hosts host.docker.internal | cut -d' ' -f1)"
if [ ! $DOCKER_IP ]; then
  DOCKER_IP=$(ip -4 route show default | cut -d' ' -f3)
  echo -e "$DOCKER_IP\t$HOST_DOMAIN" >> /etc/hosts
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

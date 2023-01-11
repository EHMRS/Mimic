#!/bin/sh

if [ -z $UPSTREAMHOST ]; then
    UPSTREAMHOST="wss://mimicws.ehmr.org.uk:443/"
fi

for a in $(ls /app/assets/*.js); do
  sed -i "s#ws://localhost:4000#$UPSTREAMHOST#g" $a
done

nginx -g "daemon off;"

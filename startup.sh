#!/bin/sh
set -eu
cd /workspace
node scripts/preview.mjs stop || true

pin_target() {
  curl -sf -o /dev/null --max-time 2 \
    -X POST http://127.0.0.1:6015/__control/target \
    -H 'content-type: application/json' \
    -d '{"port":8080}' || true
}

if ! curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  npm run dev >>/tmp/app-startup.log 2>&1 &
fi
pin_target

if [ ! -f /tmp/preview-watch.pid ] || ! kill -0 "$(cat /tmp/preview-watch.pid)" 2>/dev/null; then
  (
    while true; do
      if ! curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
        npm run dev >>/tmp/app-startup.log 2>&1 &
        sleep 3
      fi
      curl -sf -o /dev/null --max-time 2 \
        -X POST http://127.0.0.1:6015/__control/target \
        -H 'content-type: application/json' \
        -d '{"port":8080}' || true
      sleep 15
    done
  ) >>/tmp/preview-watch.log 2>&1 &
  echo $! >/tmp/preview-watch.pid
fi

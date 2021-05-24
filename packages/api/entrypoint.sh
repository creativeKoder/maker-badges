#!/bin/bash
#**
#*  +-+-+-+-+-+-+-+-+
#*  |M|a|K|3|r|D|^|0|  ~> ∞ & ⤼
#*  +-+-+-+-+-+-+-+-+
#*
#*  handcoded with 🤍 by 0xjO5i <0x@josi.io>
#*/

set -e

cd /maker/badges

source /maker/badges/.env

yarn start:prod &
badges_pid=$!

trap onexit INT
function onexit() {
  kill -9 $badges_pid
}

ngrok start mkr

exec "$@"

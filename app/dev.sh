#! /bin/bash 
###########################################
#
###########################################

# constants
baseDir=$(cd `dirname "$0"`;pwd)
export PYTHONUNBUFFERED=1
export PATH=/opt/miniconda3/envs/venv-py3/bin:$PATH

# functions

# main 
[ -z "${BASH_SOURCE[0]}" -o "${BASH_SOURCE[0]}" = "$0" ] || return
cd $baseDir
if [ ! -d node_modules/nodemon ]; then
    npm install nodemon
fi

cd $baseDir
if [ -f .env ]; then
    source .env; node_modules/nodemon/bin/nodemon.js --exec python3 echo_bot.py
else
    echo "$baseDir/.env not found, copy a sample with $baseDir/sample.env, customize variables with doc https://github.com/chatopera/chatopera.feishu"
    exit 1
fi




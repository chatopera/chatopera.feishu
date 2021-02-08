#! /bin/bash 
###########################################
#
###########################################

# constants
baseDir=$(cd `dirname "$0"`;pwd)
appHome=$baseDir/..
registry=
imagename=chatopera/feishu

# functions

# main 
[ -z "${BASH_SOURCE[0]}" -o "${BASH_SOURCE[0]}" = "$0" ] || return
cd $appHome
GIT_COMMIT_SHORT=`git rev-parse --short HEAD`

docker build \
    --no-cache=true \
    --force-rm=true --tag $imagename:$GIT_COMMIT_SHORT .

if [ $? -eq 0 ]; then
    set -x
    docker tag $imagename:$GIT_COMMIT_SHORT $imagename:develop
fi


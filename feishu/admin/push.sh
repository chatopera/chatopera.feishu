#! /bin/bash 
###########################################
#
###########################################

# constants
baseDir=$(cd `dirname "$0"`;pwd)
export PYTHONUNBUFFERED=1
export PATH=/opt/miniconda3/envs/venv-py3/bin:$PATH
imagename=chatopera/feishu

# functions

# main 
[ -z "${BASH_SOURCE[0]}" -o "${BASH_SOURCE[0]}" = "$0" ] || return
cd $baseDir/..
GIT_COMMIT_SHORT=`git rev-parse --short HEAD`

docker push $imagename:$GIT_COMMIT_SHORT

if [ $? -eq 0 ]; then
    docker push $imagename:develop
    docker tag $imagename:$GIT_COMMIT_SHORT $imagename:develop
else
    echo "Image not found ["$imagename:$GIT_COMMIT_SHORT"]"
fi
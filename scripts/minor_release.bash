#!/bin/bash
pwd
git remote set-url --push origin $(echo $CI_REPOSITORY_URL | perl -pe 's#.*@(.+?(\:\d+)?)/#git@\1:#')
cd node
npm version minor
NEXT_VER=$(node -p "require('./package.json').version")
git commit -am "Release $NEXT_VER"
git push origin HEAD:ci
git tag -a $NEXT_VER -m "Release $NEXT_VER"
git push origin $NEXT_VER

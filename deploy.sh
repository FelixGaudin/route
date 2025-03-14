#!/usr/bin/env sh

npm run build

git add -f dist && git commit -m 'adding dist subtree'

git subtree push --prefix dist origin gh-pages

# source : https://learnvue.co/tutorials/deploy-vue-to-github-pages
#!/bin/bash

set -e

# Force checkout to the build branch
git checkout --force build
echo "Switched to branch build"

# Copy all contents from dist to the parent directory, including hidden files
shopt -s dotglob
cp -r dist/* .
echo "Copied all contents from dist to the parent directory"

# Delete the dist directory
rm -rf dist
echo "Deleted directory dist"

# Add all changes to the index
git add -A
echo "Added all changes to the index"

# Commit the changes
git commit -m "Commit message"
echo "Committed the changes"

# Push the changes to the remote build branch
git push origin build
echo "Pushed changes to branch build on remote repository"

git checkout --force main
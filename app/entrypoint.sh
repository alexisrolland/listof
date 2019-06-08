#!/bin/sh
# Build app and serve it for production
if [ "$1" = "prod" ]
then
    # Minify Javascript files and create distribution folder (dist)
    npm run build
    
    # Move files to app root folder
    cp ./dist/* .

    # Delete all unnecessary files
    rm -rf ./dist
    rm -rf ./node_modules
    rm -rf ./public
    rm -rf ./src

    # Serve files from current folder /srv/app
    http-server .

# Serve app for development
else
    # Run app in development mode
    npm run serve
fi
#!/bin/sh
# Build app and serve it for production
if [ "$1" = "prod" ]
then
    # Minify Javascript files and create distribution folder (dist)
    npm run build
    
    # Delete all unnecessary files except dist folder and index.html
    rm -rf ./libs
    rm -rf ./node_modules
    rm -rf ./package*.json
    rm -rf ./src
    rm -rf ./webpack.config.js

    # Serve files from current folder /srv/app
    http-server .

# Serve app for development
else
    # Run app in development mode
    npm run dev
fi
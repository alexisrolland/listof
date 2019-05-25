FROM node:lts-alpine

# Project files
ARG PROJECT_DIR=/srv/app
RUN mkdir -p $PROJECT_DIR
WORKDIR $PROJECT_DIR

# Copy both 'package.json' and 'package-lock.json' (if available)
COPY ./init/package*.json ./

# Install http-server to serve files to Nginx for production
RUN npm install -g http-server

# Install Vue CLI
RUN npm install -g vue-cli

# Install project dependencies
RUN npm install \
    && npm install --save vue-router \
    && npm install --save vue-resource \
    && npm install --save vuex \
    && npm install --save lodash \
    && npm install --save inflection \
    && npm install --save vue-session \
    && npm install --save @riophae/vue-treeselect \
    && npm install --save papaparse

# Copy project files and folders to the current working directory
COPY ./entrypoint.sh ./
COPY ./init/ ./

# Use entrypoint to differentiate build process between dev and prod
ENTRYPOINT [ "./entrypoint.sh" ]
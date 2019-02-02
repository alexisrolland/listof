FROM node:lts-alpine

# Project files
ARG PROJECT_DIR=/srv/app
RUN mkdir -p $PROJECT_DIR
WORKDIR $PROJECT_DIR

# Copy both 'package.json' and 'package-lock.json' (if available)
COPY ./init/package*.json ./

# Install project dependencies
RUN npm install \
    && npm install --save vue-router \
    && npm install --save vue-resource \
    && npm install --save vuex \
    && npm install --save inflection

# Copy project files and folders to the current working directory (i.e. '/srv/app' folder)
COPY ./init/ .
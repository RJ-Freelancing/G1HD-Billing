FROM node:8-alpine as serverBuilder

WORKDIR /src

# Install all app dependencies
COPY server/package.json .
RUN yarn cache clean && yarn

# Bundle app files
COPY server/. .

# Build app
RUN yarn build


FROM node:8-alpine as clientBuilder

WORKDIR /src

# Install all app dependencies
COPY client/package.json .
RUN yarn cache clean && yarn

# Bundle app files
COPY client/. .

ENV NODE_PATH src/
# Build app
RUN yarn build


# Prepare build for production
FROM keymetrics/pm2:8-alpine

WORKDIR /usr/src/app

# Copy server build files
COPY --from=serverBuilder /src/build/ .

# Move client directory to server frontend with express
RUN mkdir -p client

# Copy client build files
COPY --from=clientBuilder /src/build/ client/

# Use json-merge to merge package dependices from server and client
RUN yarn global add json-merge
COPY client/package.json client-package.json
COPY server/package.json server-package.json

RUN OUTPUT=$(json-merge server-package.json --parse="dependencies" client-package.json --parse="dependencies")
RUN echo -n '{ "name": "g1hd","version": "0.1.0", "description": "g1HD Billing", "license": "Apache-2.0", "private": true," dependencies":' > package.json
RUN echo " $OUTPUT }" >> package.json

# Install production and client app dependencies
RUN yarn cache clean && yarn

CMD [ "pm2-runtime", "index.js" ]
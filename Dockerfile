# builder image
FROM node:22.13.0-bookworm-slim AS builder

# set the working directory
WORKDIR /app

# copy the package.json
COPY package.json /app/

# install dependencies, timeout for arm64
RUN yarn install --network-timeout 1000000


# runner image
FROM node:22.13.0-bookworm-slim AS runner

# login as node user
USER node

# set the working directory
WORKDIR /home/node

# copy node_modules from builder
COPY --chown=node:node --from=builder /app/node_modules /home/node/node_modules

# copy project
COPY --chown=node:node . /home/node

EXPOSE 3000

CMD [ "yarn",  "start", "--host", "0.0.0.0" ]
FROM node:16

RUN apt-get update
RUN mkdir /frontend
RUN apt-get install yarn -y
RUN npm install -g npm@latest
RUN npm install -g @nrwl/cli
RUN yarn set version berry
WORKDIR /frontend
COPY package.json package.json
COPY yarn.lock yarn.lock

COPY . .
RUN yarn --network-timeout 100000
ENTRYPOINT ["yarn"]

# docker buildx build --push --tag git.imp.fu-berlin.de:5000/kalila/deployment:frontend-builder -f builder.Dockerfile -otype=image --platform=linux/arm64,linux/amd64  .

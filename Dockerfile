FROM node:16

RUN apt-get update
RUN mkdir /frontend
RUN apt-get install yarn -y
RUN npm install -g @nrwl/cli

WORKDIR /frontend
COPY package.json package.json
COPY yarn.lock yarn.lock

COPY . .
RUN yarn --network-timeout 100000
RUN nx build kalila --verbose
ENV NODE_OPTIONS='--max_old_space_size=8192'
CMD ["nx", "run", "kalila:serve", "--prod" ,"--port=6000 "]

# docker buildx build --push --tag git.imp.fu-berlin.de:5000/kalila/deployment:frontend -otype=image --platform=linux/arm64,linux/amd64  .
# docker buildx build --push --tag git.imp.fu-berlin.de:5000/kalila/deployment:frontend -otype=image --platform=linux/amd64  .

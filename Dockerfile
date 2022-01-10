FROM node:16-slim

RUN apt-get update
RUN mkdir /frontend
RUN apt-get install yarn -y
RUN npm install -g @nrwl/cli

WORKDIR /frontend
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn --network-timeout 100000
COPY . .
RUN nx build kalila --verbose
CMD ["nx", "run", "kalila:serve", "--prod" ,"--port=6000 "]

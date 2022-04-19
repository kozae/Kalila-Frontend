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

CMD ["NODE_OPTIONS=--max_old_space_size=4096","nx", "run", "kalila:serve"]

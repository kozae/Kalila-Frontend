FROM bitnami/node:16

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
ENV NODE_OPTIONS='--max_old_space_size=8192'
CMD ["yarn","nx", "run", "kalila:serve", "--prod" ,"--port=6000 "]

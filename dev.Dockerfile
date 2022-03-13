FROM bitnami/node:17

RUN apt-get update
RUN mkdir /frontend
RUN apt-get install yarn -y
RUN npm install -g @nrwl/cli

WORKDIR /frontend
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn --network-timeout 100000
COPY . .

CMD ["nx", "run", "kalila:serve", "--port=6000 "]

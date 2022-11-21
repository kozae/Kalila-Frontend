FROM bitnami/node:16

RUN apt-get update
RUN mkdir /frontend
RUN apt-get install yarn -y
RUN npm install -g @nrwl/cli

# Update new packages
RUN apt-get update


WORKDIR /frontend
COPY package.json package.json
COPY yarn.lock yarn.lock

COPY . .
RUN yarn --network-timeout 100000
ENV NODE_OPTIONS='--max_old_space_size=8192'
CMD ["yarn", "start", "--port=6000"]

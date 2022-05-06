FROM bitnami/node:16

RUN apt-get update
RUN mkdir /frontend
RUN apt-get install yarn -y
RUN npm install -g @nrwl/cli
RUN apt-get install -y \
    build-essential \
    curl

# Update new packages
RUN apt-get update

# Get Rust
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y

RUN echo 'source $HOME/.cargo/env' >> $HOME/.bashrc
WORKDIR /frontend
COPY package.json package.json
COPY yarn.lock yarn.lock

COPY . .
RUN yarn --network-timeout 100000
ENV NODE_OPTIONS='--max_old_space_size=8192'
CMD ["yarn", "start"]

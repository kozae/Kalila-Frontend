# Install dependencies only when needed
FROM node:16-slim AS deps

RUN apt-get update
RUN apt-get install yarn -y
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-slim AS builder
RUN apt-get update
RUN npm install -g @nrwl/cli
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Production image, copy all the files and run next
FROM node:16-slim AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist/apps/kalila ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 6000

ENV PORT 6000


CMD ["yarn", "start"]

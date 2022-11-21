FROM git.imp.fu-berlin.de:5000/kalila/deployment:frontend-builder

RUN yarn nx build kalila --verbose
ENV NODE_OPTIONS='--max_old_space_size=8192'
CMD ["yarn","nx", "run", "kalila:serve", "--prod" ,"--port=6000 "]

# docker buildx build --push --tag git.imp.fu-berlin.de:5000/kalila/deployment:frontend -otype=image --platform=linux/arm64,linux/amd64  .
# docker buildx build --push --tag git.imp.fu-berlin.de:5000/kalila/deployment:frontend -otype=image --platform=linux/amd64  .

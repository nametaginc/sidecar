FROM node
WORKDIR /src
COPY * /src
RUN yarn build
CMD ["yarn", "serve"]


FROM node:12-alpine as builder
ENV NODE_ENV build
USER node
WORKDIR /home/node
COPY --chown=node:node . /home/node
RUN npm install \
    && npm run test \
    && npm run build
# ---
FROM node:12-alpine
ENV NODE_ENV production
USER node
WORKDIR /home/node
COPY --chown=node:node --from=builder /home/node/dist/ /home/node/dist
COPY --chown=node:node --from=builder /home/node/package*.json /home/node/
RUN npm ci
CMD ["node", "dist/main.js"]

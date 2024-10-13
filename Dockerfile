FROM node:20.5.1-slim

RUN npm install -g @nestjs/cli@10.2.1

USER node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]
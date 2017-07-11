FROM node:8.1-alpine

COPY src /opt/deck
WORKDIR /opt/deck

RUN ["npm", "install"]

RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64
RUN chmod +x /usr/local/bin/dumb-init

EXPOSE 4778
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "start"]

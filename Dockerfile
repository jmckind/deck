FROM node:8.1-alpine

COPY src /opt/deck
WORKDIR /opt/deck

RUN ["npm", "install"]

EXPOSE 4778
CMD ["npm", "start"]

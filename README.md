# deck

RESTful API backend for a simple LMS.

### Development

First, start up an instance of rethinkdb.

```
docker run -d --name rethinkdb -p 8080:8080 -p 28015:28015 -p 29015:29015 rethinkdb:2.3
```

Copy the configuration sample and change as needed.

```
cp config.js.sample config.js
```

Run the development container.

```
docker run -it --name deck-dev \
  -v `pwd`/src:/opt/deck \
  -v `pwd`/config.js:/etc/deck/config.js \
  -p 4778:4778 \
  --link rethinkdb:rethinkdb \
  node:8.1 /bin/bash
```

Once inside the running development container, install the application dependencies.

```
cd /opt/deck
npm install
```

Once the dependencies are installed, run the application.

```
npm start
```

### Build

Build the Docker image for the application.

```
docker build -t deck:latest .
```

### Deploy

First, ensure that an instance of rethinkdb is available.

```
docker run -d --name rethinkdb -p 8080:8080 -p 28015:28015 -p 29015:29015 rethinkdb:2.3
```

Next, copy the configuration sample and change as needed.

```
cp config.js.sample config.js
```

Finally, run the application container.

```
docker run -it -v `pwd`/config.js:/etc/deck/config.js -p 4778:4778 --link rethinkdb:rethinkdb deck:latest
```

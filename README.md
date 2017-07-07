# deck

RESTful API backend for a simple LMS.

### Development

First, start up an instance of rethinkdb.

```
make rethinkdb
```

Copy the configuration sample and change as needed.

```
make setup
```

Run the development container.

```
make develop
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
make image
```

### Deploy

First, ensure that an instance of rethinkdb is available.

```
make rethinkdb
```

Next, copy the configuration sample and change as needed.

```
make setup
```

Finally, run the application container.

```
docker run -it -v `pwd`/config.js:/etc/deck/config.js -p 4778:4778 --link rethinkdb:rethinkdb deck:latest
```

RETHINKDB_IMAGE=rethinkdb:2.3
NODEJS_IMAGE=node:8.1
APP_NAME=deck

.PHONY: setup
setup:
	cp config.js.sample config.js

.PHONY: rethinkdb
rethinkdb:
	docker run -d \
		--name rethinkdb \
		--publish 8080:8080 \
		--publish 28015:28015 \
		--publish 29015:29015 \
		$(RETHINKDB_IMAGE)

.PHONY: develop
develop:
	docker run -it \
		--name $(APP_NAME)-dev \
	  --volume `pwd`/src:/opt/deck \
	  --volume `pwd`/config.js:/etc/deck/config.js \
	  --publish 4778:4778 \
	  --link rethinkdb:rethinkdb \
	  $(NODEJS_IMAGE) /bin/bash

.PHONY: reset
reset:
	docker rm -f $(APP_NAME)-dev

.PHONY: image
image:
	docker build -t $(APP_NAME):latest .

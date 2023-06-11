# 🐺Wolf Project

## Project Structure

`server/`: backend code

`app/`: front end code

## Local Development

### clone the repo

SSH:

```bash
git clone git@github.com:thomas81528262/wolf.git
```

### prerequest installation

1. nodejs (10.x and higher)
2. postgresql db (local)  
    a. create local database called `postgres`  
    b. create local user called `postgres`  
    c. set password = `test`  
    d. enforce password login with pg_hba.conf METHOD = `md5`  
    e. set environment variable `EXPORT POSTGRES_USER=postgres`  
    f. set environment variable `EXPORT POSTGRES_DB=postgres`  
    g. load initial data into the db: `bash ./db/docker-entrypoint-initdb.d/init-wolf-db.sh`  

### run local db by docker-compose


```bash
# ⚠️ only if you are running the dev-db first time or you want to clean the db
$ npm run clean-dev-db
```

```bash
#turn on the db and run under background
$ docker-compose up -d
#turn off the db
$ docker-compose down
```

### read doc

follow the README.md instruction under the `/app` and `/server`

## Installation and building

### install node

#### Mac

`$ brew install node` or visit [here](https://nodejs.org/en/download/) to download the installer

#### Windows

Go [here](https://nodejs.org/en/download/) to download the installer

### Using docker

#### install docker

Go [here](https://docs.docker.com/engine/install/) to select the installer according to your OS platform

#### Modify Dockerfile

change the directory location accordingly

#### Docker Basic Command

```bash
$ docker build -t {app_name} .

$ docker image

# you should see built image(s) here

$ docker ps

# you can see the container ID (optional)

$ docker logs {your_container_ID}

# get some output from the server (optional)

$ docker run -p {export_port}:8080 -d {app_name}

# run the image
# to test the app open localhost:{port#}
# e.g. localhost:5566

```

#### mount local folder

```bash
$ docker run  -p 4000:4000 -v {src_path_in_your_host}:{path_inside_the_docker_image}  -it node:10 /bin/sh

# the container will mount the local folder from your host
```



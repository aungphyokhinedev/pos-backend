[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# micro-sso

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run lint`: Run ESLint
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose


#Run mongo db replica
run-rs -l ubuntu1804 --keep
// "mongo_uri": "mongodb://localhost:27017,localhost:27018,localhost:27019/micro-sso?replicaSet=rs",

admin:$apr1$jf6Jdquu$HENM1YKi8mBGHQiS/gZBU1
treafik
https://containo.us/blog/traefik-2-0-docker-101-fc2893944b9d/

#docker 
#enter on container
docker exec -it <mycontainer> bash
#network connect
docker network connect my-network microsso
docker logs microsso
docker run -d --name microsso  microsso
docker build -t microsso .
docker-compose up -d
docker exec container env
docker exec -ti web1 ping web2
# Welcome to transcendence ✨

This project is about creating a website for the mighty **Pong** contest!

Thanks to this website, users can play Pong with others. There is a nice user
interface, a chat, and real-time multiplayer online game!

<br />

# Project structure

```txt
    .                           
    ├── Makefile                      # Docker compose up/down the project
    ├── /doc                          # Documentation files
    ├── /srcs                         # Source files
    |   ├── .env                      # /!\ NOT IN THE REPO, TO BE ADDED AFTER
    │   ├── docker-compose.yml        # To build production application
    │   ├── docker-compose.dev.yml    # To build development application
    │   ├── /client                   # - REACTJS ----------------------------------
    |   │   ├── /conf                 # Configuration of nginx server for production
    |   │   ├── /public               # React app public files
    |   │   ├── /srcs                 # React app src file
    |   |   ├── Dockerfile            # Dockerfile : production container   
    |   |   ├── Dockerfile.dev        # Dockerfile : development container
    │   ├── /server                   # - NESTJS -----------------------------------
    |   │   ├── /src                  # Nest app src files
    |   |   ├── Dockerfile            # Dockerfile : production container   
    |   |   ├── Dockerfile.dev        # Dockerfile : development container
    │   ├── /database                 # - POSTGRESQL -------------------------------
    └── ...
      
```

<br />

# Installation

Be sure that you have **Docker** and **Docker compose** installed on you machine.
Follow instructions on Docker website to [install Docker Engine](https://docs.docker.com/engine/install/). 

Clone the repo and install module dependencies
```sh
git clone git@github.com:twagger/ft_transcendence.git
cd ft_transcendence
cd ./srcs/client && npm install
cd ./srcs/server && npm install
```
Make dev to build the application **dev environment** :
```sh
make dev
```

Make dev to build the application **production environment** :
```sh
make
```

To access the services (reactJS) :
```
https://localhost:3000        # Client (ReactJS)
https://localhost:4200        # Server (NestJS) 
port 5432 with psql           # Database (PGSQL)
```

<br />

# Authors

👨 **firstName LASTNAME**

* Github: [@author](https://github.com/author/)

<br />

# Resources
* ...
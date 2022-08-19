# COMMANDS
################################################################################
RM						:= rm -rf
CD						:= cd
DOCKER				:= docker
DOCKERIMG			:= docker image
DCOMPOSE			:= docker-compose
TOUCH					:= touch
MKDIR					:= mkdir -p
REPLACE				:= sed -i
UNAME_S 			:= $(shell uname -s)
PRINT				:= echo

# Colors 
################################################################################
GREEN        = \033[1;32m
BLUE		 = \033[1;34m
CYAN         = \033[1;36m
RESET		 = \033[0m

# SOURCES
################################################################################
DCOMPOSEFILE	= docker-compose.yml

# DIRECTORIES
################################################################################
SRCS					:= ./srcs

# ENVIRONMENTS
################################################################################

ifeq ($(UNAME_S),Darwin)
	REPLACE = sed -i'' -e
endif

ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
ifeq (build,$(firstword $(MAKECMDGOALS)))
    BUILD_ENV := $(word 1, $(ARGS))
    $(eval $(ARGS):;@:)
else ifeq (clean, $(firstword $(MAKECMDGOALS)))
    BUILD_ENV := $(word 1, $(ARGS))
    $(eval $(ARGS):;@:)
else ifeq (fclean, $(firstword $(MAKECMDGOALS)))
    BUILD_ENV := $(word 1, $(ARGS))
    $(eval $(ARGS):;@:)
else ifeq (test,$(firstword $(MAKECMDGOALS)))
    CLIENT_OR_SERVER := $(word 1,$(ARGS))
    TEST_TYPE := $(word 1,$(ARGS))
    $(eval $(ARGS):;@:)
endif

ifeq ($(BUILD_ENV), dev)
	DCOMPOSEFILE	= docker-compose.dev.yml
	ENVFILE = .env.dev
	RUNNING_ENV = dev
else ifeq ($(BUILD_ENV), test)
	DCOMPOSEFILE	= docker-compose.dev.yml
	ENVFILE = .env.dev
	RUNNING_ENV = test.int
else
	DCOMPOSEFILE	= docker-compose.yml
	ENVFILE = .env
	RUNNING_ENV = prod
endif

# EXECUTABLES & LIBRARIES
################################################################################
NAME				:= .done
SERVER				:= $(SRCS)/server
CLIENT				:= $(SRCS)/client
DATABASE			:= $(SRCS)/database

# FLAGS
################################################################################
UP					:= up --build -d
DOWN				:= down
REMOVEALL			:= --rmi all --remove-orphans -v

# Global Rule
################################################################################
$(NAME):		
					@touch $(NAME)

.PHONY:				all
all:				build

.PHONY:				build
build:					$(NAME)
						$(REPLACE) "s/RUNNING_ENV=.*/RUNNING_ENV=${RUNNING_ENV}/" \
							$(SRCS)/$(ENVFILE)
						$(DCOMPOSE) -f $(SRCS)/$(DCOMPOSEFILE) \
												--env-file $(SRCS)/$(ENVFILE) $(UP)

# Tests
################################################################################
.PHONY:				test
test:
						docker exec -w /app $(CLIENT_OR_SERVER) npm run test:$(TEST_TYPE)

# Stop & Cleaning Rules
################################################################################
.PHONY:				stop
stop:					
							$(DCOMPOSE) -f $(SRCS)/$(DCOMPOSEFILE) \
											--env-file $(SRCS)/$(ENVFILE) $(DOWN)

.PHONY:				clean
clean:
							# Stops containers and remove images + volumes
							$(DCOMPOSE) -f $(SRCS)/$(DCOMPOSEFILE) \
								--env-file $(SRCS)/$(ENVFILE) $(DOWN) $(REMOVEALL)	
							$(RM) .done

.PHONY:				fclean
fclean:				clean cleandocker cleannode

.PHONY:				cleandocker
cleandocker:	
						# Clean all : stops containers, remove images, volumes, network
						$(DOCKER) system prune --all --force --volumes
						$(DOCKER) network prune --force
						$(DOCKER) volume prune --force
						$(DOCKER) image prune --force

.PHONY:				cleannode
cleannode:		
							# clean node_modules
							$(RM) $(CLIENT)/node_modules
							$(RM) $(SERVER)/node_modules

.PHONY:				re
re:						fclean all

# Help & documentation
################################################################################
.PHONY:				help
help:
					@$(PRINT) "\n$(CYAN) make build:$(RESET)\n"\
						" Usage: make build [ dev | prod | test ].\n" \
						" Builds a choosen enviroment using docker-compose. \
Accepts either of these three arguments:\n" \
						" - dev to build a development environment.\n" \
						" - prod to build a production environment.\n" \
						" - test to build a testing environment where you can run \
tests with specific commands e.g.: make test_server.\n" \
						" When nothing is specified, defaults to building prod.\n"

					@$(PRINT) "$(CYAN) make test:$(RESET)\n" \
						" Usage: make test [ client | server ] [ int | e2e ].\n" \
						" Runs tests on the testing environment built with the command 'make build test'.\n" \
						" Example: make test server int, make test client e2e.\n"

					@$(PRINT) "$(CYAN) make clean, fclean:$(RESET)\n"\
					" Usage: make [ clean | fclean ].\n" \
					" Clean Stops all running containers and remove the images and volumes.\n"\
					" Fclean does all of the above and deletes the folder node_modules\
from the server and the client directories, deletes the networks and prunes the system.\n"

					@$(PRINT) "$(CYAN) make stop:$(RESET)\n"\
					" Stops all running containers.\n"

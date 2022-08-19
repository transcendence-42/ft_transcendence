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

ifeq ($(PROD),)
	DCOMPOSEFILE	= docker-compose.yml
	ENVFILE = .env
	RUNNING_ENV = prod
endif

ifeq ($(DEV),)
	DCOMPOSEFILE	= docker-compose.dev.yml
	ENVFILE = .env.dev
	RUNNING_ENV = dev
endif

ifeq ($(TESTINT),)
	DCOMPOSEFILE	= docker-compose.dev.yml
	ENVFILE = .env.dev
	RUNNING_ENV = test.int
endif

# EXECUTABLES & LIBRARIES
################################################################################
NAME					:= .done
SERVER				:= $(SRCS)/server
CLIENT				:= $(SRCS)/client
DATABASE			:= $(SRCS)/database

# FLAGS
################################################################################
UP						:= up --build -d
DOWN					:= down
REMOVEALL			:= --rmi all --remove-orphans -v

# RULES
################################################################################
$(NAME):		
							@touch $(NAME)

.PHONY:				all
all:					$(NAME)
							# Build images and run containers
							$(REPLACE) "s/RUNNING_ENV=.*/RUNNING_ENV=${RUNNING_ENV}/" \
								$(SRCS)/$(ENVFILE)
							$(DCOMPOSE) -f $(SRCS)/$(DCOMPOSEFILE) \
													--env-file $(SRCS)/$(ENVFILE) $(UP)
													
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

.PHONY:				DEV
.PHONY:				PROD

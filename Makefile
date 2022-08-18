# COMMANDS
################################################################################
RM						:= rm -rf
CD						:= cd
DOCKER				:= docker
DOCKERIMG			:= docker image
DCOMPOSE			:= docker-compose
TOUCH					:= touch
MKDIR					:= mkdir -p

# SOURCES
################################################################################
DCOMPOSEFILE	= docker-compose.yml

# DIRECTORIES
################################################################################
SRCS					:= ./srcs

# ENVIRONMENTS
################################################################################

ifeq ($(PROD), true)
	DCOMPOSEFILE	= docker-compose.yml
	ENVFILE = .env
endif

ifeq ($(DEV), true)
	DCOMPOSEFILE	= docker-compose.dev.yml
	ENVFILE = .env.dev
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
							$(DCOMPOSE) -f $(SRCS)/$(DCOMPOSEFILE) \
													--env-file $(SRCS)/$(ENVFILE) $(UP)
													
.PHONY:				stop
stop:					$(DCOMPOSE) -f $(SRCS)/$(DCOMPOSEFILE) \
													--env-file $(SRCS)/$(ENVFILE)$(DOWN)

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

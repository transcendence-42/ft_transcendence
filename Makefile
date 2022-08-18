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
ENVFILE				= --env-file .env
DCOMPOSEFILE	= -f docker-compose.yml

# EXECUTABLES & LIBRARIES
################################################################################
NAME					:= .done
SERVER				:= $(SRCS)/server
CLIENT				:= $(SRCS)/client
DATABASE			:= $(SRCS)/database

# DIRECTORIES
################################################################################
SRCS					:= ./srcs

# FLAGS
################################################################################
UP						:= up -d
DOWN					:= down
REMOVEALL			:= --rmi all --remove-orphans -v

# RULES
################################################################################
$(NAME):		
							@touch $(NAME)

.PHONY:				all
all:			
							# Build images and run containers
							$(CD) $(SRCS) && $(DCOMPOSE) $(DCOMPOSEFILE) $(ENVFILE) $(UP)	

.PHONY:				clean
clean:
							# Stops containers and remove images + volumes
							$(CD) $(SRCS) && $(DCOMPOSE) $(DCOMPOSEFILE) $(ENVFILE) $(DOWN) 
															 $(REMOVEALL)
							$(RM) .done

.PHONY:				fclean
fclean:				clean cleandocker cleannode

.PHONY:				fcleandev
fcleandev:		DCOMPOSEFILE = -f docker-compose.dev.test.yml
fcleandev:		ENVFILE = --env-file .env.development
fcleandev:		clean cleandocker cleannode

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

.PHONY:				dev
dev:					DCOMPOSEFILE = -f docker-compose.dev.test.yml
dev:					ENVFILE = --env-file .env.development
dev:					all

.PHONY:				re
re:						fclean all

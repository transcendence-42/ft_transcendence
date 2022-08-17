# COLORS
###############################################################################
GREEN			= \033[1;32m
RESET			= \033[0m

# COMMANDS
################################################################################
RM				:= rm -rf
CD				:= cd
DOCKER			:= docker
DOCKERIMG		:= docker image
DCOMPOSE		:= docker compose
TOUCH			:= touch
MKDIR			:= mkdir -p
REPLACE			:= sed -i
cp				:= cp

# SOURCES
################################################################################
ENVFILE			= .env
DCOMPOSEFILE	= docker-compose.yml

# EXECUTABLES & LIBRARIES
################################################################################
NAME			:= .done

# DIRECTORIES
################################################################################
SRCS			:= ./srcs

# FLAGS
################################################################################
FLAGENV			:= --env-file
FLAGFILE		:= -f
UP				:= up -d
DOWN			:= down
REMOVEALL		:= --rmi all --remove-orphans -v

# RULES
################################################################################
$(NAME):		
				@touch $(NAME)

.PHONY:			all
all:			
				# Build images and run containers
				$(CD) $(SRCS) && $(DCOMPOSE) -f $(DCOMPOSEFILE) $(FLAGENV) \
								 $(ENVFILE) $(UP)	

.PHONY:			clean
clean:
				# Clean all : stops containers and remove images + volumes
				$(CD) $(SRCS) && $(DCOMPOSE) -f $(DCOMPOSEFILE) $(FLAGENV) \
								 $(ENVFILE) $(DOWN) $(REMOVEALL)
				$(RM) .done

.PHONY:			fclean
fclean:			clean 
				# Clean all : stops containers, remove images, volumes, network
				$(DOCKER) system prune --all --force --volumes
				$(DOCKER) network prune --force
				$(DOCKER) volume prune --force
				$(DOCKER) image prune --force

.PHONY:			fcleandev
fcleandev:		DCOMPOSEFILE = docker-compose.dev.test.yml
fcleandev:		ENVFILE = .env.development
fcleandev:		clean 
				# Clean all : stops containers, remove images, volumes, network
				$(DOCKER) system prune --all --force --volumes
				$(DOCKER) network prune --force
				$(DOCKER) volume prune --force
				$(DOCKER) image prune --force
				# clean node_modules
				$(RM) $(SRCS)/client/node_modules
				$(RM) $(SRCS)/server/node_modules

.PHONY:			dev
dev:			DCOMPOSEFILE = docker-compose.dev.test.yml
dev:			ENVFILE = .env.development
dev:			all

.PHONY:			re
re:				fclean all

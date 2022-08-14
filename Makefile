# COMMANDS
################################################################################
RM              := rm -f
RMRF			:= rm -rf
CD				:= cd
MKDIR			:= mkdir
DOCKER			:= docker
DOCKERIMG		:= docker image
DCOMPOSE		:= docker compose
REPLACE			:= sed -i
ECHO			:= echo
TOUCH			:= touch
CHMOD			:= chmod
AWK				:= awk
CAT				:= cat

# SOURCES
################################################################################
ENVFILE			= .env
HOSTS			:= /etc/hosts
DCOMPOSEFILE	= docker-compose.yml

# EXECUTABLES & LIBRARIES
################################################################################
NAME			:= .done

# DIRECTORIES
################################################################################
SRCS			:= ./srcs
DATABIND		:= /home/tom/data
MKBINDS			= $(MKDIR) -p $(DATABIND) $(DATABIND)/wordpress $(DATABIND)/db

# FLAGS
################################################################################
FLAGENV			:= --env-file
FLAGFILE		:= -f
UP				:= up -d
DOWN			:= down
REMOVEALL		:= --rmi all --remove-orphans -v

# DNS
################################################################################
ADDRESS			:= 127.0.0.1


# USER & GROUP
################################################################################
UID				:= $(shell id -u ${USER})
GID				:= $(shell id -g ${USER})

# RULES
################################################################################
$(NAME):		
				@touch $(NAME)

.PHONY:			all
all:			
				# Create bind folders only if they don't already exists
				$(MKBINDS)
				# Update .env file
				$(REPLACE) "s|.*USER_ID.*|USER_ID=$(UID)|g" $(SRCS)/$(ENVFILE)
				$(REPLACE) "s|.*GROUP_ID.*|GROUP_ID=$(GID)|g" $(SRCS)/$(ENVFILE)
				$(REPLACE) "s|.*DATABIND=.*|DATABIND=$(DATABIND)|g" $(SRCS)/$(ENVFILE)
				# Build images and run containers
				$(CD) $(SRCS) && $(DCOMPOSE) -f $(DCOMPOSEFILE) $(FLAGENV) $(ENVFILE) $(UP)	

.PHONY:			clean
clean:
				# Clean all : stops containers and remove images + volumes
				$(CD) $(SRCS) && $(DCOMPOSE) $(DOWN) $(REMOVEALL)
				$(RM) .done

.PHONY:			fclean
fclean:			clean cleanbinds
				# Clean all : stops containers, remove images, volumes, network
				$(DOCKER) system prune --all --force --volumes
				$(DOCKER) network prune --force
				$(DOCKER) volume prune --force
				$(DOCKER) image prune --force

.PHONY:			cleanbinds
cleanbinds:		
				# Remove binded folders and data in them
				$(RMRF) $(DATABIND)

.PHONY:			re
re:				fclean all

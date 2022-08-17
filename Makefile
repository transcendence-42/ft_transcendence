# COLORS
###############################################################################
GREEN        = \033[1;32m
RESET		 = \033[0m
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
cp					:= cp

# SOURCES
################################################################################
ENVFILE				= .env
DCOMPOSEFILE	= docker-compose.yml

# EXECUTABLES & LIBRARIES
################################################################################
NAME					:= .done

# DIRECTORIES
################################################################################
SRCS					:= ./srcs

# FLAGS
################################################################################
FLAGENV				:= --env-file
FLAGFILE			:= -f
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
							$(CD) $(SRCS) && $(DCOMPOSE) -f $(DCOMPOSEFILE) $(FLAGENV) \
								 							 $(ENVFILE) $(UP)	

.PHONY:				clean
clean:
							# Clean all : stops containers and remove images + volumes
							$(CD) $(SRCS) && $(DCOMPOSE) $(DOWN) $(REMOVEALL)
							$(RM) .done

.PHONY:				fclean
fclean:				clean 
							# Clean all : stops containers, remove images, volumes, network
							$(DOCKER) system prune --all --force --volumes
							$(DOCKER) network prune --force
							$(DOCKER) volume prune --force
							$(DOCKER) image prune --force

.PHONY:				dev

copy_files:				
						cp $(SRCS)/.env.development $(SRCS)/server/.env
						cp $(SRCS)/.env.development $(SRCS)/client/.env
dev:					copy_files
dev:					DCOMPOSEFILE = docker-compose.dev.test.yml
dev:					ENVFILE = .env.development
dev:					all

.PHONY:				test
# test:					DCOMPOSEFILE = docker-compose.dev.test.yml && ENVFILE = .env.test
test:					
						DCOMPOSEFILE = docker-compose.dev.test.yml && ENVFILE = .env.test
						@cp $(SRCS)/.env.test $(SRCS)/server/.env
						@cp $(SRCS)/.env.test $(SRCS)/client/.env
						@make server-test @make client-test

.PHONY:				server-test
server-test:
					@echo "$(GREEN) Running Server tests chief $(RESET)"
					npm run test:int

.PHONY:				client-test
client-test:
					@echo "$(GREEN) Running Client tests $(RESET)"

.PHONY:				re
re:						fclean all

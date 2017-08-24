#!/bin/bash
git config --global user.email "lu.yingray@gmail.com"
git config --global user.name "Yingray Lu"
# Install ssh-agent if not already installed, it is required by Docker.
# (change apt-get to yum if you use a CentOS-based image)
'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )'

# Run ssh-agent (inside the build environment)
eval $(ssh-agent -s)

# Add the SSH key stored in SSH_PRIVATE_KEY variable to the agent store
ssh-add <(echo "$SSH_PRIVATE_KEY")

# For Docker builds disable host key checking. Be aware that by adding that
# you are suspectible to man-in-the-middle attacks.
# WARNING: Use this only with the Docker executor, if you use it with shell
# you will overwrite your user's SSH config.
mkdir -p ~/.ssh
'[[ -f /.dockerenv ]] && echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config'
# In order to properly check the server's host key, assuming you created the
# SSH_SERVER_HOSTKEYS variable previously, uncomment the following two lines
# instead.
# - mkdir -p ~/.ssh
# - '[[ -f /.dockerenv ]] && echo "$SSH_SERVER_HOSTKEYS" > ~/.ssh/known_hosts'

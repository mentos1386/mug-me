FROM ubuntu:latest

RUN apt-get update -y
RUN apt-get install -y curl gnupg2

# Nodejs repo
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash

# Dependencies
RUN apt-get update -y
RUN apt-get install -y nodejs python-pip python-dev build-essential

WORKDIR /app

# Needed to install dependencies
COPY package.json /app
COPY requirements.txt /app

# Set dependencies path
ENV PATH /app/node_modules/.bin:$PATH

# Dependencies
RUN npm install
RUN pip install -r requirements.txt

# Create seperate folder for code source
RUN mkdir /app/src
WORKDIR /app/src
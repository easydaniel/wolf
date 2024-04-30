FROM node:22

WORKDIR /home/tanchien/wolf
# change this according to your file location

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start" ]

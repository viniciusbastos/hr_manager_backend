FROM node:21-alpine

# It installs the nodemon package globally for monitoring and watching the backend Express server
RUN npm install -g nodemon

# Creating the working directory named `app`
WORKDIR /app

# Copying all the tools and dependencies in the package.json file to the working directory `app`
COPY package.json .

#Installing all the tools and dependencies in the container
RUN npm install

COPY  ./prisma /app/prisma


RUN npx prisma generate

#Copying all the application source code and files to the working directory `app`
COPY . .

RUN npm run build


EXPOSE 3000

CMD ["npm" "run" "start"]




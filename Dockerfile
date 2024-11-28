FROM node:21-alpine as builder

# It installs the nodemon package globally for monitoring and watching the backend Express server
#RUN npm install -g nodemon

# Creating the working directory named `app`
WORKDIR /app

# Copying all the tools and dependencies in the package.json file to the working directory `app`
COPY package*.json ./
COPY  prisma ./prisma/
RUN npx prisma generate 

#Installing all the tools and dependencies in the container
RUN npm install 


#Copying all the application source code and files to the working directory `app`
COPY . .


RUN npm run build


FROM node:21-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000
# or during execution ❓
CMD [ "npm", "run", "start" ]



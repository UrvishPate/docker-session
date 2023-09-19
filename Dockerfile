#LTS based node image
FROM node:18-alpine 

# set directory name of app
WORKDIR /nodeXP

# copy package to install in that particular directory
COPY package*.json ./

# run the installation script
RUN npm install

# copy the build folder on workdir
COPY build ./build

# mention your PORT that you want to be enable to access current machine 
EXPOSE 4500

# add script to run apps
CMD [ "npm","start" ]
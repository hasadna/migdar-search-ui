FROM node:8
RUN npm install -g serve && mkdir /migdar-search-ui
WORKDIR /migdar-search-ui
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
ARG REACT_APP_API_URL
RUN export REACT_APP_API_URL; yarn build
ENTRYPOINT ["serve", "-s", "build"]

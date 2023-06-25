FROM node:18-alpine

EXPOSE 4173

WORKDIR /app/

COPY . .
WORKDIR /app/app/
RUN npm i
RUN npm run build

CMD cd app & npm run preview
#CMD sh
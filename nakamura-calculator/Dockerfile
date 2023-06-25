FROM node:18-alpine

EXPOSE 4173

WORKDIR /app/

COPY app/* .
RUN npm i
RUN npm run build

CMD npm run preview
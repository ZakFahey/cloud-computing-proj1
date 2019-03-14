FROM node:10.15.3
WORKDIR /usr/src/app

RUN mkdir frontend
RUN mkdir src

RUN npm install -g http-server@0.11.1 concurrently@4.1.0

COPY cloud-computing-hw2/package*.json ./
RUN npm install
COPY cloud-computing-hw2/dailyweather.csv ./
COPY cloud-computing-hw2/src src/

COPY cloud-computing-hw3/src frontend

EXPOSE 8000 80
CMD ["concurrently", "npm start", "http-server frontend -p 80"]
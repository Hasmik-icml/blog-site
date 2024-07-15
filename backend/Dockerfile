FROM node:16.13

WORKDIR /app

COPY package*.json ./
RUN npm ci
#RUN npm install

RUN npm install -g prisma

#RUN npm install -g typescript ts-node

COPY prisma/ ./prisma

RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm run migrate && npm run start"] 



# Menggunakan image resmi Node.js
FROM node:22-alpine

# Membuat folder kerja di dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json
COPY package*.json ./

# Install dependency
RUN npm install

# Menyalin seluruh source code
COPY . .

# Port aplikasi
EXPOSE 3000

# Menjalankan aplikasi
CMD ["npm", "start"]
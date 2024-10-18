# Sử dụng Node.js image
FROM node:18.20

# Tạo thư mục làm việc trong container
WORKDIR /src/server

# Sao chép file package.json và package-lock.json

COPY  package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# # Expose port 3000 để container có thể nhận request từ bên ngoài 
# EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "start"]


# setup entroviment 
ENV PORT=8080

#-  docker-compose up -d chạy ở chế độ backgroud không tốn tài ngyene terminal
# kiểm tra lệnh chạy Sau khi chạy lệnh docker-compose up, bạn có thể kiểm tra các container đang chạy bằng lệnh:
# docker ps Lệnh này sẽ liệt kê tất cả các container đang chạy, bao gồm tên container, ID, cổng được ánh xạ, v.v.
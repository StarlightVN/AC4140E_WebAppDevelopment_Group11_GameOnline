# Quiz Arena

Quiz Arena gồm 3 phần chính:

```text
Backend/   API Express + MySQL
Frontend/  Website React + Vite
Mobile/    Mobile app React Native + Expo
```

## Chạy dự án

### 1. Backend

```powershell
cd Backend
npm install
copy .env.example .env
npm run dev
```

Kiểm tra file `Backend/.env` trước khi chạy. MySQL cần có database `quiz_game_db`.

### 2. Website

```powershell
cd Frontend
npm install
npm run dev
```

Website mặc định gọi API tại `http://localhost:3000/api`.

### 3. Mobile app

```powershell
cd Mobile
npm install
npm start
```

Điện thoại và máy tính nên dùng cùng Wi-Fi. Nếu cần đổi API URL, tạo `Mobile/.env` từ `Mobile/.env.example`.

## Cấu trúc code

- `Backend/src/routes`: khai báo đường dẫn API.
- `Backend/src/controllers`: xử lý logic chính cho từng nhóm API.
- `Frontend/src/pages`: các màn hình của website.
- `Frontend/src/components`: component dùng chung của website.
- `Frontend/src/api`: hàm gọi API từ website.
- `Mobile/app`: các màn hình mobile theo Expo Router.
- `Mobile/src/api`: hàm gọi API từ mobile.

## File không cần commit

Các thư mục như `node_modules`, `dist`, `.expo`, log và file `.env` là file sinh ra khi chạy hoặc chứa cấu hình máy cá nhân, đã được đưa vào `.gitignore`.

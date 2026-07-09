# Quiz Arena Mobile

Ứng dụng React Native dùng Expo SDK 56 và Expo Router. App dùng chung API Express/MySQL với website.

## Chạy bằng Expo Go

1. Điện thoại và máy tính phải dùng cùng mạng Wi-Fi.
2. Chạy backend từ thư mục `Backend`:

   ```powershell
   npm.cmd run dev
   ```

3. Chạy Metro từ thư mục `Mobile`:

   ```powershell
   npm.cmd start
   ```

4. Mở Expo Go và quét QR trong terminal.

App tự lấy IP máy tính từ địa chỉ Metro. Nếu backend nằm ở máy khác, sao chép `.env.example` thành `.env`, sửa `EXPO_PUBLIC_API_URL`, rồi khởi động lại Expo với:

```powershell
npm.cmd start -- --clear
```

## Kiểm tra

```powershell
npm.cmd run typecheck
npm.cmd run lint
```

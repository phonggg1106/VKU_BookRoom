# VKU Room Booking App 🏫📱
### Mini-Project 2: Real-time Study Room Booking App (React Native & Expo)
**Trường Đại học Công nghệ Thông tin & Truyền thông Việt - Hàn (VKU), Đại học Đà Nẵng**  
**Học phần:** Phát triển Ứng dụng Di động Đa nền tảng (Cross-Platform Mobile App Development)

---

## 🌟 Giới thiệu dự án
Ứng dụng di động hỗ trợ sinh viên VKU tìm kiếm, kiểm tra trạng thái và đăng ký sử dụng phòng học, phòng thực hành máy tính và phòng nghiên cứu chuyên đề tại **Khu K** (tập trung 3 tòa nhà chính: **Tòa A, Tòa B và Tòa C** với tổng cộng 104 phòng học).

---

## 🎨 Bộ nhận diện thương hiệu VKU
* **Màu nền chủ đạo:** Trắng sáng tinh tế kết hợp Slate sạch sẽ.
* **Màu sắc điểm nhấn:** Lấy cảm hứng trực tiếp từ logo VKU:
  * **Đỏ VKU (`#C41230`)**: Màu chữ **V** (Nhiệt huyết, Tiên phong).
  * **Vàng VKU (`#EAA700`)**: Màu chữ **K** (Tri thức, Sáng tạo).
  * **Xanh Navy VKU (`#14387F`)**: Màu chữ **U** (Vững chãi, Quốc tế).
* **Khẩu hiệu:** *"NHÂN BẢN - PHỤNG SỰ - KHAI PHÓNG"*
* **Ngôn ngữ hiển thị:** Toàn bộ bằng Tiếng Việt thân thiện với sinh viên và giảng viên.

---

## 🏢 Cấu trúc phòng học Khu K (VKU)
* **Tòa A (3 tầng - 45 phòng):**
  * Tầng 1: A101 → A115
  * Tầng 2: A201 → A215
  * Tầng 3: A301 → A315
  *(Bao gồm Phòng Lab Lập trình & AI, Phòng Thảo luận, Phòng Đa phương tiện)*
* **Tòa B (3 tầng - 45 phòng):**
  * Tầng 1: B101 → B115
  * Tầng 2: B201 → B215
  * Tầng 3: B301 → B315
  *(Bao gồm Phòng Lab Hệ thống nhúng & IoT, Phòng học Lý thuyết)*
* **Tòa C (2 tầng - 14 phòng):**
  * Tầng 1: C101 → C107
  * Tầng 2: C201 → C207
  *(Bao gồm Phòng Lab Capstone Design, Phòng Học Nhóm VIP)*

---

## 🚀 Tính năng nổi bật & Kỹ thuật lập trình

1. **Hiển thị danh sách 60fps & Responsive Layout:**
   * Sử dụng `FlatList` tối ưu hóa (`initialNumToRender`, `maxToRenderPerBatch`, `windowSize`).
   * Custom hook `useResponsiveLayout`: Tự động phân chia 1 cột trên điện thoại dọc, 2 cột khi xoay ngang, 3 cột trên máy tính bảng (Tablet/iPad).
2. **Quản lý trạng thái đa tầng (State Management):**
   * **Client State (Zustand + AsyncStorage):** Quản lý giỏ phòng đã đặt, lưu trữ dữ liệu bền vững (persist offline), quản lý bộ lọc và thông tin tài khoản sinh viên.
   * **Server State (TanStack Query):** Caching danh sách phòng học, staleTime 5 phút, hỗ trợ Pull-to-Refresh mượt mà.
3. **Chống trùng lịch thông minh (Conflict Prevention):**
   * Thuật toán kiểm tra 2 chiều:
     * Khóa khung giờ nếu phòng đã được sinh viên khác đặt trước trong cùng ngày và ca học.
     * Cảnh báo và từ chối nếu chính sinh viên đó đã đặt 1 phòng khác cùng khung giờ.
4. **Hiệu ứng & Cử chỉ tương tác cao cấp:**
   * **React Native Reanimated 3:** Hoạt ảnh thẻ phòng xuất hiện so le (`FadeInDown.delay(index * 40).springify()`), nút bấm có hiệu ứng đàn hồi (`withSpring scale`).
   * **React Native Gesture Handler:** Thao tác vuốt sang trái để hủy lịch đặt phòng (`Swipe-to-Cancel`) chuẩn xác trên Native Thread.
5. **Thông báo nhắc nhở cục bộ (Local Notifications):**
   * Tự động gửi thông báo xác nhận và lên lịch nhắc nhở trước giờ học qua `expo-notifications`.
6. **Điều hướng chuẩn mực (React Navigation 7):**
   * Root Stack lồng Bottom Tabs, kiểu dữ liệu Route được kiểm soát chặt chẽ với TypeScript (`RootStackParamList`, `TabParamList`).
   * Màn hình vé điện tử (Pass) hiển thị dưới dạng Modal trượt từ dưới lên kèm mã QR xác thực.

---

## 📦 Công nghệ & Thư viện (Tech Stack)
* **Framework:** React Native (Expo SDK 57 - Managed Workflow)
* **Ngôn ngữ:** TypeScript (Strict mode)
* **Navigation:** `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`
* **State Management:** `zustand`, `@react-native-async-storage/async-storage`, `@tanstack/react-query`
* **Animations & Gestures:** `react-native-reanimated`, `react-native-gesture-handler`
* **Device APIs:** `expo-notifications`, `expo-image`, `@expo/vector-icons`, `expo-status-bar`

---

## 🛠️ Hướng dẫn cài đặt & Chạy ứng dụng

### 1. Yêu cầu môi trường
* Node.js phiên bản >= 18
* Ứng dụng **Expo Go** trên điện thoại (tải từ Google Play Store hoặc Apple App Store)

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Kiểm tra kiểu dữ liệu & Chuẩn đoán dự án
```bash
npx tsc --noEmit
npx expo-doctor
```

### 4. Khởi chạy máy chủ phát triển
```bash
npx expo start
```
* **Chạy trên điện thoại thật:** Dùng camera điện thoại (iOS) hoặc ứng dụng Expo Go (Android) quét mã QR trên màn hình Terminal.
* **Chạy trên giả lập Android:** Nhấn phím `a`.
* **Chạy trên giả lập iOS:** Nhấn phím `i`.
* **Chạy trên trình duyệt Web:** Nhấn phím `w`.

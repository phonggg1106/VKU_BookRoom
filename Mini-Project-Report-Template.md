# MINI-PROJECT SHORT TECHNICAL REPORT
**Course:** Cross-Platform Mobile App Development (VKU)  
**Mini-Project Title:** Mini-Project 2: Real-time Study Room Booking App (React Native & Expo)  
**Team / Student Name:** Bùi Hoàng Phong  
**Submission Date:** 24/09/2026  

---

## 1. GENERAL INFORMATION & DELIVERABLE LINKS
* **Team Members:**
  1. Bùi Hoàng Phong — Student ID: **23IT208** — Role: Fullstack Mobile Developer (Architecture, UI/UX Design, State Management, Gestures & Deployment) — Contribution: 100%
* **🔗 Live Demo URL (Cloudflare):** [https://vku-bookroom.vku-bookroom.workers.dev](https://vku-bookroom.vku-bookroom.workers.dev)
* **💻 GitHub Repository:** [https://github.com/phonggg1106/VKU_BookRoom](https://github.com/phonggg1106/VKU_BookRoom)
* **📱 Development Build / Expo Go:** `npx expo start`

---

## 2. FEATURE IMPLEMENTATION CHECKLIST
| # | Required Feature | Status | Implementation Details & Acceptance Level |
|:---:|---|:---:|---|
| 1 | **Search & Multi-parameter Filters** | ✅ Complete | Tìm kiếm tức thì; lọc theo Tòa (A, B, C), tầng lầu, công năng và sức chứa. |
| 2 | **60fps Responsive FlatList Feed** | ✅ Complete | FlatList tối ưu 104 phòng; tự động đổi 1–3 cột theo thiết bị (Phone/Tablet). |
| 3 | **State Management (Zustand + TanStack)** | ✅ Complete | Zustand + AsyncStorage lưu offline; TanStack Query cache 5 phút & pull-to-refresh. |
| 4 | **Time-slot Conflict Prevention** | ✅ Complete | Chuẩn 9 tiết VKU (khóa Tiết 5 nghỉ trưa); chặn trùng lịch 2 chiều thời gian thực. |
| 5 | **Native Gestures & Micro-interactions** | ✅ Complete | Vuốt trái để hủy (Swipe-to-Cancel) và hiệu ứng nút bấm đàn hồi Reanimated 3. |
| 6 | **Digital Booking Pass & Notifications** | ✅ Complete | Modal vé phòng kèm mã QR; thông báo cục bộ nhắc nhở trước giờ học. |

---

## 3. TECHNICAL ARCHITECTURE & PROJECT STRUCTURE

### 3.1. Project Directory Structure
```
VKU_BookRoom/
├── App.tsx                          # Root: SafeAreaProvider, QueryClient, GestureHandler, NavigationContainer
├── app.json                         # Expo configuration (SDK 57, permissions, icons, VKU branding)
├── wrangler.jsonc                   # Cloudflare Workers/Pages deployment configuration
├── assets/                          # Official VKU Logo and app assets
└── src/
    ├── constants/
    │   ├── theme.ts                 # Design tokens: VKU White, Red (#C41230), Yellow (#EAA700), Blue (#14387F)
    │   └── mockData.ts              # 104 phòng Khu K (Tòa A, B, C), cấu trúc 9 tiết, thông tin SV Bùi Hoàng Phong
    ├── types/
    │   ├── room.ts                  # TypeScript definitions (Room, Building, TimeSlot, Booking, FilterState)
    │   └── navigation.ts            # Type-safe params: RootStackParamList, TabParamList
    ├── hooks/
    │   ├── useResponsiveLayout.ts   # Tính toán dynamic columns và cardWidth theo useWindowDimensions
    │   ├── useRooms.ts              # TanStack Query custom hook with search, filters and 5-min staleTime
    │   └── useNotification.ts       # Service lập lịch thông báo cục bộ qua expo-notifications
    ├── stores/
    │   └── useBookingStore.ts       # Zustand store with persist middleware & 2-way conflict prevention
    ├── components/
    │   ├── Header.tsx               # Top Bar mang đậm nhận diện VKU, khẩu hiệu trường và đếm bộ lọc
    │   ├── RoomCard.tsx             # Memoized card tối ưu 60fps, Staggered FadeInDown layout animation
    │   ├── TimeSlotPicker.tsx       # Bộ chọn ngày và 9 tiết học trực quan kèm trạng thái khóa thời gian thực
    │   ├── BookingCard.tsx          # Thẻ vé với cử chỉ Swipe-to-Cancel (Pan Gesture + Spring reset)
    │   ├── FilterModal.tsx          # Modal chọn tòa, tầng lầu, công năng phòng và sức chứa
    │   ├── VKUBadge.tsx             # Badge linh hoạt phân loại tòa nhà và trạng thái
    │   └── EmptyState.tsx           # Trạng thái rỗng thân thiện
    ├── screens/
    │   ├── BrowseRoomsScreen.tsx    # Khám phá phòng học, tìm kiếm, lọc nhanh tòa A, B, C
    │   ├── RoomDetailsScreen.tsx    # Chi tiết phòng, kiểm tra lịch, nhập mục đích & nút bấm Reanimated
    │   ├── BookingConfirmationScreen.tsx # Vé điện tử dạng Modal trượt kèm mã QR xác thực
    │   ├── MyBookingsScreen.tsx     # Quản lý danh sách phòng đã đặt, hủy nhanh hoặc vuốt để hủy
    │   └── ProfileScreen.tsx        # Thẻ sinh viên Bùi Hoàng Phong (23IT208), thống kê & dọn cache
    └── navigation/
        ├── RootNavigator.tsx        # NativeStack Navigator lồng Tab Navigator và Modal Screen
        └── TabNavigator.tsx         # Bottom Tab Navigator (Khám phá, Lịch của tôi, Cá nhân)
```

### 3.2. State Management & Data Flow Architecture
* **Client State (Zustand):** Lưu trữ giỏ phòng đặt (`bookings: Booking[]`), bộ lọc tìm kiếm (`filters: FilterState`) và phiên sinh viên (`userSession: UserSession`). Sử dụng `persist` middleware đồng bộ trực tiếp với `AsyncStorage`, đảm bảo khi tắt app hoặc reload thì dữ liệu vẫn nguyên vẹn.
* **Server State (TanStack Query):** Cung cấp bộ đệm dữ liệu phòng học với khóa `['vku-rooms', filters]`, tự động quản lý trạng thái `isLoading`, `isError`, tự hủy cache cũ sau 10 phút (`gcTime`) và tái đồng bộ khi người dùng kéo màn hình (`onRefresh={refetch}`).
* **Cross-Platform Exception Handling:** Xây dựng lớp bọc tương thích `Platform.OS === 'web'` cho hộp thoại thông báo (`window.confirm` / `window.alert` trên web và `Alert.alert` trên điện thoại), đồng thời phòng vệ ngoại lệ trên web đối với API thông báo đẩy `expo-notifications`.

---

## 4. EMPIRICAL EVIDENCE & SCREENSHOTS

1. **Màn hình Khám phá phòng học (`BrowseRoomsScreen`):**
   * Hiển thị danh sách 104 phòng học Khu K phân bổ theo Tòa A (Học bình thường), Tòa B (Học Tiếng Anh & Thực hành), Tòa C (Học Đại Cương).
   * Phân chia cột responsive tự động (1 cột màn hình dọc, 2 cột khi xoay ngang).
   * Kèm thanh tìm kiếm tức thời và 4 thẻ chip chọn nhanh công năng từng tòa nhà.

2. **Màn hình Chi tiết phòng & Chọn ca học (`RoomDetailsScreen`):**
   * Banner nhận diện học đường VKU hiển thị mã phòng lớn, vị trí tòa, tầng và các tiện ích (Máy chiếu, Điều hòa, WiFi 6, Dàn PC,...).
   * Bộ chọn lịch học 9 tiết: Buổi sáng (Tiết 1–4), Buổi trưa (Tiết 5 khóa cứng "Nghỉ trưa"), Buổi chiều (Tiết 6–9).
   * Nút bấm xác nhận đặt phòng có phản hồi co giãn nảy lò xo (`withSpring`).

3. **Màn hình Thẻ xác nhận đặt phòng (`BookingConfirmationScreen` - Modal):**
   * Trình chiếu dưới dạng Modal trượt từ đáy màn hình lên.
   * Giao diện mô phỏng thẻ vé điện tử VKU có đường viền đục lỗ vé, đầy đủ thông tin sinh viên Bùi Hoàng Phong (23IT208), mã vé, ngày giờ và mã QR xác thực nhận phòng.

4. **Màn hình Quản lý lịch đặt (`MyBookingsScreen`):**
   * Danh sách các ca học đã đặt, kèm tính năng vuốt sang trái (`Swipe-to-Cancel`) để hủy phòng trực tiếp.
   * Tích hợp nút "Xóa hết" nhanh và tự động giải phóng khung giờ phòng học về màu xanh trống ngay lập tức.

---

## 5. TECHNICAL CHALLENGES & RESOLUTIONS

### Thách thức 1: Xung đột hành vi Native Alert và Notifications khi chạy trên nền tảng Web
* **Vấn đề:** Khi biên dịch React Native sang Web (`react-native-web`), hàm `Alert.alert()` mặc định không hỗ trợ truyền callback mảng nút bấm (`[{ text: 'Hủy', onPress: ... }]`), dẫn đến việc người dùng bấm "Hủy phòng" hay "Đặt phòng" trên trình duyệt thì sự kiện bị nuốt chửng, không thể thay đổi dữ liệu. Ngoài ra, `expo-notifications` báo lỗi quyền trên web do thiếu cấu hình Service Worker.
* **Giải pháp:** Xây dựng hàm kiểm tra môi trường chạy `Platform.OS === 'web'`. Nếu đang chạy trên Web, hệ thống chuyển hướng sang hộp thoại gốc của trình duyệt (`window.confirm`, `window.alert`) và vô hiệu hóa an toàn API notifications. Khi chạy trên Android/iOS, hệ thống kích hoạt 100% `Alert.alert` và `Notifications.scheduleNotificationAsync` nguyên bản.

### Thách thức 2: Thuật toán chống trùng lịch 2 chiều (Bi-directional Conflict Prevention)
* **Vấn đề:** Ứng dụng phải đảm bảo không để xảy ra tình trạng: (1) Hai sinh viên khác nhau cùng đặt chung một phòng vào cùng ngày và ca học; (2) Chính sinh viên đó đặt 2 phòng khác nhau trong cùng một khung giờ.
* **Giải pháp:** Viết thuật toán tiền kiểm tra trực tiếp trong Zustand Store trước khi ghi nhận (`addBooking`): duyệt toàn bộ mảng `bookings` kiểm tra điều kiện `(roomId === newBooking.roomId && date === newBooking.date && slotId === newBooking.slotId && status === 'confirmed')` và `(studentId === newBooking.studentId && date === newBooking.date && slotId === newBooking.slotId)`. Nếu thỏa mãn vi phạm, từ chối giao dịch và trả về thông báo lỗi chi tiết.

### Thách thức 3: Hiệu năng mượt mà 60fps và Animation trên Native Thread
* **Vấn đề:** Thao tác vuốt để hủy phòng nếu xử lý trên JavaScript Thread thông qua `PanResponder` truyền thống sẽ dễ bị giật lag và xung đột với thanh cuộn dọc của `FlatList`.
* **Giải pháp:** Sử dụng `react-native-gesture-handler` kết hợp `react-native-reanimated 3`. Toàn bộ giá trị dịch chuyển `translateX` được lưu trong `useSharedValue` và tính toán trực tiếp trên UI Thread (Worklet), chỉ kích hoạt hàm JavaScript qua `runOnJS` khi người dùng đã vuốt vượt ngưỡng `-100px`.
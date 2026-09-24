import { Room, TimeSlot, UserSession, Booking } from '../types/room';

export const TIME_SLOTS: TimeSlot[] = [
  // Buổi sáng: 7h30 tới 11h30 gồm 4 tiết
  {
    id: 'tiet-1',
    label: 'Tiết 1 (Sáng)',
    timeRange: '07:30 - 08:30',
    period: 'morning',
  },
  {
    id: 'tiet-2',
    label: 'Tiết 2 (Sáng)',
    timeRange: '08:30 - 09:30',
    period: 'morning',
  },
  {
    id: 'tiet-3',
    label: 'Tiết 3 (Sáng)',
    timeRange: '09:30 - 10:30',
    period: 'morning',
  },
  {
    id: 'tiet-4',
    label: 'Tiết 4 (Sáng)',
    timeRange: '10:30 - 11:30',
    period: 'morning',
  },

  // Buổi trưa: Tiết 5 không được đăng ký
  {
    id: 'tiet-5',
    label: 'Tiết 5 (Nghỉ trưa)',
    timeRange: '11:30 - 13:00',
    period: 'noon',
    isRestTime: true,
  },

  // Buổi chiều: 13h00 tới 17h00 gồm Tiết 6 tới Tiết 9
  {
    id: 'tiet-6',
    label: 'Tiết 6 (Chiều)',
    timeRange: '13:00 - 14:00',
    period: 'afternoon',
  },
  {
    id: 'tiet-7',
    label: 'Tiết 7 (Chiều)',
    timeRange: '14:00 - 15:00',
    period: 'afternoon',
  },
  {
    id: 'tiet-8',
    label: 'Tiết 8 (Chiều)',
    timeRange: '15:00 - 16:00',
    period: 'afternoon',
  },
  {
    id: 'tiet-9',
    label: 'Tiết 9 (Chiều)',
    timeRange: '16:00 - 17:00',
    period: 'afternoon',
  },
];

export const DEFAULT_USER: UserSession = {
  studentId: '22IT101',
  name: 'Trần Minh Quân',
  email: 'quantm.22it@vku.udn.vn',
  faculty: 'Khoa Khoa học Máy tính (CS)',
  classId: '22KIT02',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
};

// Hình ảnh phòng thực tế mô phỏng chất lượng cao
const ROOM_IMAGES = {
  lab: [
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80',
  ],
  theory: [
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
  ],
  seminar: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
  ],
  multimedia: [
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80',
  ],
};

// Hàm sinh danh sách đầy đủ 104 phòng theo đúng quy tắc tòa A, B, C Khu K của VKU
function generateVKURooms(): Room[] {
  const rooms: Room[] = [];

  // 1. Tòa A: 3 tầng, mỗi tầng từ 101 - 115 (45 phòng)
  for (let floor = 1; floor <= 3; floor++) {
    for (let r = 1; r <= 15; r++) {
      const roomNum = floor * 100 + r;
      const code = `A${roomNum}`;
      const id = `K-${code}`;
      
      let category: Room['category'] = 'theory';
      let categoryLabel = 'Lý thuyết & Thảo luận';
      let capacity = 45;
      let amenities = ['Máy chiếu 4K', 'Điều hòa 2 chiều', 'WiFi 6 VKU', 'Bảng từ'];
      let description = `Phòng học lý thuyết hiện đại tại Tầng ${floor} Tòa A Khu K, trang bị máy chiếu công suất lớn và hệ thống âm thanh giảng dạy.`;
      let img = ROOM_IMAGES.theory[(r + floor) % ROOM_IMAGES.theory.length];

      // Đan xen phòng Lab chuyên dụng và Seminar
      if (r === 1 || r === 2 || r === 7 || r === 8) {
        category = 'lab';
        categoryLabel = 'Phòng Lab Máy Tính';
        capacity = 40;
        amenities = ['Dàn PC Core i7 32GB', 'Màn hình Dell Ultrasharp', 'Điều hòa', 'WiFi 6 VKU', 'Bảng thông minh'];
        description = `Phòng thực hành máy tính cấu hình cao tại Tòa A, chuyên phục vụ lập trình, nghiên cứu Trí tuệ Nhân tạo và Công nghệ Mạng.`;
        img = ROOM_IMAGES.lab[(r + floor) % ROOM_IMAGES.lab.length];
      } else if (r === 5 || r === 12) {
        category = 'seminar';
        categoryLabel = 'Phòng Thảo luận & Đồ án';
        capacity = 25;
        amenities = ['Bàn tròn nhóm', 'Màn hình TV 65 inch', 'Ổ sạc từng bàn', 'Bảng viết 360'];
        description = `Không gian mở phục vụ làm việc nhóm, bảo vệ đồ án tốt nghiệp và sinh hoạt học thuật.`;
        img = ROOM_IMAGES.seminar[(r + floor) % ROOM_IMAGES.seminar.length];
      } else if (r === 15) {
        category = 'multimedia';
        categoryLabel = 'Phòng Đa phương tiện';
        capacity = 60;
        amenities = ['Màn hình LED hội trường', 'Hệ thống âm thanh vòm', 'Micro không dây', 'Live stream gear'];
        description = `Phòng đa chức năng tổ chức hội thảo khoa học, workshop công nghệ và đào tạo kỹ năng.`;
        img = ROOM_IMAGES.multimedia[(r + floor) % ROOM_IMAGES.multimedia.length];
      }

      rooms.push({
        id,
        name: `Phòng ${code}`,
        code,
        building: 'A',
        campus: 'Khu K',
        floor,
        capacity,
        category,
        categoryLabel,
        imageUrl: img,
        amenities,
        description,
        isSpecialLab: category === 'lab',
      });
    }
  }

  // 2. Tòa B: 3 tầng, mỗi tầng từ 101 - 115 (45 phòng)
  for (let floor = 1; floor <= 3; floor++) {
    for (let r = 1; r <= 15; r++) {
      const roomNum = floor * 100 + r;
      const code = `B${roomNum}`;
      const id = `K-${code}`;
      
      let category: Room['category'] = 'theory';
      let categoryLabel = 'Lý thuyết & Thảo luận';
      let capacity = 50;
      let amenities = ['Máy chiếu độ phân giải cao', 'Điều hòa trung tâm', 'WiFi 6 VKU', 'Mic trợ giảng'];
      let description = `Phòng học đa năng tiêu chuẩn quốc tế tại Tòa B Khu K, thoáng mát với ánh sáng tự nhiên.`;
      let img = ROOM_IMAGES.theory[(r + floor + 1) % ROOM_IMAGES.theory.length];

      if (r === 3 || r === 4 || r === 9 || r === 10) {
        category = 'lab';
        categoryLabel = 'Phòng Lab IoT & Phần cứng';
        capacity = 36;
        amenities = ['Bộ kit nhúng STM32/ESP32', 'Máy hiện sóng', 'PC kỹ thuật', 'Điều hòa', 'WiFi 6'];
        description = `Phòng thí nghiệm Hệ thống nhúng & IoT dành cho sinh viên khoa Công nghệ Thông tin & Truyền thông.`;
        img = ROOM_IMAGES.lab[(r + floor + 1) % ROOM_IMAGES.lab.length];
      } else if (r === 6 || r === 14) {
        category = 'seminar';
        categoryLabel = 'Phòng Sinh hoạt Nhóm';
        capacity = 20;
        amenities = ['Bảng trắng thông minh', 'Ổ cắm điện đa năng', 'Ghế công thái học', 'Điều hòa'];
        description = `Không gian yên tĩnh lý tưởng cho các buổi học nhóm, thuyết trình thử nghiệm.`;
        img = ROOM_IMAGES.seminar[(r + floor + 1) % ROOM_IMAGES.seminar.length];
      }

      rooms.push({
        id,
        name: `Phòng ${code}`,
        code,
        building: 'B',
        campus: 'Khu K',
        floor,
        capacity,
        category,
        categoryLabel,
        imageUrl: img,
        amenities,
        description,
        isSpecialLab: category === 'lab',
      });
    }
  }

  // 3. Tòa C: 2 tầng, mỗi tầng 7 phòng từ 101 - 107 (14 phòng)
  for (let floor = 1; floor <= 2; floor++) {
    for (let r = 1; r <= 7; r++) {
      const roomNum = floor * 100 + r;
      const code = `C${roomNum}`;
      const id = `K-${code}`;
      
      let category: Room['category'] = 'theory';
      let categoryLabel = 'Phòng Học Nhóm VIP';
      let capacity = 30;
      let amenities = ['Điều hòa', 'Máy chiếu Sony', 'WiFi 6', 'Bảng kính cường lực'];
      let description = `Phòng chuyên đề Tòa C Khu K dành riêng cho các nhóm nghiên cứu khoa học sinh viên và cố vấn học tập.`;
      let img = ROOM_IMAGES.seminar[(r + floor) % ROOM_IMAGES.seminar.length];

      if (r === 1 || r === 5) {
        category = 'lab';
        categoryLabel = 'Phòng Lab Capstone Design';
        capacity = 35;
        amenities = ['Máy tính chuyên dụng đồ họa', 'Màn hình cong 2K', 'Máy in 3D', 'Điều hòa'];
        description = `Lab nghiên cứu chuyên sâu đồ án tốt nghiệp sinh viên VKU.`;
        img = ROOM_IMAGES.lab[(r + floor) % ROOM_IMAGES.lab.length];
      }

      rooms.push({
        id,
        name: `Phòng ${code}`,
        code,
        building: 'C',
        campus: 'Khu K',
        floor,
        capacity,
        category,
        categoryLabel,
        imageUrl: img,
        amenities,
        description,
        isSpecialLab: category === 'lab',
      });
    }
  }

  return rooms;
}

export const MOCK_ROOMS: Room[] = generateVKURooms();

// Ngày hôm nay theo format YYYY-MM-DD
export function getFormattedDate(offsetDays: number = 0): { dateString: string; displayString: string } {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  const dayOfWeekNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = dayOfWeekNames[d.getDay()];
  const displayString = offsetDays === 0 ? `Hôm nay (${day}/${month})` : offsetDays === 1 ? `Ngày mai (${day}/${month})` : `${dayName}, ${day}/${month}`;

  return { dateString, displayString };
}

// 7 ngày tiếp theo để chọn lịch
export function getAvailableDates(): Array<{ dateString: string; displayString: string; dayNumber: string; dayName: string }> {
  const list = [];
  const dayOfWeekNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    const dayName = i === 0 ? 'Hôm nay' : dayOfWeekNames[d.getDay()];

    list.push({
      dateString,
      displayString: `${day}/${month}`,
      dayNumber: String(day),
      dayName,
    });
  }

  return list;
}

// Dữ liệu đặt phòng ban đầu trống (sinh viên tự thao tác đặt phòng)
export const INITIAL_BOOKINGS: Booking[] = [];

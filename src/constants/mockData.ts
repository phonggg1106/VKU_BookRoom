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

// Hàm sinh danh sách đầy đủ 104 phòng học theo công năng quy định tại VKU:
// - Tòa A: Dùng để học bình thường
// - Tòa B: Dùng để học tiếng Anh và thực hành
// - Tòa C: Dùng để học đại cương
function generateVKURooms(): Room[] {
  const rooms: Room[] = [];

  // 1. Tòa A: 3 tầng, mỗi tầng từ 101 - 115 (45 phòng) -> Dùng để HỌC BÌNH THƯỜNG
  for (let floor = 1; floor <= 3; floor++) {
    for (let r = 1; r <= 15; r++) {
      const roomNum = floor * 100 + r;
      const code = `A${roomNum}`;
      const id = `K-${code}`;

      rooms.push({
        id,
        name: `Phòng ${code}`,
        code,
        building: 'A',
        campus: 'Khu K',
        floor,
        capacity: 45,
        category: 'normal',
        categoryLabel: 'Học bình thường',
        amenities: [
          'Máy chiếu độ nét cao',
          'Điều hòa không khí',
          'Bảng từ chống lóa',
          'Hệ thống micro trợ giảng',
          'WiFi 6 VKU',
        ],
        description: `Phòng học lý thuyết và chuyên ngành tiêu chuẩn tại Tầng ${floor} Tòa A Khu K, đáp ứng tốt các môn học chuyên ngành và thảo luận lớp.`,
      });
    }
  }

  // 2. Tòa B: 3 tầng, mỗi tầng từ 101 - 115 (45 phòng) -> Dùng để HỌC TIẾNG ANH & THỰC HÀNH
  for (let floor = 1; floor <= 3; floor++) {
    for (let r = 1; r <= 15; r++) {
      const roomNum = floor * 100 + r;
      const code = `B${roomNum}`;
      const id = `K-${code}`;

      // Phân chia: Phòng lẻ dùng học Tiếng Anh, Phòng chẵn dùng Thực hành máy tính / kỹ thuật
      const isEnglish = r % 2 !== 0;

      if (isEnglish) {
        rooms.push({
          id,
          name: `Phòng Tiếng Anh ${code}`,
          code,
          building: 'B',
          campus: 'Khu K',
          floor,
          capacity: 40,
          category: 'english',
          categoryLabel: 'Học Tiếng Anh',
          amenities: [
            'Hệ thống tai nghe stereo chuyên dụng',
            'Phần mềm luyện phát âm',
            'Màn hình tương tác thông minh',
            'Điều hòa trung tâm',
            'WiFi 6 VKU',
          ],
          description: `Phòng học Ngoại ngữ & Tiếng Anh chuyên dụng tại Tầng ${floor} Tòa B Khu K, trang bị hệ thống âm thanh cabin và thiết bị luyện nghe nói.`,
        });
      } else {
        rooms.push({
          id,
          name: `Phòng Thực Hành ${code}`,
          code,
          building: 'B',
          campus: 'Khu K',
          floor,
          capacity: 38,
          category: 'practice',
          categoryLabel: 'Phòng Thực Hành',
          isSpecialLab: true,
          amenities: [
            'Dàn PC Core i7 32GB RAM',
            'Màn hình đồ họa kỹ thuật',
            'Điều hòa công suất lớn',
            'Ổ cắm điện từng bàn thực hành',
            'WiFi 6 tốc độ cao',
          ],
          description: `Phòng thực hành máy tính và kỹ thuật chuyên sâu tại Tầng ${floor} Tòa B Khu K, phục vụ các học phần lập trình và thực hành công nghệ.`,
        });
      }
    }
  }

  // 3. Tòa C: 2 tầng, mỗi tầng 7 phòng từ 101 - 107 (14 phòng) -> Dùng để HỌC ĐẠI CƯƠNG
  for (let floor = 1; floor <= 2; floor++) {
    for (let r = 1; r <= 7; r++) {
      const roomNum = floor * 100 + r;
      const code = `C${roomNum}`;
      const id = `K-${code}`;

      rooms.push({
        id,
        name: `Phòng Đại Cương ${code}`,
        code,
        building: 'C',
        campus: 'Khu K',
        floor,
        capacity: 55,
        category: 'general',
        categoryLabel: 'Học Đại Cương',
        amenities: [
          'Giảng đường đại cương',
          'Máy chiếu công suất lớn',
          'Bảng viết rộng 360 độ',
          'Điều hòa 2 chiều',
          'Micro không dây trợ giảng',
        ],
        description: `Phòng học các môn khoa học cơ bản và đại cương tại Tầng ${floor} Tòa C Khu K (Toán cao cấp, Vật lý, Triết học Mác-Lênin, Pháp luật đại cương).`,
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

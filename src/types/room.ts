export type Building = 'A' | 'B' | 'C';
export type CampusArea = 'Khu K' | 'Khu V';

export type RoomCategory = 
  | 'normal'     // Học bình thường / Lý thuyết (Tòa A)
  | 'english'    // Học Tiếng Anh (Tòa B)
  | 'practice'   // Thực hành máy tính & Lab (Tòa B)
  | 'general';   // Học đại cương (Tòa C)

export interface TimeSlot {
  id: string;             // Ví dụ: 'tiet-1'
  label: string;          // Ví dụ: 'Tiết 1 (Sáng)'
  timeRange: string;      // '07:30 - 08:30'
  period: 'morning' | 'noon' | 'afternoon';
  isRestTime?: boolean;   // True nếu là Tiết 5 (Nghỉ trưa - không được đăng ký)
}

export interface Amenity {
  id: string;
  name: string;
  iconName: string;
}

export interface Room {
  id: string;             // 'K-A101'
  name: string;           // 'Phòng A101'
  code: string;           // 'A101'
  building: Building;     // 'A' | 'B' | 'C'
  campus: CampusArea;     // 'Khu K'
  floor: number;          // 1, 2, 3
  capacity: number;       // Số chỗ ngồi, vd: 45
  category: RoomCategory;
  categoryLabel: string;  // Nhãn hiển thị tiếng Việt
  imageUrl?: string;      // Tùy chọn (đã loại bỏ ảnh minh họa)
  amenities: string[];    // Danh sách tiện ích
  description: string;    // Giới thiệu phòng
  isSpecialLab?: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  roomCode: string;
  building: Building;
  campus: CampusArea;
  floor: number;
  date: string;           // YYYY-MM-DD
  dateDisplay: string;    // Thứ Tư, 25/10/2026
  slotId: string;
  slotLabel: string;
  slotTime: string;
  purpose: string;        // Mục đích sử dụng (vd: Học nhóm, Nghiên cứu đồ án, Sinh hoạt CLB)
  studentId: string;      // MSSV
  studentName: string;    // Họ tên SV
  studentEmail: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface FilterState {
  building: Building | 'ALL';
  floor: number | 'ALL';
  category: RoomCategory | 'ALL';
  minCapacity: number;
  searchQuery: string;
}

export interface UserSession {
  studentId: string;
  name: string;
  email: string;
  faculty: string;
  classId: string;
  avatarUrl: string;
}

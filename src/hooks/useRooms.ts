import { useQuery } from '@tanstack/react-query';
import { Room, FilterState } from '../types/room';
import { MOCK_ROOMS } from '../constants/mockData';

/**
 * Mô phỏng API Server VKU lấy danh sách phòng với độ trễ mạng thực tế
 */
async function fetchVKURooms(filters: FilterState): Promise<Room[]> {
  // Giả lập network delay 350ms
  await new Promise((resolve) => setTimeout(resolve, 350));

  let results = [...MOCK_ROOMS];

  // 1. Lọc theo Tòa nhà (A, B, C hoặc ALL)
  if (filters.building !== 'ALL') {
    results = results.filter((r) => r.building === filters.building);
  }

  // 2. Lọc theo Tầng (1, 2, 3 hoặc ALL)
  if (filters.floor !== 'ALL') {
    results = results.filter((r) => r.floor === filters.floor);
  }

  // 3. Lọc theo Loại phòng
  if (filters.category !== 'ALL') {
    results = results.filter((r) => r.category === filters.category);
  }

  // 4. Lọc theo Sức chứa tối thiểu
  if (filters.minCapacity > 0) {
    results = results.filter((r) => r.capacity >= filters.minCapacity);
  }

  // 5. Tìm kiếm theo từ khóa (Tên phòng, Mã phòng, Tòa nhà, Loại phòng, Tiện ích)
  if (filters.searchQuery.trim().length > 0) {
    const q = filters.searchQuery.toLowerCase().trim();
    results = results.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.building.toLowerCase().includes(q) ||
        r.categoryLabel.toLowerCase().includes(q) ||
        r.amenities.some((a) => a.toLowerCase().includes(q))
    );
  }

  return results;
}

/**
 * Custom Hook theo chuẩn Week 6 (Slide 17-18)
 * Sử dụng TanStack Query để quản lý Server State, tự động cache 5 phút
 */
export function useRooms(filters: FilterState) {
  return useQuery({
    queryKey: ['vku-rooms', filters],
    queryFn: () => fetchVKURooms(filters),
    staleTime: 5 * 60 * 1000, // Caching dữ liệu trong 5 phút
  });
}

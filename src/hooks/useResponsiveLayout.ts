import { useWindowDimensions } from 'react-native';

export interface ResponsiveLayout {
  width: number;
  height: number;
  isLandscape: boolean;
  isTablet: boolean;
  columns: number;
  cardWidth: number;
}

/**
 * Custom Hook theo chuẩn bài giảng Week 5 (Slide 26-27):
 * Tự động tính toán số cột (columns) và chiều rộng thẻ (cardWidth)
 * khi người dùng xoay ngang điện thoại hoặc sử dụng Tablet.
 */
export function useResponsiveLayout(): ResponsiveLayout {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const isTablet = width >= 768;

  // Tính số cột: Tablet -> 3 cột, Xoay ngang / màn hình lớn -> 2 cột, Màn hình dọc thường -> 1 cột
  const columns = isTablet ? 3 : width >= 500 ? 2 : 1;

  // Tính chiều rộng của mỗi card phòng với margin hợp lý
  const horizontalPadding = 16 * 2;
  const gap = 12 * (columns - 1);
  const cardWidth = Math.floor((width - horizontalPadding - gap) / columns);

  return {
    width,
    height,
    isLandscape,
    isTablet,
    columns,
    cardWidth,
  };
}

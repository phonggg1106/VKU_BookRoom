export const Colors = {
  // Nền chủ đạo
  white: '#FFFFFF',
  background: '#F8FAFC',
  cardBackground: '#FFFFFF',
  surface: '#F1F5F9',
  
  // Màu nhận diện thương hiệu VKU
  vkuRed: '#C41230',       // Chữ 'V' đỏ đặc trưng
  vkuRedLight: '#FEE2E2',  // Đỏ nhạt nền badge
  vkuYellow: '#EAA700',    // Chữ 'K' vàng kim nổi bật
  vkuYellowLight: '#FEF3C7',
  vkuBlue: '#14387F',      // Chữ 'U' xanh dương hoàng gia
  vkuBlueLight: '#E0E7FF',
  vkuBlueDark: '#0D2352',  // Xanh navy đậm cho header
  
  // Màu trạng thái
  available: '#10B981',    // Xanh lá - Sẵn sàng đặt
  availableLight: '#D1FAE5',
  occupied: '#EF4444',     // Đỏ - Đã có người đặt
  occupiedLight: '#FEE2E2',
  pending: '#F59E0B',      // Cam vàng - Đang chờ xử lý
  pendingLight: '#FEF3C7',

  // Màu chữ & văn bản
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textWhite: '#FFFFFF',

  // Đường viền & ngăn cách
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E2E8F0',

  // Thanh điều hướng (Tabs)
  tabBarActive: '#C41230', // Đỏ VKU cho tab đang chọn
  tabBarInactive: '#94A3B8',
  tabBarBackground: '#FFFFFF',
};

export const Shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#14387F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
};

export const Sizing = {
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 18,
  radiusFull: 9999,
  paddingSm: 8,
  paddingMd: 14,
  paddingLg: 20,
};

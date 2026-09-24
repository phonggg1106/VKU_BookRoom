import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Room } from '../types/room';
import { Colors, Shadows, Sizing } from '../constants/theme';
import { VKUBadge } from './VKUBadge';

interface RoomCardProps {
  room: Room;
  index: number;
  cardWidth?: number;
  onPress: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = React.memo(({
  room,
  index,
  cardWidth,
  onPress,
}) => {
  // Nhận diện màu sắc và biểu tượng công năng phòng theo quy định VKU:
  // - Tòa A: Học bình thường
  // - Tòa B: Học tiếng Anh & Thực hành
  // - Tòa C: Học đại cương
  const getCategoryDetails = () => {
    switch (room.category) {
      case 'english':
        return {
          icon: 'language' as const,
          badgeVariant: 'blue' as const,
          accentColor: Colors.vkuBlue,
          bgColor: '#EEF2FF',
        };
      case 'practice':
        return {
          icon: 'desktop' as const,
          badgeVariant: 'blue' as const,
          accentColor: '#1E40AF',
          bgColor: '#E0E7FF',
        };
      case 'general':
        return {
          icon: 'library' as const,
          badgeVariant: 'yellow' as const,
          accentColor: '#B45309',
          bgColor: '#FEF3C7',
        };
      case 'normal':
      default:
        return {
          icon: 'school' as const,
          badgeVariant: 'red' as const,
          accentColor: Colors.vkuRed,
          bgColor: '#FEE2E2',
        };
    }
  };

  const cat = getCategoryDetails();

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 35, 350)).springify()}
      layout={Layout.springify()}
      style={[
        styles.cardContainer,
        cardWidth ? { width: cardWidth } : { width: '100%' },
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
        onPress={onPress}
      >
        {/* Thanh tiêu đề thông tin phòng & Icon công năng */}
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: cat.bgColor }]}>
            <Ionicons name={cat.icon} size={22} color={cat.accentColor} />
          </View>

          <View style={styles.headerTitleWrap}>
            <View style={styles.titleRow}>
              <Text style={styles.roomName} numberOfLines={1}>
                {room.name}
              </Text>
              <VKUBadge
                label={`Tòa ${room.building} • Tầng ${room.floor}`}
                variant={cat.badgeVariant}
                size="sm"
              />
            </View>
            <Text style={[styles.categoryLabel, { color: cat.accentColor }]}>
              {room.categoryLabel}
            </Text>
          </View>
        </View>

        {/* Nội dung chi tiết */}
        <View style={styles.content}>
          {/* Thông số nhanh: Sức chứa & Địa điểm */}
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="people-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.metaChipText}>{room.capacity} chỗ ngồi</Text>
            </View>

            <View style={styles.metaChip}>
              <Ionicons name="location-outline" size={13} color={Colors.vkuRed} />
              <Text style={styles.metaChipText}>Khu K, VKU</Text>
            </View>
          </View>

          {/* Tiện ích nổi bật */}
          <View style={styles.amenitiesRow}>
            {room.amenities.slice(0, 3).map((amenity, idx) => (
              <View key={idx} style={styles.amenityChip}>
                <Ionicons name="checkmark-circle" size={11} color={Colors.available} />
                <Text style={styles.amenityText} numberOfLines={1}>
                  {amenity}
                </Text>
              </View>
            ))}
          </View>

          {/* Chân thẻ: Nút chọn lịch */}
          <View style={styles.footerRow}>
            <Text style={styles.footerHint}>Chạm để xem lịch & đặt chỗ</Text>
            <View style={[styles.actionBtn, { backgroundColor: cat.bgColor }]}>
              <Text style={[styles.actionBtnText, { color: cat.accentColor }]}>Chọn phòng</Text>
              <Ionicons name="arrow-forward" size={12} color={cat.accentColor} />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizing.radiusMd,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    ...Shadows.sm,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.95,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    paddingTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  metaChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  amenityText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 8,
    marginTop: 2,
  },
  footerHint: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

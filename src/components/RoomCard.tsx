import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
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
  // Nhận diện màu sắc theo Tòa nhà VKU
  const getBuildingBadgeVariant = () => {
    switch (room.building) {
      case 'A':
        return 'red';    // Tòa A dùng đỏ VKU
      case 'B':
        return 'blue';   // Tòa B dùng xanh VKU
      case 'C':
        return 'yellow'; // Tòa C dùng vàng VKU
      default:
        return 'blue';
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 40, 400)).springify()}
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
        {/* Hình ảnh phòng học */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: room.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.buildingTag}>
            <Text style={styles.buildingTagText}>Tòa {room.building} • Tầng {room.floor}</Text>
          </View>

          <View style={styles.capacityBadge}>
            <Ionicons name="people" size={12} color={Colors.white} />
            <Text style={styles.capacityText}>{room.capacity} chỗ</Text>
          </View>
        </View>

        {/* Nội dung chi tiết */}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.roomName} numberOfLines={1}>
              {room.name}
            </Text>
            <VKUBadge
              label={`Tòa ${room.building}`}
              variant={getBuildingBadgeVariant()}
              size="sm"
            />
          </View>

          <Text style={styles.categoryLabel}>{room.categoryLabel}</Text>

          {/* Tiện ích nổi bật */}
          <View style={styles.amenitiesRow}>
            {room.amenities.slice(0, 2).map((amenity, idx) => (
              <View key={idx} style={styles.amenityChip}>
                <Ionicons name="checkmark-circle" size={11} color={Colors.available} />
                <Text style={styles.amenityText} numberOfLines={1}>
                  {amenity}
                </Text>
              </View>
            ))}
          </View>

          {/* Chân thẻ: Vị trí và Nút bấm */}
          <View style={styles.footerRow}>
            <View style={styles.locationContainer}>
              <Ionicons name="location-sharp" size={13} color={Colors.vkuRed} />
              <Text style={styles.locationText}>Khu K, Cơ sở VKU</Text>
            </View>

            <View style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Đặt phòng</Text>
              <Ionicons name="arrow-forward" size={12} color={Colors.vkuBlue} />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 14,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Sizing.radiusMd,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.95,
  },
  imageWrapper: {
    width: '100%',
    height: 135,
    backgroundColor: Colors.surface,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buildingTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  buildingTagText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  capacityBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(20, 56, 127, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  capacityText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 12,
  },
  headerRow: {
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
    marginRight: 8,
  },
  categoryLabel: {
    fontSize: 12,
    color: Colors.vkuBlue,
    fontWeight: '600',
    marginBottom: 8,
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
    maxWidth: 120,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.vkuBlue,
  },
});

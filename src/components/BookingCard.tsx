import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../types/room';
import { Colors, Shadows, Sizing } from '../constants/theme';
import { VKUBadge } from './VKUBadge';

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
  onPressDetails?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancel,
  onPressDetails,
}) => {
  const translateX = useSharedValue(0);
  const isCancelled = booking.status === 'cancelled';

  const triggerCancelConfirm = (id: string) => {
    Alert.alert(
      'Xác nhận hủy đặt phòng',
      `Bạn có chắc chắn muốn hủy đặt ${booking.roomName} vào lúc ${booking.slotTime} ngày ${booking.dateDisplay}?`,
      [
        { text: 'Giữ lại', style: 'cancel' },
        {
          text: 'Hủy phòng',
          style: 'destructive',
          onPress: () => onCancel(id),
        },
      ]
    );
  };

  // Cử chỉ Pan Gesture vuốt sang trái để hủy đặt phòng (theo đúng Slide Week 6 trang 26)
  const pan = Gesture.Pan()
    .enabled(!isCancelled)
    .activeOffsetX([-15, 15])
    .onUpdate((e) => {
      // Chỉ cho phép vuốt sang trái (translationX <= 0)
      translateX.value = Math.min(0, Math.max(e.translationX, -160));
    })
    .onEnd((e) => {
      if (e.translationX < -100) {
        runOnJS(triggerCancelConfirm)(booking.id);
      }
      translateX.value = withSpring(0);
    });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const getStatusBadge = () => {
    if (isCancelled) {
      return <VKUBadge label="Đã hủy" variant="gray" size="sm" />;
    }
    return <VKUBadge label="Đã xác nhận" variant="green" size="sm" />;
  };

  return (
    <View style={styles.wrapper}>
      {/* Lớp nền đỏ hiện ra khi vuốt sang trái */}
      {!isCancelled && (
        <View style={styles.underlay}>
          <View style={styles.underlayContent}>
            <Ionicons name="trash-outline" size={22} color={Colors.white} />
            <Text style={styles.underlayText}>Vuốt để hủy</Text>
          </View>
        </View>
      )}

      {/* Thẻ phòng chính được bọc trong GestureDetector */}
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.card,
            isCancelled && styles.cardCancelled,
            cardAnimatedStyle,
          ]}
        >
          {/* Hàng trên: Mã đặt phòng & Trạng thái */}
          <View style={styles.headerRow}>
            <View style={styles.codeContainer}>
              <Ionicons name="receipt-outline" size={16} color={Colors.vkuBlue} />
              <Text style={styles.bookingIdText}>{booking.id}</Text>
            </View>
            {getStatusBadge()}
          </View>

          {/* Tên phòng & Vị trí */}
          <View style={styles.roomSection}>
            <Text style={styles.roomName}>{booking.roomName}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={13} color={Colors.vkuRed} />
              <Text style={styles.locationText}>
                Tòa {booking.building} • Tầng {booking.floor} • {booking.campus} (VKU)
              </Text>
            </View>
          </View>

          {/* Khung thời gian & Ngày */}
          <View style={styles.timeBadgeContainer}>
            <View style={styles.timeBadge}>
              <Ionicons name="calendar-outline" size={14} color={Colors.vkuBlue} />
              <Text style={styles.timeBadgeText}>{booking.dateDisplay}</Text>
            </View>
            <View style={[styles.timeBadge, { backgroundColor: Colors.vkuYellowLight }]}>
              <Ionicons name="time-outline" size={14} color="#B45309" />
              <Text style={[styles.timeBadgeText, { color: '#B45309' }]}>
                {booking.slotTime} ({booking.slotLabel})
              </Text>
            </View>
          </View>

          {/* Mục đích sử dụng */}
          {booking.purpose ? (
            <View style={styles.purposeRow}>
              <Text style={styles.purposeLabel}>Mục đích:</Text>
              <Text style={styles.purposeText} numberOfLines={1}>
                {booking.purpose}
              </Text>
            </View>
          ) : null}

          {/* Chân thẻ: Hướng dẫn vuốt hoặc Nút bấm */}
          <View style={styles.footerRow}>
            {!isCancelled ? (
              <>
                <View style={styles.swipeHintRow}>
                  <Ionicons name="chevron-back" size={14} color={Colors.textMuted} />
                  <Text style={styles.swipeHintText}>Vuốt sang trái để hủy</Text>
                </View>

                <Pressable
                  style={styles.cancelButton}
                  onPress={() => triggerCancelConfirm(booking.id)}
                >
                  <Text style={styles.cancelButtonText}>Hủy phòng</Text>
                </Pressable>
              </>
            ) : (
              <Text style={styles.cancelledNote}>Lịch đặt này đã bị hủy bỏ</Text>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    position: 'relative',
    borderRadius: Sizing.radiusMd,
    overflow: 'hidden',
  },
  underlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.vkuRed,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 24,
    borderRadius: Sizing.radiusMd,
  },
  underlayContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  underlayText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Sizing.radiusMd,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  cardCancelled: {
    backgroundColor: '#F8FAFC',
    opacity: 0.7,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingIdText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.vkuBlue,
    letterSpacing: 0.5,
  },
  roomSection: {
    marginBottom: 10,
  },
  roomName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  timeBadgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.vkuBlueLight,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.vkuBlue,
  },
  purposeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
    gap: 6,
  },
  purposeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  purposeText: {
    fontSize: 12,
    color: Colors.textPrimary,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 10,
  },
  swipeHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  swipeHintText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  cancelButton: {
    backgroundColor: Colors.vkuRedLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: Colors.vkuRed,
    fontSize: 12,
    fontWeight: '700',
  },
  cancelledNote: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});

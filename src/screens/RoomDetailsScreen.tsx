import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { RootStackScreenProps } from '../types/navigation';
import { TimeSlot, Booking } from '../types/room';
import { Colors, Shadows, Sizing } from '../constants/theme';
import { VKUBadge } from '../components/VKUBadge';
import { TimeSlotPicker } from '../components/TimeSlotPicker';
import { getFormattedDate } from '../constants/mockData';
import { useBookingStore } from '../stores/useBookingStore';
import { scheduleBookingReminder } from '../hooks/useNotification';

export const RoomDetailsScreen: React.FC<RootStackScreenProps<'RoomDetails'>> = ({
  route,
  navigation,
}) => {
  const { room } = route.params;

  // Lấy hàm và dữ liệu từ Zustand store
  const addBooking = useBookingStore((s) => s.addBooking);
  const user = useBookingStore((s) => s.userSession);

  // Trạng thái ngày & ca học
  const initialDate = getFormattedDate(0);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate.dateString);
  const [selectedDateDisplay, setSelectedDateDisplay] = useState<string>(initialDate.displayString);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [purpose, setPurpose] = useState<string>('Học nhóm & Nghiên cứu Đồ án');

  // Animation theo chuẩn Week 6 Slide 23 (withSpring Scale button interaction)
  const scale = useSharedValue(1);
  const animBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const showAppAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleBookRoom = async () => {
    if (!selectedSlot) {
      showAppAlert('Chưa chọn ca học', 'Vui lòng chọn một khung giờ học còn trống để tiếp tục.');
      return;
    }

    if (!purpose.trim()) {
      showAppAlert('Chưa nhập mục đích', 'Vui lòng điền mục đích sử dụng phòng học.');
      return;
    }

    const newBooking: Booking = {
      id: `BK-VKU-${Math.floor(1000 + Math.random() * 9000)}`,
      roomId: room.id,
      roomName: room.name,
      roomCode: room.code,
      building: room.building,
      campus: room.campus,
      floor: room.floor,
      date: selectedDate,
      dateDisplay: selectedDateDisplay,
      slotId: selectedSlot.id,
      slotLabel: selectedSlot.label,
      slotTime: selectedSlot.timeRange,
      purpose: purpose.trim(),
      studentId: user.studentId,
      studentName: user.name,
      studentEmail: user.email,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Thực hiện kiểm tra xung đột trong Zustand Store
    const result = addBooking(newBooking);

    if (!result.success) {
      // Báo lỗi ngăn chặn trùng lịch (Conflict Prevention)
      showAppAlert('Trùng lịch đặt phòng!', result.message);
      return;
    }

    // Lên lịch thông báo cục bộ (Local Notifications)
    await scheduleBookingReminder(newBooking);

    // Chuyển hướng sang màn hình Xác nhận dạng Modal (theo Slide Week 6 trang 7)
    navigation.navigate('BookingConfirmation', { booking: newBooking });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Ảnh phòng lớn */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: room.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.imageOverlayBadge}>
            <Text style={styles.campusTag}>{room.campus} • VKU</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Thông tin phòng & Mã */}
          <View style={styles.titleSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.categoryLabel}>{room.categoryLabel}</Text>
            </View>
            <VKUBadge
              label={`Tòa ${room.building} - Tầng ${room.floor}`}
              variant={room.building === 'A' ? 'red' : room.building === 'B' ? 'blue' : 'yellow'}
              size="md"
            />
          </View>

          {/* Hàng chỉ số nhanh: Sức chứa, Tiện ích, Loại phòng */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={20} color={Colors.vkuBlue} />
              <Text style={styles.statValue}>{room.capacity} chỗ</Text>
              <Text style={styles.statLabel}>Sức chứa</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="business-outline" size={20} color={Colors.vkuRed} />
              <Text style={styles.statValue}>Tòa {room.building}</Text>
              <Text style={styles.statLabel}>Tầng {room.floor}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color={Colors.available} />
              <Text style={styles.statValue}>Chính chủ</Text>
              <Text style={styles.statLabel}>Khu K - VKU</Text>
            </View>
          </View>

          {/* Mô tả */}
          <Text style={styles.sectionHeader}>Mô tả phòng</Text>
          <Text style={styles.descriptionText}>{room.description}</Text>

          {/* Trang thiết bị */}
          <Text style={styles.sectionHeader}>Trang thiết bị & Tiện ích</Text>
          <View style={styles.amenitiesGrid}>
            {room.amenities.map((item, idx) => (
              <View key={idx} style={styles.amenityBadge}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.vkuRed} />
                <Text style={styles.amenityBadgeText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Bộ chọn Ngày & Khung giờ học chống xung đột */}
          <TimeSlotPicker
            roomId={room.id}
            selectedDate={selectedDate}
            selectedSlotId={selectedSlot?.id || null}
            onSelectDate={(dateString, displayString) => {
              setSelectedDate(dateString);
              setSelectedDateDisplay(displayString);
              setSelectedSlot(null); // Reset slot khi đổi ngày để check lại
            }}
            onSelectSlot={(slot) => setSelectedSlot(slot)}
          />

          {/* Mục đích sử dụng */}
          <Text style={styles.sectionHeader}>Mục đích sử dụng</Text>
          <TextInput
            style={styles.purposeInput}
            placeholder="Ví dụ: Ôn thi cuối kỳ, làm đồ án React Native..."
            placeholderTextColor={Colors.textMuted}
            value={purpose}
            onChangeText={setPurpose}
          />
        </View>
      </ScrollView>

      {/* Footer nút Đặt phòng với Reanimated Spring Animation (Slide Week 6 - Trang 23) */}
      <View style={styles.footerBar}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>Khung giờ đã chọn:</Text>
          <Text style={styles.footerSlotText} numberOfLines={1}>
            {selectedSlot ? `${selectedSlot.timeRange}` : 'Chưa chọn ca học'}
          </Text>
        </View>

        <Pressable
          onPressIn={() => {
            scale.value = withSpring(0.94);
          }}
          onPressOut={() => {
            scale.value = withSpring(1);
          }}
          onPress={handleBookRoom}
          disabled={!selectedSlot}
          style={{ opacity: selectedSlot ? 1 : 0.6 }}
        >
          <Animated.View style={[styles.bookBtn, animBtnStyle]}>
            <Text style={styles.bookBtnText}>Xác nhận đặt</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.white} />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.surface,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlayBadge: {
    position: 'absolute',
    top: 14,
    left: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  campusTag: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    padding: 16,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  roomName: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  categoryLabel: {
    fontSize: 14,
    color: Colors.vkuBlue,
    fontWeight: '600',
    marginTop: 2,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Sizing.radiusMd,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 14,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  amenityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  amenityBadgeText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  purposeInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizing.radiusMd,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Shadows.md,
  },
  footerInfo: {
    flex: 1,
    marginRight: 12,
  },
  footerLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  footerSlotText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.vkuBlue,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.vkuRed,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: Sizing.radiusMd,
    gap: 8,
    ...Shadows.sm,
  },
  bookBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
});

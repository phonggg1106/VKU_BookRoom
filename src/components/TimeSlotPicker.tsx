import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimeSlot } from '../types/room';
import { TIME_SLOTS, getAvailableDates } from '../constants/mockData';
import { Colors, Shadows, Sizing } from '../constants/theme';
import { useBookingStore } from '../stores/useBookingStore';

interface TimeSlotPickerProps {
  roomId: string;
  selectedDate: string;
  selectedSlotId: string | null;
  onSelectDate: (dateString: string, displayString: string) => void;
  onSelectSlot: (slot: TimeSlot) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  roomId,
  selectedDate,
  selectedSlotId,
  onSelectDate,
  onSelectSlot,
}) => {
  const dates = getAvailableDates();
  const isSlotBooked = useBookingStore((s) => s.isSlotBooked);
  const hasUserConflictingBooking = useBookingStore((s) => s.hasUserConflictingBooking);

  const morningSlots = TIME_SLOTS.filter((s) => s.period === 'morning');
  const noonSlots = TIME_SLOTS.filter((s) => s.period === 'noon');
  const afternoonSlots = TIME_SLOTS.filter((s) => s.period === 'afternoon');

  const renderSlotCard = (slot: TimeSlot) => {
    const isRest = !!slot.isRestTime;
    const isBooked = isSlotBooked(roomId, selectedDate, slot.id);
    const userConflict = hasUserConflictingBooking(selectedDate, slot.id);
    const isSelected = selectedSlotId === slot.id;
    const isUnavailable = isRest || isBooked || !!userConflict;

    return (
      <Pressable
        key={slot.id}
        disabled={isUnavailable}
        style={({ pressed }) => [
          styles.slotCard,
          isSelected && styles.slotCardSelected,
          isRest && styles.slotCardRest,
          (isBooked || !!userConflict) && styles.slotCardUnavailable,
          pressed && !isUnavailable && { opacity: 0.8 },
        ]}
        onPress={() => onSelectSlot(slot)}
      >
        <View style={styles.slotLeft}>
          <View style={styles.slotTimeRow}>
            <Ionicons
              name={isRest ? 'cafe-outline' : 'time-outline'}
              size={16}
              color={
                isSelected
                  ? Colors.white
                  : isRest
                  ? '#94A3B8'
                  : isUnavailable
                  ? Colors.textMuted
                  : Colors.vkuBlue
              }
            />
            <Text
              style={[
                styles.slotTimeText,
                isSelected && styles.slotTimeTextSelected,
                isRest && styles.slotTimeTextRest,
                !isRest && isUnavailable && styles.slotTimeTextUnavailable,
              ]}
            >
              {slot.timeRange}
            </Text>
          </View>
          <Text
            style={[
              styles.slotLabelText,
              isSelected && styles.slotLabelTextSelected,
              isRest && styles.slotLabelTextRest,
              !isRest && isUnavailable && styles.slotLabelTextUnavailable,
            ]}
          >
            {slot.label}
          </Text>
        </View>

        {/* Nhãn trạng thái / Cảnh báo */}
        <View style={styles.slotRight}>
          {isRest ? (
            <View style={styles.badgeRest}>
              <Ionicons name="lock-closed" size={11} color="#64748B" />
              <Text style={styles.badgeRestText}>Nghỉ trưa (Khóa)</Text>
            </View>
          ) : isBooked ? (
            <View style={styles.badgeUnavailable}>
              <Text style={styles.badgeUnavailableText}>Đã có người đặt</Text>
            </View>
          ) : userConflict ? (
            <View style={styles.badgeConflict}>
              <Text style={styles.badgeConflictText}>Trùng lịch của bạn</Text>
            </View>
          ) : isSelected ? (
            <View style={styles.badgeSelected}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.white} />
            </View>
          ) : (
            <View style={styles.badgeAvailable}>
              <Text style={styles.badgeAvailableText}>Còn trống</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. Chọn ngày học */}
      <Text style={styles.sectionTitle}>1. Chọn ngày học</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datesList}
      >
        {dates.map((item) => {
          const isSelected = selectedDate === item.dateString;
          return (
            <Pressable
              key={item.dateString}
              style={[
                styles.dateCard,
                isSelected && styles.dateCardSelected,
              ]}
              onPress={() => onSelectDate(item.dateString, `${item.dayName}, ${item.displayString}`)}
            >
              <Text
                style={[
                  styles.dayNameText,
                  isSelected && styles.dayNameTextSelected,
                ]}
              >
                {item.dayName}
              </Text>
              <Text
                style={[
                  styles.dayNumberText,
                  isSelected && styles.dayNumberTextSelected,
                ]}
              >
                {item.dayNumber}
              </Text>
              <Text
                style={[
                  styles.monthText,
                  isSelected && styles.monthTextSelected,
                ]}
              >
                {item.displayString.split('/')[1] ? `Thg ${item.displayString.split('/')[1]}` : ''}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* 2. Chọn ca học & Kiểm tra xung đột */}
      <View style={styles.slotHeaderRow}>
        <Text style={styles.sectionTitle}>2. Chọn tiết học trong ngày</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: Colors.available }]} />
          <Text style={styles.legendText}>Trống</Text>
          <View style={[styles.legendDot, { backgroundColor: Colors.occupied, marginLeft: 8 }]} />
          <Text style={styles.legendText}>Đã kín</Text>
        </View>
      </View>

      {/* Nhóm Buổi Sáng: Tiết 1 - Tiết 4 (07:30 - 11:30) */}
      <View style={styles.periodGroup}>
        <View style={styles.periodHeader}>
          <Ionicons name="sunny-outline" size={15} color={Colors.vkuYellow} />
          <Text style={styles.periodHeaderText}>Buổi sáng (07:30 - 11:30) • Tiết 1 - Tiết 4</Text>
        </View>
        <View style={styles.slotsGrid}>
          {morningSlots.map(renderSlotCard)}
        </View>
      </View>

      {/* Nhóm Buổi Trưa: Tiết 5 (11:30 - 13:00) */}
      <View style={styles.periodGroup}>
        <View style={styles.periodHeader}>
          <Ionicons name="cafe-outline" size={15} color="#64748B" />
          <Text style={[styles.periodHeaderText, { color: '#64748B' }]}>
            Buổi trưa (11:30 - 13:00) • Tiết 5 (Không nhận đăng ký)
          </Text>
        </View>
        <View style={styles.slotsGrid}>
          {noonSlots.map(renderSlotCard)}
        </View>
      </View>

      {/* Nhóm Buổi Chiều: Tiết 6 - Tiết 9 (13:00 - 17:00) */}
      <View style={styles.periodGroup}>
        <View style={styles.periodHeader}>
          <Ionicons name="partly-sunny-outline" size={15} color={Colors.vkuRed} />
          <Text style={styles.periodHeaderText}>Buổi chiều (13:00 - 17:00) • Tiết 6 - Tiết 9</Text>
        </View>
        <View style={styles.slotsGrid}>
          {afternoonSlots.map(renderSlotCard)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  datesList: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 16,
  },
  dateCard: {
    width: 66,
    height: 78,
    borderRadius: Sizing.radiusMd,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    ...Shadows.sm,
  },
  dateCardSelected: {
    backgroundColor: Colors.vkuBlue,
    borderColor: Colors.vkuBlue,
    transform: [{ scale: 1.04 }],
  },
  dayNameText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  dayNameTextSelected: {
    color: Colors.vkuYellowLight,
  },
  dayNumberText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  dayNumberTextSelected: {
    color: Colors.white,
  },
  monthText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  monthTextSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  slotHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  periodGroup: {
    marginBottom: 14,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  periodHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.vkuBlue,
    letterSpacing: 0.2,
  },
  slotsGrid: {
    gap: 8,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: Sizing.radiusMd,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  slotCardSelected: {
    backgroundColor: Colors.vkuBlue,
    borderColor: Colors.vkuBlue,
  },
  slotCardRest: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.85,
  },
  slotCardUnavailable: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.65,
  },
  slotLeft: {
    flex: 1,
  },
  slotTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  slotTimeText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  slotTimeTextSelected: {
    color: Colors.white,
  },
  slotTimeTextRest: {
    color: '#64748B',
  },
  slotTimeTextUnavailable: {
    color: Colors.textMuted,
  },
  slotLabelText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  slotLabelTextSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  slotLabelTextRest: {
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  slotLabelTextUnavailable: {
    color: Colors.textMuted,
  },
  slotRight: {
    marginLeft: 10,
  },
  badgeAvailable: {
    backgroundColor: Colors.availableLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeAvailableText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '700',
  },
  badgeUnavailable: {
    backgroundColor: Colors.occupiedLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeUnavailableText: {
    color: Colors.occupied,
    fontSize: 10,
    fontWeight: '700',
  },
  badgeConflict: {
    backgroundColor: Colors.pendingLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeConflictText: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: '700',
  },
  badgeRest: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  badgeRestText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '700',
  },
  badgeSelected: {
    padding: 2,
  },
});

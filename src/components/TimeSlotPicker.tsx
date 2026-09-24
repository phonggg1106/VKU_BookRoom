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
        <Text style={styles.sectionTitle}>2. Chọn khung giờ (Ca học)</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: Colors.available }]} />
          <Text style={styles.legendText}>Trống</Text>
          <View style={[styles.legendDot, { backgroundColor: Colors.occupied, marginLeft: 8 }]} />
          <Text style={styles.legendText}>Đã kín</Text>
        </View>
      </View>

      <View style={styles.slotsGrid}>
        {TIME_SLOTS.map((slot) => {
          const isBooked = isSlotBooked(roomId, selectedDate, slot.id);
          const userConflict = hasUserConflictingBooking(selectedDate, slot.id);
          const isSelected = selectedSlotId === slot.id;
          const isUnavailable = isBooked || !!userConflict;

          return (
            <Pressable
              key={slot.id}
              disabled={isUnavailable}
              style={({ pressed }) => [
                styles.slotCard,
                isSelected && styles.slotCardSelected,
                isUnavailable && styles.slotCardUnavailable,
                pressed && !isUnavailable && { opacity: 0.8 },
              ]}
              onPress={() => onSelectSlot(slot)}
            >
              <View style={styles.slotLeft}>
                <View style={styles.slotTimeRow}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={
                      isSelected
                        ? Colors.white
                        : isUnavailable
                        ? Colors.textMuted
                        : Colors.vkuBlue
                    }
                  />
                  <Text
                    style={[
                      styles.slotTimeText,
                      isSelected && styles.slotTimeTextSelected,
                      isUnavailable && styles.slotTimeTextUnavailable,
                    ]}
                  >
                    {slot.timeRange}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.slotLabelText,
                    isSelected && styles.slotLabelTextSelected,
                    isUnavailable && styles.slotLabelTextUnavailable,
                  ]}
                >
                  {slot.label}
                </Text>
              </View>

              {/* Nhãn trạng thái / Cảnh báo trùng lịch */}
              <View style={styles.slotRight}>
                {isBooked ? (
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
        })}
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
    marginBottom: 8,
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
  slotsGrid: {
    gap: 10,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: Sizing.radiusMd,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  slotCardSelected: {
    backgroundColor: Colors.vkuBlue,
    borderColor: Colors.vkuBlue,
  },
  slotCardUnavailable: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.6,
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
  badgeSelected: {
    padding: 2,
  },
});

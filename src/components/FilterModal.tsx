import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Building, RoomCategory, FilterState } from '../types/room';
import { Colors, Shadows, Sizing } from '../constants/theme';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  currentFilters: FilterState;
  onApplyFilters: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  currentFilters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | 'ALL'>(
    currentFilters.building
  );
  const [selectedFloor, setSelectedFloor] = useState<number | 'ALL'>(
    currentFilters.floor
  );
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory | 'ALL'>(
    currentFilters.category
  );
  const [minCapacity, setMinCapacity] = useState<number>(
    currentFilters.minCapacity
  );

  const handleApply = () => {
    onApplyFilters({
      building: selectedBuilding,
      floor: selectedFloor,
      category: selectedCategory,
      minCapacity,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedBuilding('ALL');
    setSelectedFloor('ALL');
    setSelectedCategory('ALL');
    setMinCapacity(0);
    onResetFilters();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header Modal */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Ionicons name="options-outline" size={20} color={Colors.vkuBlue} />
              <Text style={styles.modalTitle}>Bộ Lọc Phòng Học VKU</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close-circle" size={24} color={Colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* 1. Chọn Tòa Nhà (Tập trung Tòa A, B, C Khu K) */}
            <Text style={styles.filterGroupTitle}>Tòa nhà (Khu K)</Text>
            <View style={styles.chipRow}>
              {(['ALL', 'A', 'B', 'C'] as const).map((b) => {
                const isSelected = selectedBuilding === b;
                const label = b === 'ALL' ? 'Tất cả tòa' : `Tòa ${b}`;
                return (
                  <Pressable
                    key={b}
                    style={[
                      styles.filterChip,
                      isSelected && styles.filterChipSelected,
                    ]}
                    onPress={() => setSelectedBuilding(b)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* 2. Chọn Tầng */}
            <Text style={styles.filterGroupTitle}>Tầng lầu</Text>
            <View style={styles.chipRow}>
              {(['ALL', 1, 2, 3] as const).map((f) => {
                const isSelected = selectedFloor === f;
                const label = f === 'ALL' ? 'Tất cả tầng' : `Tầng ${f}`;
                return (
                  <Pressable
                    key={String(f)}
                    style={[
                      styles.filterChip,
                      isSelected && styles.filterChipSelected,
                    ]}
                    onPress={() => setSelectedFloor(f)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* 3. Loại phòng học / Công năng */}
            <Text style={styles.filterGroupTitle}>Công năng phòng học</Text>
            <View style={styles.chipRow}>
              {[
                { id: 'ALL', label: 'Tất cả công năng' },
                { id: 'normal', label: 'Học bình thường (Tòa A)' },
                { id: 'english', label: 'Học Tiếng Anh (Tòa B)' },
                { id: 'practice', label: 'Phòng Thực Hành (Tòa B)' },
                { id: 'general', label: 'Học Đại Cương (Tòa C)' },
              ].map((c) => {
                const isSelected = selectedCategory === c.id;
                return (
                  <Pressable
                    key={c.id}
                    style={[
                      styles.filterChip,
                      isSelected && styles.filterChipSelected,
                    ]}
                    onPress={() => setSelectedCategory(c.id as RoomCategory | 'ALL')}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextSelected,
                      ]}
                    >
                      {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* 4. Sức chứa tối thiểu */}
            <Text style={styles.filterGroupTitle}>Sức chứa tối thiểu</Text>
            <View style={styles.chipRow}>
              {[
                { val: 0, label: 'Bất kỳ' },
                { val: 25, label: 'Từ 25 chỗ' },
                { val: 40, label: 'Từ 40 chỗ' },
                { val: 50, label: 'Từ 50 chỗ' },
              ].map((cap) => {
                const isSelected = minCapacity === cap.val;
                return (
                  <Pressable
                    key={cap.val}
                    style={[
                      styles.filterChip,
                      isSelected && styles.filterChipSelected,
                    ]}
                    onPress={() => setMinCapacity(cap.val)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextSelected,
                      ]}
                    >
                      {cap.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Footer nút hành động */}
          <View style={styles.modalFooter}>
            <Pressable style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetBtnText}>Đặt lại</Text>
            </Pressable>
            <Pressable style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Áp dụng bộ lọc</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 28,
    paddingHorizontal: 20,
    maxHeight: '80%',
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.vkuBlue,
  },
  modalBody: {
    paddingVertical: 12,
  },
  filterGroupTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipSelected: {
    backgroundColor: Colors.vkuBlue,
    borderColor: Colors.vkuBlue,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  filterChipTextSelected: {
    color: Colors.white,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Sizing.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  applyBtn: {
    flex: 2,
    backgroundColor: Colors.vkuRed,
    paddingVertical: 12,
    borderRadius: Sizing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
});

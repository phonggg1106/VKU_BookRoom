import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Building, Room } from '../types/room';
import { Colors, Shadows, Sizing } from '../constants/theme';
import { Header } from '../components/Header';
import { RoomCard } from '../components/RoomCard';
import { FilterModal } from '../components/FilterModal';
import { EmptyState } from '../components/EmptyState';
import { useRooms } from '../hooks/useRooms';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { useBookingStore } from '../stores/useBookingStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const BrowseRoomsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Lấy filters từ Zustand store
  const filters = useBookingStore((s) => s.filters);
  const setFilter = useBookingStore((s) => s.setFilter);
  const resetFilters = useBookingStore((s) => s.resetFilters);

  // TanStack Query server state với caching 5 phút và pull-to-refresh
  const { data: rooms = [], isLoading, isError, refetch } = useRooms(filters);

  // Custom hook theo Week 5 slide 26-27: tính toán số cột theo kích thước màn hình
  const { columns, cardWidth } = useResponsiveLayout();

  // Đếm số lượng bộ lọc đang được kích hoạt
  const activeFilterCount =
    (filters.building !== 'ALL' ? 1 : 0) +
    (filters.floor !== 'ALL' ? 1 : 0) +
    (filters.category !== 'ALL' ? 1 : 0) +
    (filters.minCapacity > 0 ? 1 : 0);

  const handleSelectBuildingQuickChip = (b: Building | 'ALL') => {
    setFilter({ building: b });
  };

  const renderRoomItem = ({ item, index }: { item: Room; index: number }) => (
    <RoomCard
      room={item}
      index={index}
      cardWidth={columns > 1 ? cardWidth : undefined}
      onPress={() => navigation.navigate('RoomDetails', { room: item })}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header thương hiệu VKU */}
      <Header
        title="Phòng Học Khu K"
        subtitle="Hệ thống đăng ký phòng học & Lab trực tuyến"
        onFilterPress={() => setFilterModalVisible(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Thanh tìm kiếm & Quick Chips tòa A, B, C */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên phòng, mã phòng, tiện ích..."
            placeholderTextColor={Colors.textMuted}
            value={filters.searchQuery}
            onChangeText={(text) => setFilter({ searchQuery: text })}
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
          {filters.searchQuery.length > 0 && (
            <Pressable onPress={() => setFilter({ searchQuery: '' })}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </Pressable>
          )}
        </View>

        {/* Thanh chọn nhanh Tòa nhà Khu K (Tập trung Tòa A, B, C theo yêu cầu) */}
        <View style={styles.quickChipsRow}>
          {[
            { id: 'ALL', label: 'Tất cả (104 phòng)' },
            { id: 'A', label: 'Tòa A (45 phòng)' },
            { id: 'B', label: 'Tòa B (45 phòng)' },
            { id: 'C', label: 'Tòa C (14 phòng)' },
          ].map((chip) => {
            const isSelected = filters.building === chip.id;
            return (
              <Pressable
                key={chip.id}
                style={[
                  styles.quickChip,
                  isSelected && styles.quickChipSelected,
                ]}
                onPress={() => handleSelectBuildingQuickChip(chip.id as Building | 'ALL')}
              >
                <Text
                  style={[
                    styles.quickChipText,
                    isSelected && styles.quickChipTextSelected,
                  ]}
                >
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Danh sách phòng học đạt chuẩn 60fps FlatList */}
      {isLoading && rooms.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.vkuRed} />
          <Text style={styles.loadingText}>Đang tải danh sách phòng VKU...</Text>
        </View>
      ) : isError ? (
        <EmptyState
          icon="alert-circle-outline"
          title="Không thể tải dữ liệu"
          message="Đã có lỗi xảy ra trong quá trình kết nối đến máy chủ. Vui lòng thử lại."
          actionText="Thử lại"
          onAction={() => refetch()}
        />
      ) : (
        <FlatList
          data={rooms}
          key={columns} // Force remount khi xoay màn hình đổi số cột (theo Week 5 slide 27)
          numColumns={columns}
          keyExtractor={(item) => item.id}
          renderItem={renderRoomItem}
          contentContainerStyle={[
            styles.listContent,
            columns > 1 && { justifyContent: 'space-between' },
          ]}
          columnWrapperStyle={columns > 1 ? { gap: 12 } : undefined}
          refreshing={isLoading}
          onRefresh={refetch} // Pull-to-refresh tích hợp với TanStack Query
          initialNumToRender={8}
          maxToRenderPerBatch={6}
          windowSize={7}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.resultInfoRow}>
              <Text style={styles.resultCountText}>
                Tìm thấy <Text style={styles.boldText}>{rooms.length}</Text> phòng học khả dụng
              </Text>
              {activeFilterCount > 0 && (
                <Pressable onPress={resetFilters}>
                  <Text style={styles.resetFilterLink}>Xóa lọc</Text>
                </Pressable>
              )}
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="Không tìm thấy phòng phù hợp"
              message="Không có phòng nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại của bạn."
              actionText="Đặt lại bộ lọc"
              onAction={resetFilters}
            />
          }
        />
      )}

      {/* Modal bộ lọc nâng cao */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        currentFilters={filters}
        onApplyFilters={setFilter}
        onResetFilters={resetFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadows.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: Sizing.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  quickChipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickChipSelected: {
    backgroundColor: Colors.vkuBlue,
    borderColor: Colors.vkuBlue,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  quickChipTextSelected: {
    color: Colors.white,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  resultInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultCountText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  boldText: {
    fontWeight: '800',
    color: Colors.vkuBlue,
  },
  resetFilterLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.vkuRed,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});

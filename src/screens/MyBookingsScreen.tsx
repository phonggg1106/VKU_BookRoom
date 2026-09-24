import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Booking } from '../types/room';
import { Colors, Shadows, Sizing } from '../constants/theme';
import { Header } from '../components/Header';
import { BookingCard } from '../components/BookingCard';
import { EmptyState } from '../components/EmptyState';
import { useBookingStore } from '../stores/useBookingStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const MyBookingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  // Chuẩn Week 6 Slide 13: Trích xuất chính xác selector cần thiết từ Zustand Store
  const bookings = useBookingStore((s) => s.bookings);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);

  // Phân chia danh sách
  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const historyBookings = bookings.filter((b) => b.status === 'cancelled' || b.status === 'completed');

  const displayedList = activeTab === 'active' ? activeBookings : historyBookings;

  return (
    <View style={styles.container}>
      <Header
        title="Lịch Đặt Của Tôi"
        subtitle="Quản lý và tra cứu các ca phòng đã đăng ký"
        showUserInfo={true}
      />

      {/* Tabs chuyển đổi giữa "Sắp tới" và "Lịch sử" */}
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tabButton, activeTab === 'active' && styles.tabButtonActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'active' && styles.tabButtonTextActive,
            ]}
          >
            Sắp tới ({activeBookings.length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tabButton, activeTab === 'history' && styles.tabButtonActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'history' && styles.tabButtonTextActive,
            ]}
          >
            Lịch sử ({historyBookings.length})
          </Text>
        </Pressable>
      </View>

      {/* Danh sách các thẻ phòng */}
      <FlatList
        data={displayedList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onCancel={(id) => cancelBooking(id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon={activeTab === 'active' ? 'calendar-outline' : 'archive-outline'}
            title={activeTab === 'active' ? 'Chưa có lịch đặt phòng nào' : 'Lịch sử trống'}
            message={
              activeTab === 'active'
                ? 'Bạn chưa đăng ký sử dụng phòng học nào. Hãy khám phá và đặt phòng ngay!'
                : 'Bạn chưa có lịch đặt nào bị hủy hoặc hoàn tất trước đây.'
            }
            actionText={activeTab === 'active' ? 'Khám phá phòng học ngay' : undefined}
            onAction={() => navigation.navigate('MainTabs', { screen: 'BrowseRooms' })}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: Sizing.radiusMd,
    backgroundColor: Colors.surface,
  },
  tabButtonActive: {
    backgroundColor: Colors.vkuBlue,
    ...Shadows.sm,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  tabButtonTextActive: {
    color: Colors.white,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
});

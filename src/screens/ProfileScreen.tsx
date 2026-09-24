import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Sizing } from '../constants/theme';
import { Header } from '../components/Header';
import { useBookingStore } from '../stores/useBookingStore';
import { INITIAL_BOOKINGS } from '../constants/mockData';

export const ProfileScreen: React.FC = () => {
  const user = useBookingStore((s) => s.userSession);
  const bookings = useBookingStore((s) => s.bookings);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);

  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const totalCount = bookings.length;

  const handleResetData = () => {
    Alert.alert(
      'Khôi phục dữ liệu mẫu',
      'Bạn có muốn đặt lại toàn bộ lịch đặt phòng về trạng thái mặc định ban đầu không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đặt lại',
          style: 'destructive',
          onPress: () => {
            useBookingStore.setState({ bookings: INITIAL_BOOKINGS });
            Alert.alert('Thành công', 'Đã khôi phục dữ liệu đặt phòng ban đầu.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Hồ Sơ Sinh Viên" subtitle="Thông tin tài khoản trường VKU" showUserInfo={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Thẻ sinh viên điện tử */}
        <View style={styles.studentCard}>
          <View style={styles.studentTopRow}>
            <Image
              source={require('../../assets/vku-logo.png')}
              style={styles.cardLogo}
              resizeMode="contain"
            />
            <View style={styles.chipIdentity}>
              <Text style={styles.chipText}>VKU STUDENT PASS</Text>
            </View>
          </View>

          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={38} color={Colors.white} />
            </View>
            <View style={styles.studentMeta}>
              <Text style={styles.studentName}>{user.name}</Text>
              <Text style={styles.studentId}>MSSV: {user.studentId}</Text>
              <Text style={styles.facultyText}>{user.faculty}</Text>
              <Text style={styles.classText}>Lớp sinh hoạt: {user.classId}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.emailText}>{user.email}</Text>
          </View>
        </View>

        {/* Thống kê hoạt động */}
        <Text style={styles.sectionTitle}>Thống kê sử dụng phòng</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: Colors.vkuBlue }]}>{totalCount}</Text>
            <Text style={styles.statLabel}>Tổng lượt đặt</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: Colors.available }]}>{confirmedCount}</Text>
            <Text style={styles.statLabel}>Lịch sắp tới</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: Colors.vkuRed }]}>
              {confirmedCount * 2.25}h
            </Text>
            <Text style={styles.statLabel}>Thời lượng</Text>
          </View>
        </View>

        {/* Giới thiệu khuôn viên trường theo quy cách đề bài */}
        <Text style={styles.sectionTitle}>Sơ đồ Cơ sở Đào tạo VKU</Text>
        <View style={styles.campusCard}>
          <View style={styles.campusItem}>
            <View style={styles.campusIconBox}>
              <Ionicons name="business" size={20} color={Colors.vkuRed} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.campusTitle}>Khu K (Khu vực Đào tạo Chính)</Text>
              <Text style={styles.campusDesc}>
                Bao gồm 5 tòa nhà: A, B, C, D, E. Hiện hệ thống đang hỗ trợ đặt lịch cho các tòa A, B (3 tầng) và C (2 tầng).
              </Text>
            </View>
          </View>

          <View style={[styles.campusItem, { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 12 }]}>
            <View style={[styles.campusIconBox, { backgroundColor: Colors.vkuYellowLight }]}>
              <Ionicons name="school" size={20} color={Colors.vkuYellow} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.campusTitle}>Khu V (Khu Hành chính & Đa chức năng)</Text>
              <Text style={styles.campusDesc}>
                Khu vực văn phòng khoa, hội trường lớn và thư viện trung tâm phục vụ sự kiện.
              </Text>
            </View>
          </View>
        </View>

        {/* Cài đặt & Tiện ích */}
        <Text style={styles.sectionTitle}>Cài đặt hệ thống</Text>
        <View style={styles.settingsGroup}>
          <Pressable style={styles.settingItem} onPress={handleResetData}>
            <View style={styles.settingLeft}>
              <Ionicons name="refresh-circle-outline" size={22} color={Colors.vkuRed} />
              <Text style={styles.settingText}>Khôi phục dữ liệu mẫu ban đầu</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>
        </View>

        {/* Thông tin đồ án */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Mini-Project 2: Real-time Study Room Booking</Text>
          <Text style={styles.aboutDesc}>
            Phát triển ứng dụng di động đa nền tảng React Native & Expo SDK • Đại học CNTT & TT Việt - Hàn (VKU)
          </Text>
          <Text style={styles.aboutVersion}>Phiên bản 1.0.0 (Expo SDK 57)</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  studentCard: {
    backgroundColor: Colors.vkuBlue,
    borderRadius: 20,
    padding: 18,
    ...Shadows.lg,
    marginBottom: 20,
  },
  studentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardLogo: {
    width: 48,
    height: 34,
  },
  chipIdentity: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipText: {
    color: Colors.vkuYellowLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.vkuRed,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  studentMeta: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 2,
  },
  studentId: {
    fontSize: 13,
    color: Colors.vkuYellowLight,
    fontWeight: '700',
  },
  facultyText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  classText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 10,
  },
  emailText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Sizing.radiusMd,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  campusCard: {
    backgroundColor: Colors.white,
    borderRadius: Sizing.radiusMd,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    gap: 12,
    ...Shadows.sm,
  },
  campusItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  campusIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.vkuRedLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  campusTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  campusDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  settingsGroup: {
    backgroundColor: Colors.white,
    borderRadius: Sizing.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  aboutCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  aboutTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.vkuBlue,
    textAlign: 'center',
    marginBottom: 4,
  },
  aboutDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 280,
  },
  aboutVersion: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 6,
    fontWeight: '600',
  },
});

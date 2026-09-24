import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../types/navigation';
import { Colors, Shadows, Sizing } from '../constants/theme';
import { VKUBadge } from '../components/VKUBadge';

export const BookingConfirmationScreen: React.FC<
  RootStackScreenProps<'BookingConfirmation'>
> = ({ route, navigation }) => {
  const { booking } = route.params;

  const handleGoToMyBookings = () => {
    // Chuyển hướng sang Tab "MyBookings"
    navigation.navigate('MainTabs', { screen: 'MyBookings' });
  };

  const handleBackToHome = () => {
    // Quay về Tab "BrowseRooms"
    navigation.navigate('MainTabs', { screen: 'BrowseRooms' });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Biểu tượng thành công */}
        <View style={styles.successHeader}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={40} color={Colors.white} />
          </View>
          <Text style={styles.congratsTitle}>Đặt Phòng Thành Công!</Text>
          <Text style={styles.congratsSubtitle}>
            Thông tin thẻ đặt phòng điện tử VKU của bạn đã sẵn sàng
          </Text>
        </View>

        {/* Thẻ vé điện tử (Digital Booking Pass) */}
        <View style={styles.passCard}>
          {/* Đầu vé */}
          <View style={styles.passTop}>
            <View style={styles.passLogoRow}>
              <Image
                source={require('../../assets/vku-logo.png')}
                style={styles.passLogo}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.passOrg}>TRƯỜNG ĐẠI HỌC CNTT & TT VIỆT - HÀN</Text>
                <Text style={styles.passSubOrg}>THẺ VÀO PHÒNG HỌC ĐIỆN TỬ</Text>
              </View>
            </View>
            <VKUBadge label="ĐÃ XÁC NHẬN" variant="green" size="sm" />
          </View>

          {/* Đường đục lỗ vé (Dotted separator) */}
          <View style={styles.punchLine}>
            <View style={[styles.cutoutCircle, { left: -14 }]} />
            <View style={styles.dottedDivider} />
            <View style={[styles.cutoutCircle, { right: -14 }]} />
          </View>

          {/* Chi tiết nội dung vé */}
          <View style={styles.passBody}>
            <View style={styles.roomHighlightRow}>
              <View>
                <Text style={styles.passRoomLabel}>PHÒNG ĐÃ ĐẶT</Text>
                <Text style={styles.passRoomName}>{booking.roomName}</Text>
              </View>
              <View style={styles.buildingBadgeSquare}>
                <Text style={styles.buildingBadgeText}>Tòa {booking.building}</Text>
                <Text style={styles.floorBadgeText}>Tầng {booking.floor}</Text>
              </View>
            </View>

            <View style={styles.gridInfo}>
              <View style={styles.gridCol}>
                <Text style={styles.labelCol}>Ngày học</Text>
                <Text style={styles.valCol}>{booking.dateDisplay}</Text>
              </View>
              <View style={styles.gridCol}>
                <Text style={styles.labelCol}>Khung giờ</Text>
                <Text style={styles.valCol}>{booking.slotTime}</Text>
              </View>
            </View>

            <View style={styles.gridInfo}>
              <View style={styles.gridCol}>
                <Text style={styles.labelCol}>Sinh viên</Text>
                <Text style={styles.valCol}>{booking.studentName}</Text>
              </View>
              <View style={styles.gridCol}>
                <Text style={styles.labelCol}>Mã sinh viên</Text>
                <Text style={styles.valCol}>{booking.studentId}</Text>
              </View>
            </View>

            <View style={styles.purposeBox}>
              <Text style={styles.purposeBoxLabel}>Mục đích đăng ký:</Text>
              <Text style={styles.purposeBoxValue}>{booking.purpose}</Text>
            </View>

            {/* Mô phỏng mã QR code xác thực */}
            <View style={styles.qrSection}>
              <View style={styles.qrBox}>
                <Ionicons name="qr-code" size={100} color={Colors.vkuBlue} />
              </View>
              <Text style={styles.bookingCodeText}>Mã vé: {booking.id}</Text>
              <Text style={styles.qrInstruction}>
                Quét mã QR tại cổng vào phòng hoặc xuất trình cho cán bộ phụ trách
              </Text>
            </View>
          </View>
        </View>

        {/* Thông báo nhắc nhở */}
        <View style={styles.reminderNotice}>
          <Ionicons name="notifications-outline" size={20} color={Colors.vkuYellow} />
          <Text style={styles.reminderNoticeText}>
            Hệ thống đã tự động cài đặt thông báo nhắc bạn trước khi bắt đầu ca học.
          </Text>
        </View>

        {/* Nút hành động */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.primaryBtn} onPress={handleGoToMyBookings}>
            <Ionicons name="calendar" size={18} color={Colors.white} />
            <Text style={styles.primaryBtnText}>Xem lịch đặt của tôi</Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={handleBackToHome}>
            <Text style={styles.secondaryBtnText}>Về trang chủ khám phá phòng</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.available,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...Shadows.md,
  },
  congratsTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  congratsSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  passCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passTop: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  passLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passLogo: {
    width: 38,
    height: 32,
  },
  passOrg: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.vkuBlue,
  },
  passSubOrg: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.vkuRed,
    letterSpacing: 0.5,
  },
  punchLine: {
    position: 'relative',
    height: 24,
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  dottedDivider: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginHorizontal: 20,
  },
  cutoutCircle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    zIndex: 10,
  },
  passBody: {
    padding: 18,
    paddingTop: 8,
  },
  roomHighlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  passRoomLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  passRoomName: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.vkuBlue,
    marginTop: 2,
  },
  buildingBadgeSquare: {
    backgroundColor: Colors.vkuRed,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  buildingBadgeText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 12,
  },
  floorBadgeText: {
    color: Colors.vkuYellowLight,
    fontWeight: '600',
    fontSize: 10,
  },
  gridInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: 8,
  },
  gridCol: {
    flex: 1,
  },
  labelCol: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  valCol: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  purposeBox: {
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  purposeBoxLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  purposeBoxValue: {
    fontSize: 12,
    color: Colors.textPrimary,
  },
  qrSection: {
    alignItems: 'center',
    paddingTop: 10,
  },
  qrBox: {
    padding: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  bookingCodeText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.vkuBlue,
    letterSpacing: 1,
  },
  qrInstruction: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
  reminderNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    padding: 12,
    borderRadius: Sizing.radiusMd,
    marginTop: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  reminderNoticeText: {
    fontSize: 12,
    color: '#854D0E',
    flex: 1,
    lineHeight: 17,
  },
  actionButtons: {
    marginTop: 20,
    gap: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.vkuBlue,
    paddingVertical: 14,
    borderRadius: Sizing.radiusMd,
    gap: 8,
    ...Shadows.sm,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Sizing.radiusMd,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryBtnText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
});

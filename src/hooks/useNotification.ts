import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Booking } from '../types/room';

// Thiết lập cách hiển thị thông báo khi ứng dụng đang mở ở foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('booking-reminders', {
        name: 'Nhắc nhở Đặt phòng VKU',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#C41230',
      });
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Không thể yêu cầu quyền thông báo:', error);
    return false;
  }
}

/**
 * Lên lịch thông báo nhắc nhở sinh viên trước giờ học
 */
export async function scheduleBookingReminder(booking: Booking): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return null;

    // Gửi thông báo ngay lập tức xác nhận đặt thành công
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Đặt phòng VKU Thành Công!',
        body: `Bạn đã đặt ${booking.roomName} (${booking.slotLabel}) vào ngày ${booking.dateDisplay}. Hãy nhớ đến trước 10 phút nhé!`,
        data: { bookingId: booking.id, roomId: booking.roomId },
        sound: true,
      },
      trigger: null, // Gửi ngay
    });

    return notificationId;
  } catch (error) {
    console.warn('Lỗi khi lên lịch thông báo:', error);
    return null;
  }
}

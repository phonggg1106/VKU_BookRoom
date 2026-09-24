import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Colors } from '../constants/theme';
import { TabNavigator } from './TabNavigator';
import { RoomDetailsScreen } from '../screens/RoomDetailsScreen';
import { BookingConfirmationScreen } from '../screens/BookingConfirmationScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root Stack Navigator theo chuẩn kiến trúc bài giảng Week 6 (Slide 4, 7, 9):
 * - MainTabs: Chứa Bottom Tabs (Khám phá, Lịch của tôi, Cá nhân)
 * - RoomDetails: Màn hình chi tiết phòng học (được push lên trên, ẩn thanh tab)
 * - BookingConfirmation: Trình chiếu dạng Modal trượt từ dưới lên (presentation: 'modal')
 */
export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerStyle: { backgroundColor: Colors.vkuBlueDark },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 17,
        },
        animation: 'slide_from_right',
      }}
    >
      {/* 1. Màn hình Tab chính */}
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* 2. Màn hình Chi tiết phòng học */}
      <Stack.Screen
        name="RoomDetails"
        component={RoomDetailsScreen}
        options={({ route }) => ({
          title: route.params.room.name,
          headerBackTitle: 'Quay lại',
        })}
      />

      {/* 3. Màn hình Xác nhận vé đặt phòng (Modal) */}
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmationScreen}
        options={{
          title: 'Vé Điện Tử VKU',
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.vkuBlue },
        }}
      />
    </Stack.Navigator>
  );
};

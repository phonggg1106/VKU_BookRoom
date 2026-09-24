import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { Room, Booking } from './room';

// Tab Parameter List
export type TabParamList = {
  BrowseRooms: undefined;
  MyBookings: undefined;
  Profile: undefined;
};

// Root Stack Parameter List
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  RoomDetails: {
    room: Room;
  };
  BookingConfirmation: {
    booking: Booking;
  };
};

// Screen Props Helper Types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> =
  BottomTabScreenProps<TabParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

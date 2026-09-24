import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, FilterState, UserSession } from '../types/room';
import { DEFAULT_USER, INITIAL_BOOKINGS } from '../constants/mockData';

export const INITIAL_FILTERS: FilterState = {
  building: 'ALL',
  floor: 'ALL',
  category: 'ALL',
  minCapacity: 0,
  searchQuery: '',
};

interface BookingState {
  bookings: Booking[];
  filters: FilterState;
  userSession: UserSession;
  
  // Actions
  addBooking: (booking: Booking) => { success: boolean; message: string };
  cancelBooking: (bookingId: string) => void;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilters: () => void;
  updateUserSession: (user: Partial<UserSession>) => void;
  
  // Helper checks for time slot conflict prevention
  isSlotBooked: (roomId: string, date: string, slotId: string) => boolean;
  hasUserConflictingBooking: (date: string, slotId: string) => Booking | undefined;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: INITIAL_BOOKINGS,
      filters: INITIAL_FILTERS,
      userSession: DEFAULT_USER,

      addBooking: (newBooking: Booking) => {
        const state = get();

        // 0. Không cho phép đăng ký vào Tiết 5 (Nghỉ trưa)
        if (newBooking.slotId === 'tiet-5') {
          return {
            success: false,
            message: 'Tiết 5 là thời gian nghỉ trưa của nhà trường, không nhận đăng ký sử dụng phòng!',
          };
        }

        // 1. Kiểm tra xem phòng đó vào ngày và khung giờ đó đã có ai đặt chưa
        const isConflictRoom = state.bookings.some(
          (b) =>
            b.roomId === newBooking.roomId &&
            b.date === newBooking.date &&
            b.slotId === newBooking.slotId &&
            b.status === 'confirmed'
        );

        if (isConflictRoom) {
          return {
            success: false,
            message: `Khung giờ này của ${newBooking.roomName} đã được người khác đặt trước! Vui lòng chọn khung giờ khác.`,
          };
        }

        // 2. Kiểm tra xem chính sinh viên này đã có lịch đặt phòng nào khác trong cùng khung giờ đó chưa
        const isUserBusy = state.bookings.some(
          (b) =>
            b.studentId === newBooking.studentId &&
            b.date === newBooking.date &&
            b.slotId === newBooking.slotId &&
            b.status === 'confirmed'
        );

        if (isUserBusy) {
          return {
            success: false,
            message: 'Bạn đã có lịch đặt một phòng học khác trong cùng khung giờ này! Không thể đặt 2 phòng cùng lúc.',
          };
        }

        // Thỏa mãn điều kiện -> Thêm lịch đặt thành công
        set((s) => ({
          bookings: [newBooking, ...s.bookings],
        }));

        return {
          success: true,
          message: 'Đặt phòng thành công!',
        };
      },

      cancelBooking: (bookingId: string) => {
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
          ),
        }));
      },

      setFilter: (newFilters: Partial<FilterState>) => {
        set((s) => ({
          filters: { ...s.filters, ...newFilters },
        }));
      },

      resetFilters: () => {
        set({ filters: INITIAL_FILTERS });
      },

      updateUserSession: (updated: Partial<UserSession>) => {
        set((s) => ({
          userSession: { ...s.userSession, ...updated },
        }));
      },

      isSlotBooked: (roomId: string, date: string, slotId: string) => {
        const state = get();
        return state.bookings.some(
          (b) =>
            b.roomId === roomId &&
            b.date === date &&
            b.slotId === slotId &&
            b.status === 'confirmed'
        );
      },

      hasUserConflictingBooking: (date: string, slotId: string) => {
        const state = get();
        return state.bookings.find(
          (b) =>
            b.studentId === state.userSession.studentId &&
            b.date === date &&
            b.slotId === slotId &&
            b.status === 'confirmed'
        );
      },
    }),
    {
      name: 'vku-room-booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

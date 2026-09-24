import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../constants/theme';
import { useBookingStore } from '../stores/useBookingStore';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showUserInfo?: boolean;
  onFilterPress?: () => void;
  activeFilterCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showUserInfo = true,
  onFilterPress,
  activeFilterCount = 0,
}) => {
  const user = useBookingStore((s) => s.userSession);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <Image
            source={require('../../assets/vku-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.brandTextContainer}>
            <Text style={styles.appName}>VKU ROOM BOOKING</Text>
            <Text style={styles.slogan}>NHÂN BẢN • PHỤNG SỰ • KHAI PHÓNG</Text>
          </View>
        </View>

        {showUserInfo && (
          <View style={styles.studentBadge}>
            <Ionicons name="school-outline" size={14} color={Colors.vkuBlue} />
            <Text style={styles.studentIdText}>{user.studentId}</Text>
          </View>
        )}
      </View>

      {(title || subtitle) && (
        <View style={styles.titleSection}>
          <View style={{ flex: 1 }}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>

          {onFilterPress && (
            <Pressable
              style={({ pressed }) => [
                styles.filterBtn,
                pressed && { opacity: 0.8 },
                activeFilterCount > 0 && styles.filterBtnActive,
              ]}
              onPress={onFilterPress}
            >
              <Ionicons
                name="filter"
                size={18}
                color={activeFilterCount > 0 ? Colors.white : Colors.vkuBlue}
              />
              <Text
                style={[
                  styles.filterBtnText,
                  activeFilterCount > 0 && { color: Colors.white },
                ]}
              >
                Bộ lọc
              </Text>
              {activeFilterCount > 0 && (
                <View style={styles.filterCountBadge}>
                  <Text style={styles.filterCountText}>{activeFilterCount}</Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 44,
    height: 38,
    marginRight: 10,
  },
  brandTextContainer: {
    justifyContent: 'center',
  },
  appName: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.vkuBlue,
    letterSpacing: 0.5,
  },
  slogan: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.vkuRed,
    letterSpacing: 0.2,
    marginTop: 1,
  },
  studentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.vkuBlueLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  studentIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.vkuBlue,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  filterBtnActive: {
    backgroundColor: Colors.vkuBlue,
    borderColor: Colors.vkuBlue,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.vkuBlue,
  },
  filterCountBadge: {
    backgroundColor: Colors.vkuRed,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCountText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
});

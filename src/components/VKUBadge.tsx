import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/theme';

interface VKUBadgeProps {
  label: string;
  variant?: 'red' | 'yellow' | 'blue' | 'green' | 'gray';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const VKUBadge: React.FC<VKUBadgeProps> = ({
  label,
  variant = 'blue',
  size = 'md',
  style,
}) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'red':
        return { bg: Colors.vkuRedLight, text: Colors.vkuRed };
      case 'yellow':
        return { bg: Colors.vkuYellowLight, text: '#92400E' };
      case 'green':
        return { bg: Colors.availableLight, text: '#065F46' };
      case 'gray':
        return { bg: '#F1F5F9', text: '#475569' };
      case 'blue':
      default:
        return { bg: Colors.vkuBlueLight, text: Colors.vkuBlue };
    }
  };

  const colors = getBadgeColors();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg },
        isSm ? styles.badgeSm : styles.badgeMd,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.text },
          isSm ? styles.textSm : styles.textMd,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontWeight: '700',
  },
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 12,
  },
});

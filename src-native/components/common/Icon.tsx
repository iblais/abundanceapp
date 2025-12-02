/**
 * Abundance Flow - Icon Component
 *
 * Wrapper for vector icons with consistent styling
 * Uses thin-line minimalist style as per spec
 */

import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import Svg, { Path, G, Circle, Rect, Line, Polyline } from 'react-native-svg';
import { useAppTheme } from '@theme/ThemeContext';
import { sizing } from '@theme/spacing';

export type IconName =
  | 'home'
  | 'meditation'
  | 'journal'
  | 'profile'
  | 'settings'
  | 'play'
  | 'pause'
  | 'stop'
  | 'back'
  | 'forward'
  | 'close'
  | 'check'
  | 'plus'
  | 'minus'
  | 'heart'
  | 'heartFilled'
  | 'star'
  | 'clock'
  | 'calendar'
  | 'bell'
  | 'sun'
  | 'moon'
  | 'volume'
  | 'volumeMute'
  | 'menu'
  | 'search'
  | 'filter'
  | 'edit'
  | 'trash'
  | 'share'
  | 'download'
  | 'refresh'
  | 'chevronRight'
  | 'chevronLeft'
  | 'chevronDown'
  | 'chevronUp'
  | 'sparkle'
  | 'brain'
  | 'book'
  | 'headphones'
  | 'chart'
  | 'streak'
  | 'grid'
  | 'list'
  | 'image'
  | 'camera'
  | 'send'
  | 'chat';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  strokeWidth?: number;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = sizing.iconBase,
  color,
  style,
  strokeWidth = 1.5,
}) => {
  const theme = useAppTheme();
  const iconColor = color || theme.colors.text.primary;

  const renderPath = () => {
    switch (name) {
      case 'home':
        return (
          <Path
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'meditation':
        return (
          <G stroke={iconColor} strokeWidth={strokeWidth} fill="none">
            <Circle cx="12" cy="8" r="3" />
            <Path d="M12 11v2m-4 7c0-4 2-6 4-6s4 2 4 6" strokeLinecap="round" />
          </G>
        );
      case 'journal':
        return (
          <Path
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'profile':
        return (
          <G stroke={iconColor} strokeWidth={strokeWidth} fill="none">
            <Circle cx="12" cy="8" r="4" />
            <Path d="M20 21a8 8 0 10-16 0" strokeLinecap="round" />
          </G>
        );
      case 'settings':
        return (
          <Path
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'play':
        return (
          <Path
            d="M8 5v14l11-7z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'pause':
        return (
          <G stroke={iconColor} strokeWidth={strokeWidth} fill="none">
            <Rect x="6" y="4" width="4" height="16" rx="1" />
            <Rect x="14" y="4" width="4" height="16" rx="1" />
          </G>
        );
      case 'stop':
        return (
          <Rect
            x="6"
            y="6"
            width="12"
            height="12"
            rx="2"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
        );
      case 'back':
        return (
          <Path
            d="M19 12H5m0 0l7 7m-7-7l7-7"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'close':
        return (
          <Path
            d="M6 18L18 6M6 6l12 12"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'check':
        return (
          <Path
            d="M5 13l4 4L19 7"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'plus':
        return (
          <Path
            d="M12 4v16m8-8H4"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'heart':
        return (
          <Path
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'heartFilled':
        return (
          <Path
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={iconColor}
          />
        );
      case 'clock':
        return (
          <G stroke={iconColor} strokeWidth={strokeWidth} fill="none">
            <Circle cx="12" cy="12" r="9" />
            <Path d="M12 7v5l3 3" strokeLinecap="round" />
          </G>
        );
      case 'calendar':
        return (
          <Path
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'bell':
        return (
          <Path
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'sun':
        return (
          <G stroke={iconColor} strokeWidth={strokeWidth} fill="none">
            <Circle cx="12" cy="12" r="4" />
            <Path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
          </G>
        );
      case 'moon':
        return (
          <Path
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'volume':
        return (
          <Path
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'chevronRight':
        return (
          <Path
            d="M9 5l7 7-7 7"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'chevronLeft':
        return (
          <Path
            d="M15 19l-7-7 7-7"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'chevronDown':
        return (
          <Path
            d="M19 9l-7 7-7-7"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'sparkle':
        return (
          <Path
            d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'brain':
        return (
          <Path
            d="M9.5 2A2.5 2.5 0 007 4.5v.006c-.3-.003-.611.025-.916.089A2.5 2.5 0 004 7a2.5 2.5 0 00.916 1.905A2.5 2.5 0 002.5 12a2.5 2.5 0 002.916 2.095A2.5 2.5 0 007 19.5a2.5 2.5 0 002.5-2.5c.005.003.011.006.016.01A2.5 2.5 0 0012 19.5a2.5 2.5 0 002.484-2.49c.005-.004.011-.007.016-.01a2.5 2.5 0 002.5 2.5 2.5 2.5 0 001.584-5.405A2.5 2.5 0 0021.5 12a2.5 2.5 0 00-2.416-3.095A2.5 2.5 0 0020 7a2.5 2.5 0 00-2.084-2.405A2.494 2.494 0 0017 4.5a2.5 2.5 0 00-2.5-2.5c-.546 0-1.059.175-1.474.472A2.494 2.494 0 0011.5 2c-.546 0-1.059.175-1.474.472A2.494 2.494 0 009.5 2z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'book':
        return (
          <Path
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'headphones':
        return (
          <Path
            d="M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'chart':
        return (
          <Path
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'streak':
        return (
          <Path
            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c-1.5-2-1.5-6-1.5-6s3.5 2 6 2c2.5 0 4.9-1.4 5.9-3.9C21 6 21 12 17.657 18.657z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'chat':
        return (
          <Path
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'send':
        return (
          <Path
            d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'grid':
        return (
          <Path
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {renderPath()}
      </Svg>
    </View>
  );
};

export default Icon;

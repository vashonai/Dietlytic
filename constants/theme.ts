/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Jamaican flag colors
const jamaicanGreen = '#009639'; // Jamaican green
const jamaicanGold = '#FFD700'; // Jamaican gold
const jamaicanBlack = '#000000'; // Black accent

const tintColorLight = jamaicanGreen;
const tintColorDark = jamaicanGold;

export const Colors = {
  light: {
    text: jamaicanBlack,
    background: '#fff',
    tint: tintColorLight,
    icon: '#666',
    tabIconDefault: '#666',
    tabIconSelected: tintColorLight,
    primary: jamaicanGreen,
    secondary: jamaicanGold,
    accent: jamaicanBlack,
    cardBackground: '#f8f9fa',
    border: '#e0e0e0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: jamaicanGreen,
    secondary: jamaicanGold,
    accent: jamaicanBlack,
    cardBackground: '#2a2a2a',
    border: '#444',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

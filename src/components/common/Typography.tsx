/**
 * Abundance Flow - Typography Components
 *
 * Pre-styled text components for consistent typography
 */

import React, { ReactNode } from 'react';
import { Text, TextStyle, StyleProp, TextProps } from 'react-native';
import { useAppTheme } from '@theme/ThemeContext';
import { textStyles } from '@theme/typography';

interface TypographyProps extends TextProps {
  children: ReactNode;
  color?: string;
  style?: StyleProp<TextStyle>;
  align?: 'left' | 'center' | 'right';
}

// Display text - for hero sections
export const DisplayLarge: React.FC<TypographyProps> = ({
  children,
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        textStyles.displayLarge,
        { color: color || theme.colors.text.primary },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const DisplayMedium: React.FC<TypographyProps> = ({
  children,
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        textStyles.displayMedium,
        { color: color || theme.colors.text.primary },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Headings
export const H1: React.FC<TypographyProps> = ({
  children,
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        textStyles.h1,
        { color: color || theme.colors.text.primary },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const H2: React.FC<TypographyProps> = ({
  children,
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        textStyles.h2,
        { color: color || theme.colors.text.primary },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const H3: React.FC<TypographyProps> = ({
  children,
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        textStyles.h3,
        { color: color || theme.colors.text.primary },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const H4: React.FC<TypographyProps> = ({
  children,
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        textStyles.h4,
        { color: color || theme.colors.text.primary },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Body text
export const Body: React.FC<TypographyProps> = ({
  children,
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        textStyles.body,
        { color: color || theme.colors.text.secondary },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const BodyLarge: React.FC<TypographyProps> = ({
  children,
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        textStyles.bodyLarge,
        { color: color || theme.colors.text.secondary },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const BodySmall: React.FC<TypographyProps> = ({
  children,
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        textStyles.bodySmall,
        { color: color || theme.colors.text.secondary },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Labels
export const Label: React.FC<TypographyProps> = ({
  children,
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        textStyles.label,
        { color: color || theme.colors.text.secondary },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const LabelSmall: React.FC<TypographyProps> = ({
  children,
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        textStyles.labelSmall,
        { color: color || theme.colors.text.tertiary },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Caption and overline
export const Caption: React.FC<TypographyProps> = ({
  children,
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        textStyles.caption,
        { color: color || theme.colors.text.tertiary },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const Overline: React.FC<TypographyProps> = ({
  children,
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        textStyles.overline,
        { color: color || theme.colors.text.tertiary },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Score display
export const ScoreDisplay: React.FC<TypographyProps> = ({
  children,
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        textStyles.scoreDisplay,
        { color: color || theme.colors.text.primary },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Generic text component
interface AppTextProps extends TypographyProps {
  variant?: keyof typeof textStyles;
}

export const AppText: React.FC<AppTextProps> = ({
  children,
  variant = 'body',
  color,
  style,
  align,
  ...props
}) => {
  const theme = useAppTheme();
  const baseColor =
    variant.includes('body') || variant.includes('label')
      ? theme.colors.text.secondary
      : theme.colors.text.primary;

  return (
    <Text
      style={[
        textStyles[variant],
        { color: color || baseColor },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default AppText;

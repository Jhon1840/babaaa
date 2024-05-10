import React, { ReactNode } from 'react';
import { MotiView } from 'moti';
import { ViewStyle } from 'react-native';

interface FadeInProps {
  children: ReactNode;
  duration?: number;
  style?: ViewStyle;
}

const FadeIn: React.FC<FadeInProps> = ({ children, duration = 1000, style }) => {
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration }}
      style={style}
    >
      {children}
    </MotiView>
  );
};

export default FadeIn;

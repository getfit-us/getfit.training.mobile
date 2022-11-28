import React from "react";
import {
  StyleProp,
  ViewStyle,
  Animated,
  StyleSheet,
  Platform,
  ScrollView,
  Text,
  SafeAreaView,
  I18nManager,
} from "react-native";
import { AnimatedFAB } from "react-native-paper";

const MyComponent = ({
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode,
  setShowBanner,
  icon,
}) => {
  const [isExtended, setIsExtended] = React.useState(false);

  const isIOS = Platform.OS === "ios";

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = { [animateFrom]: 16 };

  const handlePress = () => {
    setShowBanner(!extended);
  };

  return (
    <AnimatedFAB
      color="black"
      uppercase
      variant="primary"
      icon={icon}
      label={label}
      extended={extended}
      onPress={handlePress}
      visible={visible}
      animateFrom={"right"}
      iconMode={"dynamic"}
      style={[styles.fabStyle, style, fabStyle]}
    />
  );
};

export default MyComponent;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
  },
});

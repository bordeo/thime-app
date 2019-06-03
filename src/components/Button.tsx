import * as React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import colors, { currentTheme } from "../config/colors";

interface Props {
  disabled?: boolean; // Add a "disabled" prop
  label: string;
  loading?: boolean;
  onPress: () => void;
}

class Button extends React.Component<Props> {
  render() {
    const { disabled, label, loading, onPress } = this.props;
    // If the button is disabled we lower its opacity
    const containerStyle = [
      styles.container,
      disabled || loading ? styles.containerDisabled : styles.containerEnabled
    ];
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        disabled={disabled || loading}
      >
        {!loading && <Text style={styles.text}>{label}</Text>}
        {loading && (
          <ActivityIndicator size="small" color={currentTheme().buttonText} />
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: currentTheme().buttonBg,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.7)"
  },
  containerEnabled: {
    opacity: 1
  },
  containerDisabled: {
    opacity: 0.3
  },
  text: {
    color: currentTheme().buttonText,
    textAlign: "center",
    height: 20
  }
});

export default Button;

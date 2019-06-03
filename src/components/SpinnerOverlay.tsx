import * as React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import colors from '../config/colors';

interface Props {
  visible: boolean;
}

class SpinnerOverlay extends React.Component<Props> {
  render() {
    const { visible } = this.props;
    return (
      <Modal
        visible={visible}
        animationType="none"
        transparent
        onRequestClose={() => {}}
      >
        <View style={styles.content}>
          <ActivityIndicator color={colors.BOTTLE_GREEN} style={{ flex: 1 }} size="large" />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)"
  }
});

export default SpinnerOverlay;

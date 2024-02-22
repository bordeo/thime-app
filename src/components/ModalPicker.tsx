import * as React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import ReactNativeModal from "react-native-modal";

interface Item {
  label: string;
  value: string;
}

interface Props {
  title: string;
  visible: boolean;
  items: Item[];
  onConfirm: (value: string) => void;
  onCancel: () => void;
  value?: string;
}

interface State {
  currentValue: string;
  userIsInteractingWithPicker: boolean;
}

class ModalPicker extends React.Component<Props, State> {
  confirmed: boolean = false;

  readonly state: State = {
    currentValue: this.props.value
      ? this.props.value
      : this.props.items[0].value,
    userIsInteractingWithPicker: false,
  };

  resetCurrentValue = () => {
    this.setState({
      currentValue: this.props.value
        ? this.props.value
        : this.props.items[0].value,
    });
  };

  handleValueChange = (value: string) => {
    this.setState({
      currentValue: value,
      userIsInteractingWithPicker: false,
    });
  };

  handleUserTouchInit = () => {
    this.setState({
      userIsInteractingWithPicker: true,
    });
    return false;
  };

  handleCancel = () => {
    this.confirmed = false;
    this.props.onCancel();
    this.resetCurrentValue();
  };

  handleConfirm = () => {
    this.confirmed = true;
    this.props.onConfirm(this.state.currentValue);
  };
  render() {
    const { visible, items, title } = this.props;
    const { currentValue, userIsInteractingWithPicker } = this.state;

    return (
      <ReactNativeModal
        isVisible={visible}
        style={styles.contentContainer}
        backdropOpacity={0.4}
      >
        <View style={styles.pickerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View onStartShouldSetResponderCapture={this.handleUserTouchInit}>
            <Picker
              selectedValue={currentValue}
              onValueChange={this.handleValueChange}
            >
              {items.map((list) => (
                <Picker.Item
                  key={list.value}
                  label={list.label}
                  value={list.value}
                />
              ))}
            </Picker>
          </View>
          <TouchableHighlight
            style={[
              styles.confirmButton,
              userIsInteractingWithPicker
                ? styles.confirmButtonDisabled
                : undefined,
            ]}
            underlayColor="#ebebeb"
            onPress={this.handleConfirm}
            disabled={userIsInteractingWithPicker}
          >
            <Text style={styles.confirmText}>Conferma</Text>
          </TouchableHighlight>
        </View>

        <TouchableHighlight
          style={styles.cancelButton}
          underlayColor="#ebebeb"
          onPress={this.handleCancel}
        >
          <Text style={styles.cancelText}>Annulla</Text>
        </TouchableHighlight>
      </ReactNativeModal>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "flex-end",
    margin: 10,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 13,
    marginBottom: 8,
    overflow: "hidden",
  },
  titleContainer: {
    borderBottomColor: "#d5d5d5",
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 14,
    backgroundColor: "transparent",
  },
  title: {
    textAlign: "center",
    color: "#8f8f8f",
    fontSize: 15,
  },
  confirmButton: {
    borderColor: "#d5d5d5",
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: "transparent",
    height: 57,
    justifyContent: "center",
  },
  confirmButtonDisabled: {
    opacity: 0.4,
  },
  confirmText: {
    textAlign: "center",
    color: "#007ff9",
    fontSize: 20,
    fontWeight: "normal",
    backgroundColor: "transparent",
  },
  cancelButton: {
    backgroundColor: "white",
    borderRadius: 13,
    height: 57,
    marginBottom: 0,
    justifyContent: "center",
  },
  cancelText: {
    padding: 10,
    textAlign: "center",
    color: "#007ff9",
    fontSize: 20,
    fontWeight: "600",
    backgroundColor: "transparent",
  },
});

export default ModalPicker;

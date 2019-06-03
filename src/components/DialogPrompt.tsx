import * as React from "react";
import { StyleSheet } from "react-native";
// @ts-ignore
import Dialog from "react-native-dialog";
import { BlurView } from "expo";

type Props = {
  title: string;
  description?: string;
  visible: boolean;
  value: string;
  validate?: (value: string) => boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  onChangeText?: (value: string) => void;
  autoFocus?: boolean;
};

type State = {
  value: string;
  valid: boolean;
};

class DialogPrompt extends React.Component<Props, State> {
  state = {
    value: this.props.value,
    valid: this.props.validate ? this.props.validate(this.props.value) : true
  };

  componentWillReceiveProps(nextProps: Props) {
    if (
      !this.props.visible &&
      nextProps.visible &&
      this.props.value !== this.state.value
    ) {
      this.setState({
        value: this.props.value,
        valid: this.props.validate
          ? this.props.validate(this.props.value)
          : true
      });
    }
  }

  handleChangeText = (value: string) => {
    const { onChangeText, validate } = this.props;
    if (onChangeText) {
      onChangeText(value);
    }
    this.setState({
      value: value,
      valid: validate ? validate(value) : true
    });
  };

  render() {
    const {
      title,
      description,
      visible,
      value,
      validate,
      onConfirm,
      onCancel,
      onChangeText,
      autoFocus,
      ...otherProps
    } = this.props;
    return (      
      <Dialog.Container
        visible={visible}
        blurComponentIOS={
          <BlurView
            style={StyleSheet.absoluteFill}
            tint="light"
            intensity={200}
          />
        }
      >
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        <Dialog.Input      
          {...otherProps}
          onChangeText={this.handleChangeText}
          value={this.state.value}
          autoFocus={autoFocus}
        />
        <Dialog.Button label="Annulla" onPress={onCancel} />
        <Dialog.Button
          label="Conferma"
          onPress={() => onConfirm(this.state.value)}
          disabled={!this.state.valid}
          color={this.state.valid ? undefined : "grey"}
          bold
        />
      </Dialog.Container>
    );
  }
}

export default DialogPrompt;

import * as React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  Text,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Platform
} from "react-native";
import colors from "../config/colors";

type Props = TextInputProps & {
  error?: string;
};

interface State {
  isFocused: boolean;
}

class FormTextInput extends React.Component<Props, State> {
  textInputRef = React.createRef<TextInput>();
  readonly state: State = {
    isFocused: false
  };

  focus = () => {
    if (this.textInputRef.current) {
      this.textInputRef.current.focus();
    }
  };

  handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    this.setState({ isFocused: true });
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  };

  handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    this.setState({ isFocused: false });
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  };

  render() {
    const { error, onFocus, onBlur, style, ...otherProps } = this.props;
    const { isFocused } = this.state;

    return (
      <View>
        <TextInput
          ref={this.textInputRef}
          selectionColor={colors.BOTTLE_GREEN}
          style={[styles.textInput, style]}
          underlineColorAndroid={
            isFocused ? colors.BOTTLE_GREEN : colors.LIGHT_GRAY
          }
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          {...otherProps}
        />
        <Text style={styles.errorText}>{error || ""}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  textInput: {
    height: 40,
    ...Platform.select({
      ios: {
        borderColor: colors.SILVER,
        borderBottomWidth: StyleSheet.hairlineWidth
      },
      android: {
        paddingLeft: 6
      }
    })
  },
  errorText: {
    height: 20,
    marginTop: 3,
    color: colors.MONZA,
    ...Platform.select({
      android: {
        paddingLeft: 6
      }
    })
  }
});

export default FormTextInput;

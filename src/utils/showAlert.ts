/**
 * Async wrapper over react-native Alert, useful if you need to know when
 * the alert has been dismissed (you can simply await it).
 */
import { Alert } from "react-native";

const showAlert = async (
  title: string,
  message: string,
  buttonText: string = "Ok"
): Promise<any> => {
  return new Promise(resolve => {
    const buttons = [{ text: buttonText, onPress: resolve }];
    Alert.alert(title, message, buttons, {
      cancelable: false
    });
  });
};

export default showAlert;

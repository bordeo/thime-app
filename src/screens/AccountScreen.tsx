// Main.js
import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { auth } from "../services/firebase";
import firebase from "firebase";
import { NavigationScreenProps } from "react-navigation";
import Button from "../components/Button";
import i18n from "../localization/i18n";
import env from "../config/env";
import { Ionicons } from "@expo/vector-icons";
import en from "../localization/en";
import colors, { setCurrentTheme, Theme, currentTheme } from "../config/colors";

type NavigationProps = NavigationScreenProps<{ handleSignOut: () => void }>;

type Props = NavigationProps;

type State = {
  currentUser: firebase.User | null;
  errorMessage: string | null;
  theme: Theme;
};

class AccountScreen extends React.Component<Props> {
  state: State = { currentUser: null, errorMessage: null, theme: "green" };

  static navigationOptions = (options: NavigationProps) => ({
    title: i18n.t("account"),
    headerRight: (
      <TouchableOpacity
        style={styles.headerRight}
        hitSlop={{ right: 5, left: 5, top: 5, bottom: 5 }}
        onPress={options.navigation.getParam("handleSignOut")}
      >
        <Text style={styles.headerRightText}>{i18n.t("signout")}</Text>
      </TouchableOpacity>
    )
  });

  changeTheme = () => {
    const { theme } = this.state;
    setCurrentTheme(theme);
    this.setState((state: State) => {
      console.log(theme);
      return {
        theme: state.theme === "yellow" ? "green" : "yellow"
      };
    });
  };

  componentDidMount() {
    this.setState({ currentUser: auth.getCurrentUser() });
    this.props.navigation.setParams({ handleSignOut: this.handleSignOut });
  }

  handleSignOut = () => {
    auth
      .doSignOut()
      .then(() => this.props.navigation.navigate("Loading"))
      .catch(error => this.setState({ errorMessage: error.message }));
  };

  render() {
    const { currentUser, errorMessage, theme } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}
          <Text style={styles.email}>{currentUser && currentUser.email}</Text>
          {/* <Text style={styles.email}>{`Current theme: ${theme}`}</Text> */}
          {/* <Button label={i18n.t("Change theme")} onPress={this.changeTheme} /> */}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  content: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  },
  email: {
    alignSelf: "center",
    marginBottom: 20
  },
  headerRight: {
    paddingRight: 16
  },
  headerRightText: {
    color: colors.MONZA,
    fontSize: 16
  }
});

export default AccountScreen;

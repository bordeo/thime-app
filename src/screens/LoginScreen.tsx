import * as React from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  StatusBar
} from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import imageLogoGreen from "../../assets/green/logo.png";
import imageLogoYellow from "../../assets/yellow/logo.png";
import colors, { currentTheme } from "../config/colors";
import { db, auth } from "../services/firebase";
import { NavigationScreenProps } from "react-navigation";
import Link from "../components/Link";
import { setFacility } from "../utils/globals";
import i18n from "../localization/i18n";
import env from "../config/env";

type NavigationProps = NavigationScreenProps<{}>;

type Props = NavigationProps;

interface State {
  email: string;
  password: string;
  emailTouched: boolean;
  passwordTouched: boolean;
  errorMessage?: string;
  isLoggingIn: boolean;
}

class LoginScreen extends React.Component<Props, State> {
  passwordInputRef = React.createRef<FormTextInput>();

  readonly state: State = {
    email: "",
    password: "",
    errorMessage: undefined,
    emailTouched: false,
    passwordTouched: false,
    isLoggingIn: false
  };

  imageLogo = currentTheme().name == "green" ? imageLogoGreen : imageLogoYellow;

  handleEmailChange = (email: string) => {
    this.setState({ email: email });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password: password });
  };

  handleEmailBlur = () => {
    this.setState({ emailTouched: true });
  };

  handlePasswordBlur = () => {
    this.setState({ passwordTouched: true });
  };

  handleLoginPress = () => {
    this.setState({ isLoggingIn: true });
    const { email, password } = this.state;
    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(async authUser => {
        this.setState({ isLoggingIn: false });
        if (authUser.user)
          await db.onceGetUserFacility(authUser.user.uid, dataSnapshot => {
            setFacility(dataSnapshot.val());
          });
      })
      .then(() => this.props.navigation.navigate("Loading"))
      .catch(error =>
        this.setState({ errorMessage: error.message, isLoggingIn: false })
      );
  };

  handleEmailSubmitPress = () => {
    if (this.passwordInputRef.current) {
      this.passwordInputRef.current.focus();
    }
  };

  render() {
    const {
      email,
      password,
      emailTouched,
      passwordTouched,
      errorMessage,
      isLoggingIn
    } = this.state;
    const emailError =
      !email && emailTouched
        ? i18n.t("emailRequired")
        : email && emailTouched && !/^.+@.+\..+$/.test(email)
        ? i18n.t("emailWrong")
        : undefined;
    const passwordError =
      !password && passwordTouched ? i18n.t("passwordRequired") : undefined;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={env.IS_IOS ? "padding" : undefined}
      >
        <StatusBar
          backgroundColor={currentTheme().mainBg}
          barStyle="dark-content"
        />
        <Image source={this.imageLogo} style={styles.logo} />
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        <View style={styles.form}>
          <FormTextInput
            value={email}
            onChangeText={this.handleEmailChange}
            placeholder={i18n.t("emailPlaceholder")}
            onSubmitEditing={this.handleEmailSubmitPress}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            returnKeyType="next"
            onBlur={this.handleEmailBlur}
            error={emailError}
            blurOnSubmit={env.IS_IOS}
            editable={!isLoggingIn}
          />
          <FormTextInput
            ref={this.passwordInputRef}
            value={password}
            onChangeText={this.handlePasswordChange}
            placeholder={i18n.t("passwordPlaceholder")}
            secureTextEntry={true}
            returnKeyType="done"
            onBlur={this.handlePasswordBlur}
            error={passwordError}
            editable={!isLoggingIn}
          />
          <Button
            label={i18n.t("login")}
            onPress={this.handleLoginPress}
            disabled={!email || !password}
            loading={isLoggingIn}
          />
          {/* <Link
            label={i18n.t("signupLink")}
            onPress={() => this.props.navigation.navigate("SignUp")}
          /> */}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: currentTheme().mainBg,
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  },
  error: {
    textAlign: "center",
    color: colors.MONZA,
    width: "80%"
  }
});

export default LoginScreen;

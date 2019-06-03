// SignUp.js
import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  KeyboardAvoidingView,
  StatusBar,
  Platform
} from "react-native";
import { auth, db } from "../services/firebase";
import { NavigationScreenProps } from "react-navigation";
import Button from "../components/Button";
import Link from "../components/Link";
import imageLogo from "../../assets/green/logo.png";
import colors from "../config/colors";
import FormTextInput from "../components/FormTextInput";
import strings from "../config/strings";
import env from "../config/env";
import uuid from "uuid";
import i18n from "../localization/i18n";

type NavigationProps = NavigationScreenProps<{}>;

type Props = NavigationProps;

interface State {
  email: string;
  password: string;
  passwordConfirm: string;
  emailTouched: boolean;
  passwordTouched: boolean;
  passwordConfirmTouched: boolean;
  errorMessage?: string;
}

class SignUpScreen extends React.Component<Props, State> {
  passwordInputRef = React.createRef<FormTextInput>();
  passwordConfirmInputRef = React.createRef<FormTextInput>();

  readonly state: State = {
    email: "",
    password: "",
    passwordConfirm: "",
    emailTouched: false,
    passwordTouched: false,
    passwordConfirmTouched: false,
    errorMessage: undefined
  };

  handleSignUpPress = () => {
    const { email, password } = this.state;

    auth
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        if (authUser.user)
          db.doCreateUser(authUser.user.uid, email, "movembik");
      })
      .then(() => this.props.navigation.navigate("Main"))
      .catch(error => this.setState({ errorMessage: error.message }));
  };

  handleEmailChange = (email: string) => {
    this.setState({ email });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password });
  };

  handlePasswordConfirmChange = (passwordConfirm: string) => {
    this.setState({ passwordConfirm });
  };

  handleEmailBlur = () => {
    this.setState({ emailTouched: true });
  };

  handlePasswordBlur = () => {
    this.setState({ passwordTouched: true });
  };

  handlePasswordConfirmBlur = () => {
    this.setState({ passwordConfirmTouched: true });
  };

  handleEmailSubmitPress = () => {
    if (this.passwordInputRef.current) {
      this.passwordInputRef.current.focus();
    }
  };

  handlePasswordSubmitPress = () => {
    if (this.passwordConfirmInputRef.current) {
      this.passwordConfirmInputRef.current.focus();
    }
  };

  render() {
    const {
      email,
      password,
      passwordConfirm,
      emailTouched,
      passwordTouched,
      passwordConfirmTouched,
      errorMessage
    } = this.state;
    const emailError =
      !email && emailTouched
        ? i18n.t("emailRequired")
        : email && emailTouched && !/^.+@.+\..+$/.test(email)
        ? i18n.t("emailWrong")
        : undefined;
    const passwordError =
      !password && passwordTouched ? i18n.t("passwordRequired") : undefined;
    const passwordConfirmError =
      !passwordConfirm && passwordConfirmTouched
        ? strings.PASSWORD_CONFIRM_REQUIRED
        : passwordConfirm &&
          passwordConfirmTouched &&
          password &&
          passwordTouched &&
          passwordConfirm !== password
        ? strings.PASSWORD_CONFIRM_NOT_MATCH
        : undefined;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={Platform.select({
          ios: () => -100,
          android: () => -120
        })()}
      >
        <StatusBar backgroundColor={colors.WHITE} barStyle="dark-content" />
        <Image source={imageLogo} style={styles.logo} />
        <Text>Sign Up</Text>
        {errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}
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
          />
          <FormTextInput
            ref={this.passwordInputRef}
            value={password}
            onChangeText={this.handlePasswordChange}
            placeholder={i18n.t("passwordPlaceholder")}
            onSubmitEditing={this.handlePasswordSubmitPress}
            secureTextEntry={true}
            returnKeyType="next"
            onBlur={this.handlePasswordBlur}
            error={passwordError}
          />
          <FormTextInput
            ref={this.passwordConfirmInputRef}
            value={passwordConfirm}
            onChangeText={this.handlePasswordConfirmChange}
            placeholder={strings.PASSWORD_CONFIRM_PLACEHOLDER}
            secureTextEntry={true}
            returnKeyType="done"
            onBlur={this.handlePasswordConfirmBlur}
            error={passwordConfirmError}
          />
          <Button
            label="Sign Up"
            onPress={this.handleSignUpPress}
            disabled={
              !email ||
              !password ||
              !passwordConfirm ||
              password !== passwordConfirm
            }
          />
          <Link
            label="Already have an account? Login"
            onPress={() => this.props.navigation.navigate("Login")}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
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
  }
});

export default SignUpScreen;

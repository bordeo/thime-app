import React from "react";
import { StatusBar, StyleSheet, View, YellowBox } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import env from "./src/config/env";
import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import { Text } from "react-native";
import { getLocalizationAsync } from "expo-localization";
// import { SafeAreaView } from "react-navigation";
import colors, { currentTheme } from "./src/config/colors";
import "react-native-gesture-handler";

YellowBox.ignoreWarnings(["Require cycle:"]);

// if (env.IS_ANDROID) {
//   SafeAreaView.setStatusBarHeight(0);
// }

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };
  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {env.IS_IOS && <StatusBar barStyle="default" />}
          {env.IS_ANDROID && (
            <StatusBar backgroundColor={colors.WHITE} barStyle="dark-content" />
          )}
          <AppNavigator />
        </View>
      );
    }
  }

  async _loadResourcesAsync() {
    return Promise.all([
      currentTheme().name === "green"
        ? Asset.loadAsync([require("./assets/green/logo.png")])
        : Asset.loadAsync([require("./assets/yellow/logo.png")]),
      getLocalizationAsync(),
    ]);
  }

  _handleLoadingError = (error: Error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

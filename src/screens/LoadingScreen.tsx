// Loading.js
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { auth } from "../services/firebase/firebase";
import { db } from "../services/firebase";
import { NavigationScreenProps } from "react-navigation";
import { setFacility } from "../utils/globals";
import { currentTheme } from "../config/colors";

type NavigationProps = NavigationScreenProps<{}>;

type Props = NavigationProps;

class LoadingScreen extends React.Component<Props> {
  authUnsubscribe?: firebase.Unsubscribe = undefined;

  componentDidMount() {
    this.authUnsubscribe = auth.onAuthStateChanged(async user => {
      if (user)
        await db.onceGetUserFacility(user.uid, dataSnapshot => {
          setFacility(dataSnapshot.val());
        });
      this.props.navigation.navigate(user ? "Main" : "Login");
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe && this.authUnsubscribe();
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={currentTheme().spinner} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default LoadingScreen;

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

// import the different screens
import MainTabNavigator from "./MainTabNavigator";
import LoadingScreen from "../screens/LoadingScreen";
import SignUpScreen from "../screens/SignUpScreen";
import LoginScreen from "../screens/LoginScreen";

export default function AppNavigator({ isLoggedIn }) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
          </>
        ) : (
          <>
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            {/* <Stack.Screen name="Main" component={MainTabNavigator} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

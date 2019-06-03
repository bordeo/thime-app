import { createAppContainer, createSwitchNavigator } from "react-navigation";
// import the different screens
import MainTabNavigator from "./MainTabNavigator";
import LoadingScreen from "../screens/LoadingScreen";
import SignUpScreen from "../screens/SignUpScreen";
import LoginScreen from "../screens/LoginScreen";

const App = createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      // SignUp: SignUpScreen,
      Login: LoginScreen,
      Main: MainTabNavigator
    },
    {
      initialRouteName: "Loading"
    }
  )
);
export default App;

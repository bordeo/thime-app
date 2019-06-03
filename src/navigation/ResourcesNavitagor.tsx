import ResourcesScreen from "../screens/ResourcesScreen";
import { createStackNavigator } from "react-navigation";
import color from "../config/colors";

const LoggedInNavigator = createStackNavigator(
  {
    ResourcesScreen: { screen: ResourcesScreen }
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: color.headerBg
      },
      headerTintColor: "white"
    }
  }
);

let LoginScreen = undefined; //@todo make loginscreen

const LoggedOutNavigator = createStackNavigator({
  Login: { screen: LoginScreen }
});

export default {
  LoggedInNavigator,
  LoggedOutNavigator
};

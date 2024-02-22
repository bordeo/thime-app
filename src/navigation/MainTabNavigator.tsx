import React from "react";
import env from "../config/env";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import TabBarIcon from "../components/TabBarIcon";
import AgendaScreen from "../screens/AgendaScreen";
import ResourcesScreen from "../screens/ResourcesScreen";
import TotalsScreen from "../screens/TotalsScreen";
import ResourceDetailScreen from "../screens/ResourceDetailScreen";
import HourDetailScreen from "../screens/HourDetailScreen";
import AccountScreen from "../screens/AccountScreen";
import colors, { currentTheme } from "../config/colors";

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: currentTheme().headerBottomBg,
  },
  headerTintColor: currentTheme().title,
};
const AgendaStack = createStackNavigator();

const Agenda = () => {
  return (
    <AgendaStack.Navigator
      defaultScreenOptions={defaultScreenOptions}
      screenOptions={{
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={env.IS_IOS ? "ios-calendar" : "md-calendar"}
          />
        ),
      }}
    >
      <AgendaStack.Screen name="Agenda" component={AgendaScreen} />
      <AgendaStack.Screen name="HourDetail" component={HourDetailScreen} />
    </AgendaStack.Navigator>
  );
};

// const ResourcesStack = createStackNavigator(
//   {
//     Resources: ResourcesScreen,
//     ResourcesDetail: ResourceDetailScreen,
//   },
//   {
//     defaultNavigationOptions,
//     navigationOptions: {
//       tabBarIcon: ({ focused }) => (
//         <TabBarIcon
//           focused={focused}
//           name={env.IS_IOS ? "ios-people" : "md-people"}
//         />
//       ),
//     },
//   }
// );

// const TotalsStack = createStackNavigator(
//   {
//     Totals: TotalsScreen,
//   },
//   {
//     defaultNavigationOptions,
//     navigationOptions: {
//       tabBarIcon: ({ focused }) => (
//         <TabBarIcon
//           focused={focused}
//           name={env.IS_IOS ? "ios-calculator" : "md-calculator"}
//         />
//       ),
//     },
//   }
// );

// const AccountStack = createStackNavigator(
//   {
//     Account: AccountScreen,
//   },
//   {
//     defaultNavigationOptions,
//     navigationOptions: {
//       tabBarIcon: ({ focused }) => (
//         <TabBarIcon
//           focused={focused}
//           name={env.IS_IOS ? "ios-person" : "md-person"}
//         />
//       ),
//     },
//   }
// );
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      defaultScreenOptions={{
        headerStyle: {
          backgroundColor: currentTheme().headerBottomBg,
        },
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: currentTheme().headerBottomBg },
      }}
    >
      <Tab.Screen name="Agenda" component={Agenda} />
      {/* <Tab.Screen name="ResourcesStack" component={ResourcesStack} />
      <Tab.Screen name="TotalsStack" component={TotalsStack} />
      <Tab.Screen name="AccountStack" component={AccountStack} /> */}
    </Tab.Navigator>
  );
};
export default BottomTabNavigator;

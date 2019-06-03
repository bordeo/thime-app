import React from "react";
import env from "../config/env";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import AgendaScreen from "../screens/AgendaScreen";
import ResourcesScreen from "../screens/ResourcesScreen";
import TotalsScreen from "../screens/TotalsScreen";
import ResourceDetailScreen from "../screens/ResourceDetailScreen";
import HourDetailScreen from "../screens/HourDetailScreen";
import AccountScreen from "../screens/AccountScreen";
import colors, { currentTheme } from "../config/colors";

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: currentTheme().headerBottomBg
  },
  headerTintColor: currentTheme().title
};

const AgendaStack = createStackNavigator(
  {
    Agenda: AgendaScreen,
    HourDetail: HourDetailScreen
  },
  {
    defaultNavigationOptions,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name={env.IS_IOS ? "ios-calendar" : "md-calendar"}
        />
      )
    }
  }
);

const ResourcesStack = createStackNavigator(
  {
    Resources: ResourcesScreen,
    ResourcesDetail: ResourceDetailScreen
  },
  {
    defaultNavigationOptions,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name={env.IS_IOS ? "ios-people" : "md-people"}
        />
      )
    }
  }
);

const TotalsStack = createStackNavigator(
  {
    Totals: TotalsScreen
  },
  {
    defaultNavigationOptions,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name={env.IS_IOS ? "ios-calculator" : "md-calculator"}
        />
      )
    }
  }
);

const AccountStack = createStackNavigator(
  {
    Account: AccountScreen
  },
  {
    defaultNavigationOptions,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name={env.IS_IOS ? "ios-person" : "md-person"}
        />
      )
    }
  }
);

export default createBottomTabNavigator(
  {
    AgendaStack,
    ResourcesStack,
    TotalsStack,
    AccountStack
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: currentTheme().headerBottomBg
      }
    },
    tabBarOptions: {
      showLabel: false,
      style: {
        backgroundColor: currentTheme().headerBottomBg
      }
    }
  }
);

import React from "react";
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  FlatList
} from "react-native";
import { db } from "../services/firebase";
import { HumanResource } from "../types/HumanResource";
import normalizeObject from "../utils/normalizeObject";
import Section from "../components/Section";
import { NavigationScreenProps, NavigationEvents } from "react-navigation";
import { Ionicons } from "@expo/vector-icons";
import { FirebaseError } from "firebase";
import i18n from "../localization/i18n";
import env from "../config/env";
import colors, { currentTheme } from "../config/colors";

type NavigationProps = NavigationScreenProps<{}>;

type Props = NavigationProps;

interface State {
  humanResources: HumanResource[];
  loading: boolean;
}

export default class ResourcesScreen extends React.Component<Props> {
  static navigationOptions = (options: NavigationProps) => ({
    title: i18n.t("employees"),
    headerRight: (
      <TouchableOpacity
        style={styles.headerRight}
        hitSlop={{ right: 5, left: 5, top: 5, bottom: 5 }}
        onPress={() =>
          options.navigation.navigate("ResourcesDetail", {
            initialHr: {}
          })
        }
      >
        <Ionicons
          name={env.IS_IOS ? "ios-person-add" : "md-person-add"}
          size={24}
          color={currentTheme().topIcons}
        />
      </TouchableOpacity>
    )
  });

  state: State = {
    humanResources: [],
    loading: false
  };

  componentDidMount() {
    this.loadHumanResources();
  }

  componentWillUnmount() {
    db.offGetHumanResources();
  }

  loadHumanResources = () => {
    this.setState({ loading: true });

    db.offGetHumanResources();
    db.onGetHumanResources(
      dataSnapshot => {
        this.setState({
          humanResources:
            (dataSnapshot && normalizeObject(dataSnapshot.val())) || [],
          loading: false
        });
      },
      (err: FirebaseError) => {
        Alert.alert("Error", err.message);
      }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          refreshing={this.state.loading}
          onRefresh={this.loadHumanResources}
          style={styles.list}
          renderItem={({ item }) => this.renderListItem(item)}
          data={this.state.humanResources}
          keyExtractor={({ id }) => id}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }

  renderListItem = (hr: HumanResource) => {
    return (
      <Section.Item
        key={hr.id}
        label={`${hr.name ? hr.name : hr.id} ${hr.surname ? hr.surname : ""}`}
        value={`${hr.unitCost} € ${i18n.t("hourly")}`}
        avatar={true}
        onPress={() =>
          this.props.navigation.navigate("ResourcesDetail", {
            initialHr: hr
          })
        }
      />
    );
  };

  renderSeparator = () => {
    return <View style={styles.listSeparator} />;
  };
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%"
  },
  list: {
    width: "100%",
    height: "100%"
  },
  button: {
    padding: 40
  },
  headerRight: {
    paddingRight: 16
  },
  listSeparator: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#CED0CE"
  }
});

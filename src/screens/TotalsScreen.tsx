import React from "react";
import { StyleSheet, Text, View, SectionList } from "react-native";
import { db } from "../services/firebase";
import normalizeObject from "../utils/normalizeObject";
import { NavigationScreenProps } from "react-navigation";
import moment from "moment";
import { Day } from "../types/Day";
import Avatar from "../components/Avatar";
import colorizeWord from "../utils/colorizeWord";
import i18n from "../localization/i18n";
import colors, { currentTheme } from "../config/colors";

type NavigationProps = NavigationScreenProps;

type Props = NavigationProps;

interface State {
  loading: boolean;
  currentHourTotals: HourTotals;
  previousHourTotals: HourTotals;
  currentMonth: string;
  previousMonth: string;
  hourTotals: { order: number; title: string; data: [] }[];
  months: moment.Moment[];
}

interface HourTotal {
  id: string;
  name: string;
  surname: string;
  totalUnit: number;
  totalMoney: number;
}

interface HourTotals {
  [id: string]: HourTotal;
}

export default class TotalsScreen extends React.Component<Props> {
  static navigationOptions = {
    title: i18n.t("totals")
  };

  state: State = {
    currentHourTotals: {},
    previousHourTotals: {},
    loading: false,
    currentMonth: "",
    previousMonth: "",
    hourTotals: [],
    months: []
  };

  componentDidMount = () => {
    this.loadTotals();
  };

  componentWillUnmount() {
    this.state.months.forEach(month =>
      db.offGetDaysOfMonth(month.format("MM"), month.format("YYYY"))
    );
  }

  loadTotals = async () => {
    const months = [
      moment().subtract(3, "months"),
      moment().subtract(2, "months"),
      moment().subtract(1, "months"),
      moment()
    ];
    this.setState({
      loading: true,
      months
    });
    await Promise.all(months.map(month => this.fetchDayOfMonth(month)));
    this.setState({ loading: false });
  };

  fetchDayOfMonth = (date: moment.Moment) => {
    db.offGetDaysOfMonth(date.format("MM"), date.format("YYYY"));
    db.onGetDaysOfMonth(
      date.format("MM"),
      date.format("YYYY"),
      (dataSnapshot: firebase.database.DataSnapshot) => {
        this.onGetDaysOfMonthCallback(
          date.format("M"),
          date.format("MMMM"),
          dataSnapshot
        );
      }
    );
  };

  onGetDaysOfMonthCallback = (
    order: string,
    title: string,
    dataSnapshot: firebase.database.DataSnapshot
  ) => {
    this.setState((state: State) => {
      return {
        hourTotals: [
          ...state.hourTotals.filter(hour => hour.title !== title),
          {
            order: parseInt(order),
            title,
            data: this.calculateTotals(dataSnapshot.val())
          }
        ]
      };
    });
  };

  calculateTotals = (days: Day[]) => {
    let hourTotals: HourTotals = {};

    normalizeObject(days).forEach(day => {
      normalizeObject(day.hours).forEach(hour => {
        if (!hourTotals[hour.id]) {
          hourTotals[hour.id] = {
            id: hour.id,
            name: hour.name,
            surname: hour.surname,
            totalUnit: 0,
            totalMoney: 0
          };
        }
        hourTotals[hour.id].totalUnit += parseInt(hour.unit);
        hourTotals[hour.id].totalMoney += parseInt(hour.total);
      });
    });

    return normalizeObject(hourTotals);
  };

  render() {
    const { hourTotals } = this.state;
    return (
      <View style={styles.container}>
        <SectionList
          renderItem={({ item, index, section }) =>
            this.renderListItem(item, index)
          }
          renderSectionHeader={({ section: { data, title } }) =>
            data.length ? (
              <Text style={styles.sectionHeader}>
                {title.charAt(0).toUpperCase() + title.slice(1)}
              </Text>
            ) : null
          }
          refreshing={this.state.loading}
          onRefresh={this.loadTotals}
          style={styles.list}
          sections={hourTotals.sort((a, b) => {
            return a.order - b.order;
          })}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    );
  }

  renderListItem = (hourTotal: HourTotal, index: number) => {
    return (
      <View key={`${index}_${hourTotal.id}`} style={styles.listItem}>
        <View style={styles.listItemHeader}>
          <Avatar
            backgroundColor={colorizeWord(
              `${hourTotal.name} ${hourTotal.surname || ""}`
            )}
            color={"white"}
            size={50}
            text={`${hourTotal.name} ${hourTotal.surname || ""}`}
            single={false}
          />
          <View style={styles.listItemName}>
            <Text style={styles.name}>
              {hourTotal.name} {hourTotal.surname || ""}
            </Text>
            <Text style={styles.totals}>{`${hourTotal.totalMoney} €`}</Text>
            <Text style={styles.totals}>{`${hourTotal.totalUnit} ore`}</Text>
          </View>
        </View>
      </View>
    );
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
  listItem: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey"
  },
  listItemHeader: {
    flexDirection: "row",
    alignItems: "center"
  },
  listItemName: {
    marginLeft: 10
  },
  listItemTotals: {
    flexDirection: "row"
  },
  sectionHeader: {
    fontWeight: "bold",
    backgroundColor: currentTheme().sectionHeaderBg,
    textAlign: "center",
    padding: 10,
    fontSize: 16,
    textTransform: "capitalize",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
    color: currentTheme().sectionHeaderText
  },
  name: {
    fontSize: 18,
    fontWeight: "500"
  },
  totals: {
    color: "grey",
    fontSize: 14
  },
  headerRight: {
    paddingRight: 16
  }
});

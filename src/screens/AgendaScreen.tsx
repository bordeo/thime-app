import * as React from "react";

import { Calendar, DateObject, Marking } from "react-native-calendars";

import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  StatusBar
} from "react-native";
import { db } from "../services/firebase";
import { Day } from "../types/Day";
import { Hour } from "../types/Hour";
import Section from "../components/Section";
import { NavigationScreenProps } from "react-navigation";
import { HumanResource } from "../types/HumanResource";
import normalizeObject from "../utils/normalizeObject";
import moment from "../localization/momentWithLocales";
import { Ionicons } from "@expo/vector-icons";
import uuid from "uuid";
import { FirebaseError } from "firebase";
import SpinnerOverlay from "../components/SpinnerOverlay";
import colors, { currentTheme } from "../config/colors";
import "../localization/calendarLocales";
import i18n from "../localization/i18n";
import env from "../config/env";

type NavigationProps = NavigationScreenProps<{
  selectedDay: string | undefined;
}>;

type Props = NavigationProps;

type MarkedDates = { [date: string]: Marking };

interface State {
  selectedDay?: Day;
  markedDates?: MarkedDates;
  hrs: HumanResource[];
  loadingList: boolean;
  loadingMonth: boolean;
  hours: [];
  lastLoadedDay?: { day: string; cb: any };
  lastLoadedDaysOfMonth?: { MM: string; YYYY: string; cb: any };
}

class AgendaScreen extends React.Component<Props> {
  static navigationOptions = (options: NavigationProps) => ({
    title: i18n.t("agenda"),
    headerRight: options.navigation.getParam("selectedDay") && (
      <TouchableOpacity
        style={styles.headerRight}
        hitSlop={{ right: 5, left: 5, top: 5, bottom: 5 }}
        onPress={() =>
          options.navigation.navigate("HourDetail", {
            day: options.navigation.getParam("selectedDay")
          })
        }
      >
        <Ionicons
          name={env.IS_IOS ? "ios-add" : "md-add"}
          size={32}
          color={currentTheme().topIcons}
        />
      </TouchableOpacity>
    )
  });

  state: State = {
    selectedDay: undefined,
    markedDates: undefined,
    hrs: [],
    loadingList: false,
    loadingMonth: false,
    hours: [],
    lastLoadedDay: undefined,
    lastLoadedDaysOfMonth: undefined
  };

  componentDidMount = async () => {
    const currentDate = moment();
    const dateObject = {
      day: Number(currentDate.format("D")),
      month: Number(currentDate.format("M")),
      year: Number(currentDate.format("YYYY")),
      dateString: currentDate.format("YYYY-MM-DD"),
      timestamp: Number(currentDate.valueOf())
    };
    await this.fetchHumanResources();
    await this.handleOnMonthChange(dateObject);
    await this.handleOnDayPress(dateObject);
  };

  componentWillUnmount() {
    db.offGetHumanResources();
    if (this.state.lastLoadedDay) {
      db.offGetDay(this.state.lastLoadedDay.day);
    }
    if (this.state.lastLoadedDaysOfMonth) {
      db.offGetDaysOfMonth(
        this.state.lastLoadedDaysOfMonth.MM,
        this.state.lastLoadedDaysOfMonth.YYYY
      );
    }
  }

  handleOnDayPress = async (day: DateObject) => {
    this.loadDayHours(day.dateString);
  };

  loadDayHours = (day: string) => {
    if (this.state.lastLoadedDay) {
      db.offGetDay(this.state.lastLoadedDay.day);
    }

    db.onGetDay(day, dataSnapshot => {
      this.props.navigation.setParams({ selectedDay: day });

      this.setState((state: State) => {
        const { markedDates } = state;
        let markedDatesWithoutSelected: MarkedDates = {};
        markedDates &&
          Object.keys(markedDates).map(markedDay => {
            markedDatesWithoutSelected[markedDay] = {
              ...markedDates[markedDay],
              selected: false
            };
          });

        const dbDay = (dataSnapshot && dataSnapshot.val()) || {};

        const selectedDay = { id: day, hours: [], ...dbDay };

        const fbHours = dbDay.hours ? normalizeObject(dbDay.hours) : [];
        let hours = [...fbHours];
        let fbHoursFound = fbHours.length;

        for (let i = 0; i < 10 - fbHoursFound; i++) {
          hours = [...hours, { id: uuid.v4(), placeholder: true }];
        }

        return {
          selectedDay,
          markedDates: {
            ...markedDatesWithoutSelected,
            [day]: {
              ...markedDatesWithoutSelected[day],
              selected: true
            }
          },
          hours
        };
      });
    });

    this.setState({ lastLoadedDay: { day } });
  };

  handleOnMonthChange = async (month: DateObject) => {
    const monthMoment = moment(month.dateString);
    const { selectedDay } = this.state;
    if (selectedDay) {
      monthMoment.date(moment(selectedDay.id).date());
    }

    await this.loadMonthDays(monthMoment.format("YYYY-MM-DD"));

    if (selectedDay) {
      this.loadDayHours(monthMoment.format("YYYY-MM-DD"));
    }
  };

  loadMonthDays = async (month: string) => {
    this.setState({ loadingMonth: true });
    const monthMoment = moment(month);

    if (this.state.lastLoadedDaysOfMonth) {
      db.offGetDaysOfMonth(
        this.state.lastLoadedDaysOfMonth.MM,
        this.state.lastLoadedDaysOfMonth.YYYY
      );
    }

    db.onGetDaysOfMonth(
      monthMoment.format("MM"),
      monthMoment.format("YYYY"),
      dataSnapshot => {
        let markedDates = {};
        dataSnapshot &&
          normalizeObject(dataSnapshot.val()).map(day => {
            let selected =
              this.state.selectedDay && day.id == this.state.selectedDay.id;
            markedDates = {
              ...markedDates,
              [day.id]: {
                marked: !!day.hours,
                selected
              }
            };
          });
        this.setState({ markedDates, loadingMonth: false });
      }
    );

    this.setState({
      lastLoadedDaysOfMonth: {
        MM: monthMoment.format("MM"),
        YYYY: monthMoment.format("YYYY")
      }
    });
  };
  render() {
    const {
      selectedDay,
      markedDates,
      loadingList,
      loadingMonth,
      hours
    } = this.state;

    return (
      <View style={styles.container}>
        {env.IS_ANDROID && (
          <StatusBar
            backgroundColor={currentTheme().sectionHeaderBg}
            barStyle="dark-content"
          />
        )}
        <View style={styles.container}>
          <Calendar
            style={styles.calendar}
            onDayPress={this.handleOnDayPress}
            monthFormat={"MMMM yyyy"}
            onMonthChange={this.handleOnMonthChange}
            hideArrows={false}
            hideExtraDays={true}
            disableMonthChange={true}
            firstDay={1}
            hideDayNames={false}
            showWeekNumbers={false}
            onPressArrowLeft={substractMonth => substractMonth()}
            onPressArrowRight={addMonth => addMonth()}
            markedDates={markedDates}
            displayLoadingIndicator={loadingMonth}
            theme={{
              backgroundColor: colors.LIGHT_GRAY,
              calendarBackground: colors.WHITE,
              textSectionTitleColor: colors.HEATHER,
              selectedDayBackgroundColor: currentTheme().calendar,
              selectedDayTextColor: colors.WHITE,
              todayTextColor: currentTheme().calendar,
              dayTextColor: currentTheme().title,
              textDisabledColor: colors.MYSTIC,
              dotColor: currentTheme().calendar,
              selectedDotColor: colors.WHITE,
              arrowColor: currentTheme().calendar,
              monthTextColor: currentTheme().calendar,
              textMonthFontWeight: "bold",
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16
            }}
          />
          <View style={styles.container}>
            <FlatList
              refreshing={loadingList}
              onRefresh={() => {
                selectedDay && this.loadDayHours(selectedDay.id);
              }}
              style={styles.list}
              renderItem={({ item }) => this.renderListItem(item)}
              data={hours}
              keyExtractor={({ id }) => id}
              ItemSeparatorComponent={this.renderSeparator}
            />
          </View>
        </View>
        <SpinnerOverlay visible={loadingMonth} />
      </View>
    );
  }

  renderListItem = (hour: Hour & { placeholder: boolean }) => {
    const { selectedDay } = this.state;
    const hr = this.getHr(hour.id);
    return hour.placeholder || !selectedDay ? (
      <View key={hour.id} style={styles.listPlaceholder} />
    ) : (
      <Section.Item
        key={hr ? hr.id : hour.id}
        height={50}
        label={
          hr
            ? `${hr.name ? hr.name : hr.id} ${hr.surname ? hr.surname : ""}`
            : hour.id
        }
        value={`${hour.unit} ${hour.unit > 1 ? "ore" : "ora"} - ${
          hour.total
        } €`}
        onPress={() => {
          this.props.navigation.navigate("HourDetail", {
            day: selectedDay.id,
            selectedHrId: hr ? hr.id : hour.id,
            unit: hour.unit,
            unitCost: hour.unitCost,
            total: hour.total
          });
        }}
      />
    );
  };

  renderSeparator = () => {
    return <View style={styles.listSeparator} />;
  };

  fetchHumanResources = async () => {
    this.setState({ isFetchingHrs: true });
    db.onGetHumanResources(
      dataSnapshot => {
        //@todo capire perche' questo on funziona
        this.setState({
          hrs: (dataSnapshot && normalizeObject(dataSnapshot.val())) || [],
          isFetchingHrs: false
        });
      },
      (err: FirebaseError) => {
        Alert.alert(i18n.t("error"), err.message);
      }
    );
  };

  getHr = (hrId: string): HumanResource | undefined => {
    const { hrs } = this.state;
    return hrs.find(hr => hr.id == hrId);
  };
}

const styles = StyleSheet.create({
  calendar: {
    width: "100%",
    zIndex: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    elevation: 2
  },
  container: {
    width: "100%",
    height: "100%",
    flex: 1
  },
  contentContainer: {
    width: "100%",
    alignItems: "center"
  },
  dayContainer: {
    width: "100%",
    alignItems: "center"
  },
  headerRight: {
    paddingRight: 16
  },
  list: {
    width: "100%",
    backgroundColor: colors.WHITE
  },
  listPlaceholder: {
    minHeight: 50,
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row"
  },
  listSeparator: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#CED0CE"
  }
});

export default AgendaScreen;

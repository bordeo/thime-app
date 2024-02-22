import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInputProps,
  ScrollView,
  Alert,
  TouchableOpacity
} from "react-native";
import { db } from "../services/firebase";
import { HumanResource } from "../types/HumanResource";
import normalizeObject from "../utils/normalizeObject";
import { NavigationScreenProps } from "react-navigation";
import Section from "../components/Section";
import DialogPrompt from "../components/DialogPrompt";
import SpinnerOverlay from "../components/SpinnerOverlay";
import Button from "../components/Button";
import ModalPicker from "../components/ModalPicker";
import delay from "../utils/delay";
import showAlert from "../utils/showAlert";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../localization/i18n";
import colors from "../config/colors";

type DialogPromptField = string;

type NavigationProps = NavigationScreenProps<{
  day: string;
  selectedHrId?: string;
  unit?: number;
  unitCost?: number;
  total?: number;
  handleDelete: () => {};
}>;

type Props = NavigationProps;

interface State {
  dialogPromptParams?: {
    title: string;
    description: string;
    fieldName: DialogPromptField;
    value?: any;
    inputProps?: TextInputProps;
  };
  day: string;
  isSavingHour: boolean;
  isHrPickerVisible: boolean;
  hrs: HumanResource[];
  selectedHrId?: string;
  isFetchingHrs: boolean;
  unit: number;
  consolidatedUnitCost?: number;
  consolidatedTotal?: number;
}

export default class HourDetailScreen extends React.Component<Props> {
  static navigationOptions = (options: NavigationProps) => {
    const day = moment(options.navigation.getParam("day"));
    return {
      title: day.format("D MMMM YYYY"),
      headerRight: options.navigation.getParam("selectedHrId") && (
        <TouchableOpacity
          style={styles.headerRight}
          hitSlop={{ right: 5, left: 5, top: 5, bottom: 5 }}
          onPress={options.navigation.getParam("handleDelete")}
        >
          <Text style={styles.delete}>{i18n.t("delete")}</Text>
        </TouchableOpacity>
      )
    };
  };

  state: State = {
    dialogPromptParams: undefined,
    isSavingHour: false,
    isHrPickerVisible: false,
    hrs: [],
    selectedHrId: this.props.navigation.getParam("selectedHrId"),
    isFetchingHrs: false,
    day: this.props.navigation.getParam("day"),
    unit: this.props.navigation.getParam("unit") || 0,
    consolidatedUnitCost: this.props.navigation.getParam("unitCost"),
    consolidatedTotal: this.props.navigation.getParam("total")
  };

  componentDidMount = async () => {
    await this.fetchHumanResources();
    this.props.navigation.setParams({ handleDelete: this.deleteHour });
  };

  render() {
    const {
      dialogPromptParams,
      isSavingHour,
      isHrPickerVisible,
      selectedHrId,
      isFetchingHrs,
      hrs,
      unit,
      consolidatedUnitCost,
      consolidatedTotal
    } = this.state;
    const selectedHr = hrs.find(hr => hr.id == selectedHrId);
    return (
      <View>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.container}>
              <Section>
                <Section.Header
                  label={
                    selectedHr
                      ? `${selectedHr.name ? selectedHr.name : selectedHr.id} ${
                          selectedHr.surname ? selectedHr.surname : ""
                        }`
                      : i18n.t("employee")
                  }
                />
                <Section.Item
                  label={i18n.t("selectEmployee")}
                  value={
                    selectedHr &&
                    (selectedHr.name
                      ? `${selectedHr.name} ${
                          selectedHr.surname ? selectedHr.surname : ""
                        }`
                      : selectedHr.id)
                  }
                  loading={isFetchingHrs}
                  onPress={this.showHrPicker}
                />
                {selectedHr && (
                  <View>
                    <Section.Item
                      label={i18n.t("hourlySalary")}
                      value={`${consolidatedUnitCost || selectedHr.unitCost} €`}
                    />
                    {consolidatedUnitCost &&
                      consolidatedUnitCost != selectedHr.unitCost && (
                        <View style={styles.sectionHeaderContainer}>
                          <Text style={styles.warning}>
                            {`${i18n.t("hourlySalaryOf")} ${
                              selectedHr.name ? selectedHr.name : selectedHr.id
                            } ${i18n.t("isDifferentthatCurrent")}`}
                          </Text>
                        </View>
                      )}
                  </View>
                )}
                <Section.Header label={i18n.t("tracking")} />
                <Section.Item
                  key="unit"
                  label={i18n.t("workedHours")}
                  value={unit}
                  onPress={() =>
                    this.showDialogPrompt(
                      "unit",
                      i18n.t("workedHours"),
                      ``,
                      unit,
                      {
                        keyboardType: "decimal-pad"
                      }
                    )
                  }
                />
                <Section.Item
                  key="total"
                  label={i18n.t("total")}
                  value={`${
                    consolidatedTotal
                      ? consolidatedTotal
                      : this.calculateTotal()
                  } €`}
                />
              </Section>
            </View>
          </View>
        </ScrollView>
        <View style={styles.button}>
          <Button
            label={i18n.t("save")}
            onPress={this.saveHour}
            disabled={this.disabledSaveButton()}
            loading={isSavingHour}
          />
        </View>
        <DialogPrompt
          visible={!!dialogPromptParams}
          title={dialogPromptParams ? dialogPromptParams.title : ""}
          description={dialogPromptParams ? dialogPromptParams.description : ""}
          value={
            dialogPromptParams ? this.state[dialogPromptParams.fieldName] : ""
          }
          onConfirm={this.handleDialogPromptConfirm}
          onCancel={this.hideDialogPrompt}
          autoFocus={true}
          {...(dialogPromptParams ? dialogPromptParams.inputProps : {})}
        />
        {hrs.length > 0 && (
          <ModalPicker
            title={i18n.t("selectEmployee")}
            visible={isHrPickerVisible}
            items={hrs.map(hr => ({
              value: hr.id,
              label: `${hr.name ? hr.name : hr.id} ${
                hr.surname ? hr.surname : ""
              }`
            }))}
            onCancel={this.hideHrPicker}
            onConfirm={this.handleHrPicked}
            value={selectedHrId}
          />
        )}
        <SpinnerOverlay visible={isSavingHour} />
      </View>
    );
  }

  fetchHumanResources = async () => {
    this.setState({ isFetchingHrs: true });
    let hrs: HumanResource[] = [];
    try {
      let dataSnapshot = await db.onceGetHumanResources();
      hrs = normalizeObject(dataSnapshot.val());
    } catch (err) {
      Alert.alert(i18n.t("error"), err.message);
    }

    this.setState({ hrs, isFetchingHrs: false });
  };

  showDialogPrompt = (
    fieldName: DialogPromptField,
    title: string,
    description: string,
    value?: any,
    inputProps?: TextInputProps
  ) => {
    this.setState({
      dialogPromptParams: {
        fieldName,
        description,
        title,
        value,
        inputProps
      }
    });
  };

  hideDialogPrompt = () => {
    this.setState({ dialogPromptParams: undefined });
  };

  handleDialogPromptConfirm = (value: string) => {
    const { dialogPromptParams } = this.state;
    if (dialogPromptParams) {
      const { fieldName } = dialogPromptParams;

      if (
        dialogPromptParams.inputProps &&
        dialogPromptParams.inputProps.keyboardType === "decimal-pad"
      ) {
        value = value.replace(",", ".");
      }

      // @ts-ignore
      this.setState({
        [fieldName]: value,
        dialogPromptParams: undefined
      });
    }
  };
  disabledSaveButton = () => {
    const { isSavingHour, selectedHrId, unit, isFetchingHrs } = this.state;
    let disabled = false;

    if (!selectedHrId || unit <= 0 || isFetchingHrs || isSavingHour) {
      disabled = true;
    }

    return disabled;
  };

  saveHour = async () => {
    this.setState({ isSavingHour: true });
    const { day, unit } = this.state;
    const { navigation } = this.props;
    try {
      let dayDb = await db.onceGetDay(day);
      if ((dayDb.val() && !("id" in dayDb.val())) || !dayDb.val()) {
        await db.doCreateDay({
          id: day,
          ...(dayDb.val() ? { hours: dayDb.val().hours } : {})
        });
      }

      await db.doCreateHour(
        day,
        this.getSelectedHr(),
        unit,
        this.calculateTotal()
      );
    } catch (err) {
      Alert.alert(i18n.t("error"), err.message);
      this.setState({ isSavingHour: false });
      return;
    }
    this.setState({ isSavingHour: false }, async () => {
      await delay(200);
      await showAlert(i18n.t("savedHour"), i18n.t("savedHourSuccess"));
      navigation.navigate("Agenda");
    });
  };

  deleteHour = async () => {
    this.setState({ isSavingHour: true });

    Alert.alert(
      i18n.t("deleteHour"),
      i18n.t("deleteConfirm"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel"
        },
        {
          text: i18n.t("ok"),
          onPress: async () => {
            const { day } = this.state;
            const { navigation } = this.props;
            try {
              await db.doRemoveHour(day, this.getSelectedHr());
            } catch (err) {
              Alert.alert(i18n.t("error"), err.message);
              this.setState({ isSavingHour: false });
              return;
            }
            this.setState({ isSavingHour: false }, async () => {
              await delay(200);
              await showAlert(
                i18n.t("deletedHour"),
                i18n.t("deletedHourSuccess")
              );
              navigation.navigate("Agenda");
            });
          }
        }
      ],
      { cancelable: false }
    );
    this.setState({ isSavingHour: false });
  };

  getSelectedHr = (): HumanResource | undefined => {
    const { hrs, selectedHrId } = this.state;
    const selectedHr = hrs.find(hr => hr.id == selectedHrId);
    return selectedHr;
  };

  showHrPicker = () => {
    this.setState({ isHrPickerVisible: true });
  };

  hideHrPicker = () => {
    this.setState({ isHrPickerVisible: false });
  };

  handleHrPicked = (value: string) => {
    const { hrs, unit } = this.state;
    const selectedHr = hrs.find(hr => hr.id == value);

    if (selectedHr) {
      this.setState({
        isHrPickerVisible: false,
        selectedHrId: value,
        consolidatedUnitCost: selectedHr.unitCost
      });
    }
  };

  calculateTotal = (): number => {
    const { unit, consolidatedUnitCost, selectedHrId, hrs } = this.state;

    if (!selectedHrId || !hrs) {
      return 0;
    }

    const selectedHr = hrs.find(hr => hr.id == selectedHrId);
    const unitCost = consolidatedUnitCost
      ? consolidatedUnitCost
      : selectedHr
      ? selectedHr.unitCost
      : 0;
    if (!consolidatedUnitCost) {
    }

    return Math.ceil((unit * unitCost) / 5) * 5;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: "row"
  },
  titleTextContainer: {
    flex: 1
  },
  warning: {
    color: "orange",
    fontSize: 14
  },
  button: {
    padding: 40
  },
  headerRight: {
    paddingRight: 16
  },
  titleIconContainer: {
    marginRight: 15,
    paddingTop: 2
  },
  sectionHeaderContainer: {
    backgroundColor: "#fbfbfb",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ededed"
  },
  sectionHeaderText: {
    fontSize: 14
  },
  sectionContentContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 15
  },
  sectionContentText: {
    color: "#808080",
    fontSize: 14
  },
  nameText: {
    fontWeight: "600",
    fontSize: 18
  },
  slugText: {
    color: "#a39f9f",
    fontSize: 14,
    backgroundColor: "transparent"
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 6,
    color: "#4d4d4d"
  },
  colorContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  colorPreview: {
    width: 17,
    height: 17,
    borderRadius: 2,
    marginRight: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc"
  },
  colorTextContainer: {
    flex: 1
  },
  delete: {
    color: colors.MONZA,
    fontSize: 16
  }
});

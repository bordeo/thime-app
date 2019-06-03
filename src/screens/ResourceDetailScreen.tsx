import React from "react";
import {
  StyleSheet,
  View,
  TextInputProps,
  ScrollView,
  Alert,
  Text,
  TouchableOpacity
} from "react-native";
import { db } from "../services/firebase";
import { HumanResource } from "../types/HumanResource";
import { NavigationScreenProps } from "react-navigation";
import Section from "../components/Section";
import DialogPrompt from "../components/DialogPrompt";
import SpinnerOverlay from "../components/SpinnerOverlay";
import Button from "../components/Button";
import uuid from "uuid";
import delay from "../utils/delay";
import showAlert from "../utils/showAlert";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../localization/i18n";
import env from "../config/env";
import colors from "../config/colors";

type DialogPromptField = string;

type NavigationProps = NavigationScreenProps<{
  initialHr: HumanResource;
  handleDelete: () => void;
}>;

type Props = NavigationProps;

interface State {
  hr: HumanResource;
  dialogPromptParams?: {
    title: string;
    description: string;
    fieldName: DialogPromptField;
    value?: any;
    inputProps?: TextInputProps;
  };
  isSavingHumanResource: boolean;
}

const hrFields = [
  {
    id: "id",
    label: i18n.t("id"),
    view: false,
    required: true,
    type: "string"
  },
  {
    id: "name",
    label: i18n.t("name"),
    view: true,
    required: true,
    type: "string"
  },
  {
    id: "surname",
    label: i18n.t("surname"),
    view: true,
    required: false,
    type: "string"
  },
  {
    id: "unitCost",
    label: i18n.t("hourlySalary"),
    view: true,
    required: true,
    type: "number"
  }
];

export default class ResourceDetailScreen extends React.Component<Props> {
  static navigationOptions = (options: NavigationProps) => {
    const hr = options.navigation.getParam("initialHr");
    return {
      title: hr.name || i18n.t("newEmployee"),
      headerRight: hr.name && (
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
    hr: {
      id: uuid.v4(),
      ...this.props.navigation.getParam("initialHr")
    },
    dialogPromptParams: undefined,
    isSavingHumanResource: false
  };

  componentDidMount = () => {
    this.props.navigation.setParams({ handleDelete: this.deleteHumanResource });
  };

  render() {
    const { hr, dialogPromptParams, isSavingHumanResource } = this.state;

    return (
      <View>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.container}>
              <Section>
                <Section.Header
                  label={
                    hr.name || hr.surname
                      ? `${hr.name || ""} ${hr.surname ? hr.surname : ""}`
                      : i18n.t("fillData")
                  }
                />
                {hrFields.map(field => {
                  return (
                    field.view && (
                      <Section.Item
                        key={field.id}
                        label={field.label}
                        value={hr[field.id]}
                        onPress={() =>
                          this.showDialogPrompt(
                            field.id,
                            field.label,
                            ``,
                            hr[field.id],
                            {
                              keyboardType:
                                field.type == "number"
                                  ? "decimal-pad"
                                  : "default"
                            }
                          )
                        }
                      />
                    )
                  );
                })}
              </Section>
            </View>
          </View>
        </ScrollView>
        <View style={styles.button}>
          <Button
            label={"Salva"}
            onPress={this.saveHumanResource}
            disabled={this.disabledSaveButton()}
            loading={isSavingHumanResource}
          />
        </View>
        <DialogPrompt
          visible={!!dialogPromptParams}
          title={dialogPromptParams ? dialogPromptParams.title : ""}
          description={dialogPromptParams ? dialogPromptParams.description : ""}
          value={dialogPromptParams ? dialogPromptParams.value : ""}
          onConfirm={this.handleDialogPromptConfirm}
          onCancel={this.hideDialogPrompt}
          autoFocus={true}
          {...(dialogPromptParams ? dialogPromptParams.inputProps : {})}
        />
        <SpinnerOverlay visible={isSavingHumanResource} />
      </View>
    );
  }

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
      this.setState(function(previousState: State, currentProps) {
        return {
          hr: {
            ...previousState.hr,
            [fieldName]: value
          },
          dialogPromptParams: undefined
        };
      });
    }
  };
  disabledSaveButton = () => {
    const { isSavingHumanResource, hr } = this.state;
    let disabled = false;

    hrFields.map(field => {
      if (field.required && !hr[field.id]) {
        disabled = true;
      }
    });

    if (isSavingHumanResource) {
      disabled = true;
    }

    return disabled;
  };

  saveHumanResource = async () => {
    this.setState({ isSavingHumanResource: true });
    const { hr } = this.state;
    const { navigation } = this.props;
    try {
      await db.doCreateHumanResource(hr);
    } catch (err) {
      Alert.alert(i18n.t("error"), err.message);
      this.setState({ isSavingHumanResource: false });
      return;
    }

    this.setState({ isSavingHumanResource: false }, async () => {
      await delay(200);
      await showAlert(i18n.t("savedEmployee"), i18n.t("savedEmployeeConfirm"));
      navigation.navigate("Resources");
    });
  };

  deleteHumanResource = async () => {
    this.setState({ isSavingHour: true });

    Alert.alert(
      i18n.t("deleteEmployee"),
      i18n.t("deleteConfirm"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel"
        },
        {
          text: i18n.t("ok"),
          onPress: async () => {
            const { hr } = this.state;
            const { navigation } = this.props;
            try {
              await db.doRemoveHumanResource(hr);
            } catch (err) {
              Alert.alert(i18n.t("error"), err.message);
              this.setState({ isSavingHumanResource: false });
              return;
            }

            this.setState({ isSavingHumanResource: false }, async () => {
              await delay(200);
              await showAlert(
                i18n.t("deletedEmployee"),
                i18n.t("deletedEmployeeConfirm")
              );
              navigation.navigate("Resources");
            });
          }
        }
      ],
      { cancelable: false }
    );
    this.setState({ isSavingHour: false });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  button: {
    padding: 40
  },
  headerRight: {
    paddingRight: 16
  },
  delete: {
    color: colors.MONZA,
    fontSize: 16
  }
});

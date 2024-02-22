import { View, Text, StyleSheet } from "react-native";
import React from "react";

interface Props {
  text: string;
  size: any;
  color: any;
  backgroundColor: any;
  single: boolean;
  style?: any;
}

export default class Avatar extends React.Component<Props> {
  _getFontSize() {
    return this.props.single
      ? this.props.size / 1.7
      : (this.props.size - 5) / 2;
  }

  _getInitials() {
    let { text, single } = this.props;
    if (text !== null && typeof text === "object") {
      return text;
    } else if (text.indexOf(" ") > 0 && !single) {
      return (
        text.split(" ")[0].charAt(0) + text.split(" ")[1].charAt(0)
      ).toUpperCase();
    } else {
      return text.charAt(0).toUpperCase();
    }
  }

  render() {
    return (
      <View style={{ backgroundColor: "transparent" }}>
        <View
          style={[
            styles.icon,
            {
              backgroundColor: this.props.backgroundColor,
              height: this.props.size,
              width: this.props.size,
              borderRadius: this.props.size / 2
            },
            this.props.style
          ]}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.text,
              {
                fontSize: this._getFontSize(),
                color: this.props.color,
                backgroundColor: "transparent"
              }
            ]}
          >
            {this._getInitials()}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.0,

    elevation: 1
  },
  text: {
    color: "#fff"
  }
});

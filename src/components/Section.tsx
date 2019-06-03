import * as React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import Avatar from "./Avatar";
import colorizeWord from "../utils/colorizeWord";

interface SectionProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default class Section extends React.PureComponent<SectionProps> {
  static Header: any;
  static Separator: any;
  static Item: any;

  render() {
    const { children, style } = this.props;
    return <View style={[sectionStyles.root, style]}>{children}</View>;
  }
}

const sectionStyles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#EBEAEC"
  }
});

interface ItemProps {
  label?: string;
  value: string;
  borderless?: boolean;
  iconName?: string;
  imageSource?: any;
  height?: number;
  disabled?: boolean;
  backgroundColor?: string;
  onPress?: () => any;
  loading?: boolean;
  icon?: string;
  avatar?: boolean;
}

Section.Item = class extends React.PureComponent<ItemProps> {
  render() {
    const {
      label,
      value,
      borderless,
      iconName,
      imageSource,
      onPress,
      disabled,
      height,
      loading,
      icon,
      avatar
    } = this.props;
    return (
      <TouchableOpacity
        style={[
          itemStyles.root,
          height ? { height: height } : undefined,
          avatar && itemStyles.rootWithAvatar
        ]}
        disabled={disabled || !onPress}
        onPress={onPress}
      >
        {(iconName || imageSource || (avatar && label)) && (
          <View style={itemStyles.iconAndImage}>
            {iconName && (
              <View style={itemStyles.icon}>
                <Ionicons name={iconName} size={28} color={"grey"} />
              </View>
            )}
            {imageSource && (
              <Image source={imageSource} style={itemStyles.image} />
            )}
            {avatar && label && (
              <Avatar
                backgroundColor={colorizeWord(label)}
                color={"white"}
                size={50}
                text={label}
                single={false}
              />
            )}
          </View>
        )}
        <View
          style={[
            itemStyles.labelAndValue,
            (borderless || avatar) && { borderBottomWidth: 0 }
          ]}
        >
          <View style={itemStyles.label}>
            {label && (
              <Text
                style={[itemStyles.labelText, avatar && { fontWeight: "500" }]}
                numberOfLines={2}
              >
                {label}
              </Text>
            )}
          </View>
          <View style={itemStyles.value}>
            {(typeof value === "string" || typeof value === "number") && (
              <Text style={itemStyles.valueText}>{value}</Text>
            )}
            {!loading && onPress && (
              <Ionicons
                name={icon}
                style={itemStyles.chevron}
                size={22}
                color="#97979C"
              />
            )}
            {loading && (
              <ActivityIndicator size="small" color={colors.BOTTLE_GREEN} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

Section.Item.defaultProps = { icon: "ios-arrow-forward" };

const itemStyles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    flexDirection: "row"
  },
  rootWithAvatar: {
    paddingVertical: 10,
    paddingLeft: 10
  },
  iconAndImage: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10
  },
  image: {
    width: 28,
    height: 28,
    tintColor: "white"
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28
  },
  labelAndValue: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
    minHeight: 42,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EBEAEC"
  },
  label: {
    justifyContent: "center",
    flexDirection: "column",
    flexWrap: "wrap",
    flexShrink: 1
  },
  labelText: {
    fontSize: 16,
    color: "black",
    flexWrap: "wrap",
    flexShrink: 1
  },
  value: {
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 10
  },
  chevron: {
    paddingLeft: 10,
    marginBottom: -3
  },
  valueText: {
    color: "#97979C",
    fontSize: 16,
    paddingLeft: 20
  },
  labelTextWithAvatar: {
    fontWeight: "500"
  }
});

interface SeparatorProps {
  fullwidth?: boolean;
}
Section.Separator = class extends React.PureComponent<SeparatorProps> {
  render() {
    const { fullwidth } = this.props;
    return (
      <View style={separatorStyles.root}>
        <View
          style={[separatorStyles.border, { marginLeft: fullwidth ? 0 : 20 }]}
        />
      </View>
    );
  }
};

const separatorStyles = StyleSheet.create({
  root: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "white"
  },
  border: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#EBEAEC",
    marginLeft: 20
  }
});

type HeaderProps = {
  label?: string;
  small?: boolean;
};
Section.Header = class extends React.PureComponent<HeaderProps, void> {
  static HEIGHT_SMALL = 32;
  static HEIGHT_STANDARD = 55;

  render() {
    const { label, small } = this.props;
    const height = small
      ? Section.Header.HEIGHT_SMALL
      : Section.Header.HEIGHT_STANDARD;
    return (
      <View style={[headerStyles.root, { height }]}>
        {label && <Text style={headerStyles.label}>{label.toUpperCase()}</Text>}
      </View>
    );
  }
};

const headerStyles = StyleSheet.create({
  root: {
    backgroundColor: "#EEEEF3",
    paddingHorizontal: 20,
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  label: {
    paddingBottom: 7,
    fontSize: 14,
    color: "#6D6D72"
  }
});

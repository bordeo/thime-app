const colors = {
  SILVER: "#CCCCCC",
  tabBar: "#fefefe",
  headerBg: "#0082A0",
  GRAY_CHATEAY: "#999999",
  OSLO_GRAY: "#444",
  BLACK: "#000",
  WHITE: "#FFF",
  WOODSMOKE: "#141619",
  RIPE_LEMON: "#efef18",
  DODGER_BLUE: "#428AF8",
  RIO_GRANDE: "#CACA0C",
  TORCH_RED: "#F8262F",
  MISCHKA: "#E5E4E6",
  LIGHT_GRAY: "#D3D3D3",
  MONZA: "#D8000C",
  HINT_OF_RED: "#F8F6F7",
  BOTTLE_GREEN: "#0C3D33",
  AQUA_SPRING: "#EDF9F6",
  SEA_GREEN: "#288642",
  CYAN: "#27FDFD",
  HEATHER: "#b6c1cd",
  MYSTIC: "#d9e1e8",
  MOUNTAIN_MEADOW: "#11BA8F"
};

const green = {
  name: "green",
  title: colors.BOTTLE_GREEN,
  headerBottomBg: colors.HINT_OF_RED,
  mainBg: colors.WHITE,
  buttonBg: colors.MOUNTAIN_MEADOW,
  buttonText: colors.WHITE,
  calendar: colors.MOUNTAIN_MEADOW,
  navIconsDefault: colors.SILVER,
  navIcons: colors.MOUNTAIN_MEADOW,
  topIcons: colors.MOUNTAIN_MEADOW,
  spinner: colors.MOUNTAIN_MEADOW,
  sectionHeaderBg: colors.HINT_OF_RED,
  sectionHeaderText: colors.BOTTLE_GREEN
};

const yellow = {
  name: "yellow",
  title: colors.WOODSMOKE,
  headerBottomBg: colors.RIPE_LEMON,
  mainBg: colors.WHITE,
  buttonBg: colors.RIPE_LEMON,
  buttonText: colors.WOODSMOKE,
  calendar: colors.RIO_GRANDE,
  navIconsDefault: colors.RIO_GRANDE,
  navIcons: colors.WOODSMOKE,
  topIcons: colors.WOODSMOKE,
  spinner: colors.WOODSMOKE,
  sectionHeaderBg: colors.RIPE_LEMON,
  sectionHeaderText: colors.WOODSMOKE
};

const themes: {
  [themeName: string]: {
    name: string;
    title: string;
    mainBg: string;
    headerBottomBg: string;
    buttonBg: string;
    buttonText: string;
    calendar: string;
    navIconsDefault: string;
    navIcons: string;
    topIcons: string;
    spinner: string;
    sectionHeaderBg: string;
    sectionHeaderText: string;
  };
} = {
  green,
  yellow
};

let _currentTheme: Theme = "green";

function setCurrentTheme(theme: Theme) {
  _currentTheme = theme;
}

function currentTheme() {
  return themes[_currentTheme];
}

export default colors;

export { currentTheme, setCurrentTheme, green, yellow };
export type Theme = "green" | "yellow";

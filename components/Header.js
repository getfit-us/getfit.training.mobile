import { AppBar } from "react-native-paper";

const Header = () => {
  return (
    <AppBar.Header>
      <AppBar.Content title="GETFIT Personal Training" />
      <Appbar.BackAction onPress={() => {}} />

      <Appbar.Action icon="calendar" onPress={() => {}} />
      <Appbar.Action icon="magnify" onPress={() => {}} />
    </AppBar.Header>
  );
};

export default Header;

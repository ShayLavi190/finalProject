import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";

const EntertainmentPage = ({ navigation, handleGlobalClick }) => {
  const buttons = [
    { label: "Newspapers", route: "Newspaper" },
    { label: "News Channels", route: "NewsChannels" },
    { label: "Games", route: "Games" },
    {
      label: "Dialogue",
      action: () => {
        handleGlobalClick("Dialogue");
        Toast.show({
          type: "info",
          text1: "Dialogue",
          text2: "You are being redirected to the dialogue page.",
          visibilityTime: 4000,
          position: "top",
          textStyle: { fontSize: 18 },
        });
      },
    },
  ];

  const handleButtonPress = (button) => {
    if (button.route) {
      navigation.navigate(button.route);
    } else if (button.action) {
      button.action();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Entertainment</Text>
      </View>
      <View style={styles.buttonRowContainer}>
        {buttons.map((button, index) => (
          <View key={index} style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress(button)}
            >
              <Text style={styles.buttonText}>{button.label}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 130,
    marginTop: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonWrapper: {
    width: "48%",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 30,
    backgroundColor: "#5d9592", 
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default EntertainmentPage;

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";

const HealthFundPage = ({ navigation, handleGlobalClick }) => {
  const buttons = [
    {
      label: "קביעת תור",
      route: "Reservation",
      action: () => {
        handleGlobalClick();
        navigation.navigate("Reservation");
      },
    },
    {
      label: "תשובות בדיקות",
      route: "TestResults",
      action: () => {
        handleGlobalClick();
        navigation.navigate("TestResults");
      },
    },
    {
      label: "הזמנת תרופות קבועות",
      action: () => {
        handleGlobalClick?.("הזמנת תרופות קבועות");
        Toast.show({
          type: "info",
          text1: "💊 הזמנת תרופות",
          text2: "התרופות הוזמנו בהצלחה!",
          visibilityTime: 4000,
          position: "right",
          textStyle: { fontSize: 18 },
          style: { width: "90%", backgroundColor: "#3498db", borderRadius: 10 },
        });
      },
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>קופת חולים</Text>
      </View>
      <View style={styles.buttonRowContainer}>
        {buttons.map((button) => (
          <View key={button.label} style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={button.action}
              accessible={true}
              accessibilityLabel={`לחץ עבור ${button.label}`}
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
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HealthFundPage;

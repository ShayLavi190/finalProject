import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";

const EmergencyPage = ({ navigation, handleGlobalClick }) => {
  const emergencyActions = [
    { label: "Call Police Department", message: "Calling the police" },
    { label: "Call Fire Department", message: "Calling Fire Department" },
    { label: "Call Ambulance", message: "Calling Ambulance" },
    { label: "Contact Person", message: "Calling Person" }
  ];

  const handleEmergencyCall = (message) => {
    handleGlobalClick();
    Toast.show({
      type: "info",
      text1: "Emergency Call",
      text2: message,
      visibilityTime: 5000,
      position: "top",
      textStyle: { fontSize: 18 },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Emergency</Text>
      </View>
      <View style={styles.buttonRowContainer}>
        {emergencyActions.map((button, index) => (
          <View key={index} style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleEmergencyCall(button.message)}
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
  },
});

export default EmergencyPage;

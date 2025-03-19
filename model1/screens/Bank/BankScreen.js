import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";

const BankPage = ({ navigation, handleGlobalClick }) => {
  const buttons = [
    {
      label: "ביצוע העברה",
      route: "Transfer",
    },
    {
      label: "כתוב לבנקאי",
      route: "ContactBanker",
    },
    {
      label: "מצב חשבון",
      action: () => {
        Toast.show({
          type: "info",
          text1: "מצב חשבון",
          text2: "הצגת מצב חשבון...",
          visibilityTime: 4000,
          position: "right",
          textStyle: { fontSize: 18, textAlign: "right" },
          style: { width: "90%", backgroundColor: "#3498db", borderRadius: 10 },
        });
        handleGlobalClick("מצב חשבון");
      },
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>בנק</Text>
      </View>
      <View style={styles.buttonRowContainer}>
        {buttons.map((button, index) => (
          <View key={button.label} style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (button.route) {
                  navigation.navigate(button.route);
                  Toast.show({
                    type: "success",
                    text1: "🔄 ניווט",
                    text2: `מעבר ל-${button.label}...`,
                    visibilityTime: 3000,
                    position: "right",
                    textStyle: { fontSize: 18, textAlign: "right" },
                    style: {
                      width: "90%",
                      backgroundColor: "#2ecc71",
                      borderRadius: 10,
                    },
                  });
                } else if (button.action) {
                  button.action();
                }
              }}
            >
              <Text style={styles.buttonText}>{button.label}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Toast Component */}
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

export default BankPage;

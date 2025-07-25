import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";

const SuperMarketPage = ({ navigation, handleGlobalClick }) => {
  const buttons = [
    {
      label: "Edit Cart",
      route: "EditCart",
      action: () => {
        handleGlobalClick("עריכת סל קיים");
        navigation.navigate("EditCart");
      },
    },
    {
      label: "Order Fixed Cart",
      action: () => {
        handleGlobalClick("הזמנת סל קיים");
        Toast.show({
          type: "success",
          text1: "Cart Ordered Successfully",
          text2: "The cart has been ordered. A confirmation will be sent to your email and phone number.",
          visibilityTime: 4000,
          position: "top",
          textStyle: { fontSize: 18 },
        });
      },
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>SuperMarket</Text>
        </View>
        <View style={styles.buttonRowContainer}>
          {buttons.map((button, index) => (
            <View key={button.label} style={styles.buttonWrapper}>
              <TouchableOpacity
                style={styles.button}
                onPress={button.route ? button.action : button.action}
              >
                <Text style={styles.buttonText}>{button.label}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      {/* 🔹 Toast Notification */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
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

export default SuperMarketPage;

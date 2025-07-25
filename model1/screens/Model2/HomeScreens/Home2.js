import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useUser } from "../userContext";
import * as Animatable from "react-native-animatable";

const Home2 = ({ navigation }) => {
  const { user } = useUser();
  const animatableRef = useRef(null);

  const buttons = [
    { label: "Entertainment", route: "EntertainmentM2", backgroundColor: "#a39193" },
    { label: 'Update Personal Details', route: "SetUp", backgroundColor: "#8db1fa" },
    { label: 'Privacy Permissions', route: "Premissions1", backgroundColor: "#35223c" },
    { label: "Performance", route: "PerformanceM2", backgroundColor: "#9dbda4" },
  ];

  const handleNavigate = (route) => {
    animatableRef.current
      .animate("fadeOutRight", 500)
      .then(() => navigation.navigate(route));
  };

  return (
    <Animatable.View ref={animatableRef} style={{ flex: 1 }} animation="fadeInDown" duration={2000} >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.subtitle}>Welcome to the home page. Select the service you want to use. Each button will take you to services on the same topic. If you received a message that the above service cannot be performed, you probably need to fill in certain personal information or activate certain permissions. Correcting the details will appear in the error message.</Text>        </View>
        <View style={styles.buttonRowContainer}>
          {buttons.map((button) => (
            <View key={button.label} style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: button.backgroundColor }]}
                onPress={() => handleNavigate(button.route)}
              >
                <Text style={styles.buttonText}>{button.label}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.forwardButton} onPress={() => handleNavigate("Home1")}>
          <Text style={styles.forwardButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
    marginTop:50,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 50,
    marginTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  buttonRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
  },
  buttonWrapper: {
    width: "48%",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginBottom: 50,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  forwardButton: {
    marginTop: 30,
    backgroundColor: "orange",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 300,
    marginTop: 50,
  },
  forwardButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#555",
    textAlign: "center",
    marginTop:20,
    fontWeight:'bold'
  }
});

export default Home2;

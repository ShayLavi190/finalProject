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

const Home1 = ({ navigation }) => {
  const { user } = useUser();
  const animatableRef = useRef(null);

  const buttons = [
    { label: "Bank", route: "Bankm2", backgroundColor: "#0f473a" },
    { label: "Health Fund", route: "Health", backgroundColor: "#4ebcff" },
    { label: "Supermarket", route: "Supermarket", backgroundColor: "#eab676" },
    { label: "Emergency", route: "EmergencyM2", backgroundColor: "red" },
  ];

  const handleNavigate = (route) => {
    animatableRef.current
      .animate("fadeOutLeft", 500)
      .then(() => navigation.navigate(route));
  };

  return (
    <Animatable.View ref={animatableRef} style={{ flex: 1 }} animation="fadeInDown" duration={2000} >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
        <Text style={styles.title}> Welcome {user.name} !</Text>
        <Text style={styles.subtitle}>Welcome to the home page. Select the service you want to use. Each button will take you to services on the same topic. If you received a message that the above service cannot be performed, you probably need to fill in certain personal information or activate certain permissions. Correcting the details will appear in the error message.</Text>
        </View>
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
        <TouchableOpacity style={styles.forwardButton} onPress={() => handleNavigate("Home2")}>
          <Text style={styles.forwardButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:50,
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
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
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 300,
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
    marginTop:50,
    fontWeight:'bold'
  }
});

export default Home1;

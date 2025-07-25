import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Modal,
  TouchableOpacity,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import * as Animatable from "react-native-animatable";
import { useUser } from "../userContext";

const Permissions1 = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const [publicServices, setPublicServices] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState(false);
  const [shareHealthInfo, setShareHealthInfo] = useState(false);
  const [healthMonitoring, setHealthMonitoring] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  const modalRef = useRef(null);
  const animatableRef = useRef(null);

  useEffect(() => {
    setPublicServices(user.permissions.publicServices);
    setEmergencyContacts(user.permissions.emergencyContacts);
    setShareHealthInfo(user.permissions.shareHealthInfo);
    setHealthMonitoring(user.permissions.healthMonitoring);
  }, [user]);

  const handleIconPress = (field) => {
    const fieldExplanations = {
      publicServices:
        "Without this permission, we won't be able to use your provided information for public services such as banks, healthcare providers, and supermarkets.",
      emergencyContacts:
        "Without this permission, we won't be able to contact your emergency contact in case of need.",
      shareHealthInfo:
        "Without this permission, we can't use your medical information for healthcare-related services, and you won't be able to use this service at all.",
      healthMonitoring:
        "Without this permission, we cannot monitor your medical condition using devices such as a smartwatch.",
    };
    setExplanation(fieldExplanations[field]);
    setIconAnimation("pulse");
    setModalVisible(true);
    handleGlobalClick();
  };

  const handleMoveForward = () => {
    animatableRef.current.animate("fadeOutLeft", 500).then(() => {
      updateUser({
        ...user,
        permissions: {
          ...user.permissions,
          publicServices,
          emergencyContacts,
          shareHealthInfo,
          healthMonitoring,
        },
      });
      navigation.navigate("Permissions2");
    });
  };

  const closeModal = () => {
    modalRef.current.animate("fadeOutDown", 500).then(() => setModalVisible(false));
    setIconAnimation("");
    handleGlobalClick();
  };

  return (
    <Animatable.View animation="fadeInDown" duration={2000} style={{ flex: 1 }} ref={animatableRef}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Set Permissions for Public and Health Services</Text>
          <Text style={styles.subtitle}>
            In order for the caregiving robot to provide its services for your benefit, we need your
            consent for certain actions. All information is securely stored and not shared with any
            external party unless for specific services.
          </Text>

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("publicServices")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={publicServices ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setPublicServices((prev) => !prev)}
              value={publicServices}
            />
            <Text style={styles.input}>Use of Public Services</Text>
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("healthMonitoring")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={healthMonitoring ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setHealthMonitoring((prev) => !prev)}
              value={healthMonitoring}
            />
            <Text style={styles.input}>Health Monitoring</Text>
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("emergencyContacts")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={emergencyContacts ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setEmergencyContacts((prev) => !prev)}
              value={emergencyContacts}
            />
            <Text style={styles.input}>Access to Emergency Contact</Text>
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("shareHealthInfo")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={shareHealthInfo ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setShareHealthInfo((prev) => !prev)}
              value={shareHealthInfo}
            />
            <Text style={styles.input}>Share Health Information</Text>
          </View>

          <TouchableOpacity style={[{ backgroundColor: "green" }, styles.button]} onPress={handleMoveForward}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} transparent animationType="none">
          <View style={styles.modalContainer}>
            <Animatable.View ref={modalRef} animation="fadeInUp" duration={500} style={styles.modalContent}>
              <Text style={styles.fontex}>{explanation}</Text>
              <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 90,
  },
  card: {
    width: "90%",
    maxWidth: 800,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: 600,
  },
  input: {
    flex: 1,
    textAlign: "right",
    marginRight: 20,
    padding: 10,
    fontSize: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 60,
    shadowColor: "yellow",
    shadowRadius: 3,
    shadowOpacity: 1,
    marginLeft: 70,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  modalContent: {
    backgroundColor: "whitesmoke",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "black",
  },
  fontex: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
});

export default Permissions1;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useUser } from "../userContext";
import Toast from "react-native-toast-message";

const SetUp = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [idr, setIdr] = useState("");
  const [phone, setPhone] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  const modalRef = useRef(null);
  const animatableRef = useRef(null);

  useEffect(() => {
    setName(user.name);
    setIdr(user.idr);
    setId(user.id);
    setPhone(user.phone);
  }, [user]);

  const handleIconPress = (field) => {
    const fieldExplanations = {
      name: "Please enter your full name as it appears on your ID. This field is required.",
      idr: "Please enter your national ID number (9 digits). This field is required.",
      id: "Please enter your participant ID. This field is required.",
      phone: "Please enter your phone number (10 digits). This field is required.",
    };
    setExplanation(fieldExplanations[field]);
    setIconAnimation("pulse");
    setModalVisible(true);
    handleGlobalClick();
  };

  const validateInputs = () => {
    const errors = [];

    if (!id) errors.push("Participant ID is required.");
    if (!name) errors.push("Full name is required.");

    if (!idr) {
      errors.push("National ID is required.");
    } else if (idr.length !== 9) {
      errors.push("National ID must be exactly 9 digits.");
    }

    if (!phone) {
      errors.push("Phone number is required.");
    } else if (phone.length !== 10) {
      errors.push("Phone number must be exactly 10 digits.");
    }

    if (errors.length > 0) {
      Toast.hide();
      Toast.show({
        type: "error",
        text1: "Form Error",
        text2: errors.join(" | "),
        visibilityTime: 4000,
        position: "top",
        textStyle: { fontSize: 18, textAlign: "left" },
        style: { width: "90%", backgroundColor: "#ff4d4d", borderRadius: 10, alignSelf: "flex-start" },
      });

      return false;
    }

    return true;
  };

  const handleMoveForward = () => {
    if (!validateInputs()) return;
    animatableRef.current.animate("fadeOutLeft", 500).then(() => {
      updateUser({
        ...user,
        name: name,
        phone: phone,
        idr: idr,
        id: id,
      });
      navigation.navigate("SetUp2");
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
        <Toast />
        <View style={styles.card}>
          <Text style={styles.title}>Personal Information Setup</Text>
          <Text style={styles.subtitle}>
            To allow the caregiving robot to provide its services, we need your personal information.
            All information is securely stored and never shared with third parties unless required for a specific service.
          </Text>

          {/* Participant ID */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("id")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Participant ID"
              value={id}
              onChangeText={(text) => /^\d*$/.test(text) && setId(text)}
              keyboardType="numeric"
              onPress={() => handleGlobalClick()}
            />
          </View>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("name")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              onPress={() => handleGlobalClick()}
            />
          </View>

          {/* National ID */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("idr")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="National ID"
              value={idr}
              onChangeText={(text) => /^\d*$/.test(text) && setIdr(text)}
              keyboardType="numeric"
              onPress={() => handleGlobalClick()}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("phone")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={(text) => /^\d*$/.test(text) && setPhone(text)}
              keyboardType="numeric"
              onPress={() => handleGlobalClick()}
            />
          </View>

          {/* Next Button */}
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
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    padding: 10,
    fontSize: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    shadowColor: "yellow",
    shadowRadius: 3,
    shadowOpacity: 1,
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

export default SetUp;

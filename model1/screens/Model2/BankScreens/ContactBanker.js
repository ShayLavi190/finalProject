import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import * as Animatable from "react-native-animatable";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";

const ContactBankerM2 = ({ navigation, handleGlobalClick }) => {
  const [selectedAction, setSelectedAction] = useState("");
  const [info, setInfo] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Request for more information', value: 'Request for more information' },
    { label: 'Complaint', value: 'Complaint' },
    { label: 'Customer service', value: 'Customer service' },
    { label: 'Action', value: 'Action' },
    { label: 'Enlarge frame', value: 'Enlarge frame' },
    { label: 'Loan', value: 'Loan' },
    { label: 'Other', value: 'Other' },
  ]);
  const animatableRef = useRef(null);
  const modalRef = useRef(null);

  const handleIconPress = (field) => {
    const fieldExplanations = {
      action: "Please select an action you want to perform from the list.",
      info: "Please enter a description of the request to your banker.",
    };
    setExplanation(fieldExplanations[field]);
    setIconAnimation("pulse");
    setModalVisible(true);
    handleGlobalClick();
  };

  const handleNavigate = (route, direction) => {
    if (direction === "forward") {
      animatableRef.current
        .animate("fadeOutLeft", 500)
        .then(() => navigation.navigate(route));
    } else if (direction === "back") {
      animatableRef.current
        .animate("fadeOutRight", 500)
        .then(() => navigation.navigate(route));
    }
  };

  const handelSend = () => {
    handleGlobalClick();
    if (info !== "" && selectedAction !== "") {
      // First, hide any currently showing Toast
      Toast.hide();
      
      // Use setTimeout to ensure the Toast appears after UI updates
      setTimeout(() => {
        Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'success',
        text2: 'Request successfully transferred to banker',
        visibilityTime: 4000,
        });
        }, 100);
      
      setInfo("");
      setSelectedAction("");
    } else {
      // First, hide any currently showing Toast
      Toast.hide();
      
      // Use setTimeout to ensure the Toast appears after UI updates
      setTimeout(() => {
        Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error',
        text2: 'Not all fields are filled in. Fill in all fields',
        visibilityTime: 4000,
        });
        }, 100);
    }
  };

  const closeModal = () => {
    modalRef.current
      .animate("fadeOutDown", 500)
      .then(() => setModalVisible(false));
    setIconAnimation("");
    handleGlobalClick();
  };

  return (
    <Animatable.View
      ref={animatableRef}
      animation="fadeInDown"
      duration={2000}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.card, open ? { zIndex: 100 } : {}]}>
        <Text style={styles.title}>Write to the banker</Text>
        <Text style={styles.subtitle}>
        The information is stored securely. Fill in all the details to make a transfer.
        </Text>

          {/* Bank Picker - Updated to match Transaction component */}
          <View style={[styles.inputContainer, { zIndex: 3000 }]}>
            <TouchableOpacity onPress={() => handleIconPress("action")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <DropDownPicker
              open={open}
              value={selectedAction}
              items={items}
              setOpen={(value) => {
                setOpen(value);
                handleGlobalClick();
              }}
              setValue={setSelectedAction}
              setItems={setItems}
              placeholder="Select an action..."
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropDownDirection="BOTTOM"
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          {/* Description Input */}
          <View style={[styles.inputContainer, { zIndex: open ? 1 : 10 }]}>
            <TouchableOpacity onPress={() => handleIconPress("info")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={[styles.input, {height:200}]}
              placeholder="Description"
              value={info}
              onPress={handleGlobalClick}
              onChangeText={(text) => {setInfo(text);handleGlobalClick();}}
              multiline={true}
              textAlignVertical="top"
            />
          </View>
          
          <View style={[
            { alignItems: "center", marginBottom: 20, marginTop: 10, zIndex: open ? 1 : 10 }
          ]}>
            <TouchableOpacity
              style={[styles.button, styles.sendBtn]}
              onPress={handelSend}
            >
            <Text style={styles.buttonText}>Send request</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={[styles.buttonRow, { zIndex: open ? 1 : 10 }]}>
            <TouchableOpacity
              style={[styles.button, styles.forwardBtn]}
              onPress={() => handleNavigate("Bankm2", "forward")}
            >
            <Text style={styles.buttonText}>Banking operations</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.backBtn]}
              onPress={() => handleNavigate("Home1", "back")}
            >
              <Text style={styles.buttonText}>Home screen</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal visible={modalVisible} transparent animationType="none">
          <View style={styles.modalContainer}>
            <Animatable.View
              ref={modalRef}
              animation="fadeInUp"
              duration={1000}
              style={styles.modalContent}
            >
              <Text style={styles.fontex}>{explanation}</Text>
              <TouchableOpacity style={[styles.button, styles.closeBtn]} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Modal>
        
        {/* Toast component positioned at the end of KeyboardAvoidingView */}
        <Toast />
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
    position: "relative",
    zIndex: 1,
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
    marginBottom: 140,
    position: "relative",
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
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
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
  },
  forwardBtn: {
    backgroundColor: 'green'
  },
  backBtn: {
    backgroundColor: 'orange'
  },
  closeBtn: {
    backgroundColor: 'red'
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "whitesmoke",
    borderEndColor: 'black',
    borderBottomEndRadius: 2,
  },
  fontex: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    color: 'black'
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  // Updated dropdown styles to match Transaction component
  dropdown: {
    flex: 1,
    borderColor: "#ccc",
    height: 30,
    width: "92%",
  },
  dropdownText: {
    textAlign: "center",
    fontSize: 16,
  },
  sendBtn: {
    backgroundColor: '#52bfbf',
    width: "60%",
  }
});

export default ContactBankerM2;
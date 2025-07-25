import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  LogBox
} from "react-native";

// Ignore specific warnings related to DropDownPicker
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
import { Entypo } from '@expo/vector-icons';
import * as Animatable from "react-native-animatable";
import DropDownPicker from "react-native-dropdown-picker";
import { useUser } from "../../Model2/userContext";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import robotAnimation from "./robot.json";

const AUDIO_URL = "https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/setup3.mp3";

const SetUp33 = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();

  const [selectedBank, setSelectedBank] = useState(user.selectedBank || "");
  const [bankAccountNumber, setBankAccountNumber] = useState(user.bankAccountNumber || "");
  const [bankBranchNumber, setBankBranchNumber] = useState(user.bankBranchNumber || "");

  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [openPicker, setOpenPicker] = useState(false);
  const [iconAnimation, setIconAnimation] = useState("");

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const animatableRef = useRef(null);
  const modalRef = useRef(null);

  const [items, setItems] = useState([
    { label: "Bank Leumi", value: "10" },
    { label: "Bank Hapoalim", value: "12" },
    { label: "Israel Discount Bank", value: "11" },
    { label: "Yahav Bank", value: "4" },
    { label: "Postal Bank", value: "9" },
    { label: "Igud Bank", value: "13" },
    { label: "Otsar HaChayal Bank", value: "14" },
    { label: "Mercantile Bank", value: "17" },
    { label: "Citibank N.A", value: "22" },
    { label: "Mizrahi Tefahot Bank", value: "20" },
    { label: "HSBC Bank plc", value: "23" },
    { label: "U.Bank Ltd.", value: "26" },
    { label: "Barclays Bank PLC", value: "27" },
    { label: "Bank for Trade Ltd.", value: "30" },
    { label: "First International Bank of Israel", value: "31" },
    { label: "SBI State Bank of India", value: "39" },
    { label: "Masad Bank", value: "46" },
    { label: "Banking Clearing Center", value: "50" },
    { label: "Poalei Agudat Israel Bank", value: "52" },
    { label: "Hessed Savings Fund for Education", value: "65" },
    { label: "Bank of Israel", value: "99" },
  ]);

  const explanations = {
    bank: "Please select your bank from the list.",
    account: "Please enter your account number.",
    branch: "Please enter your bank branch number.",
  };

  const stopAudio = useCallback(async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  }, [sound]);

  const handleAudioPlayback = useCallback(async () => {
    handleGlobalClick();
    if (sound && isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: AUDIO_URL }, { shouldPlay: true });
      setSound(newSound);
      setIsPlaying(true);
    }
  }, [sound, isPlaying]);

  const handleExplanationModal = (field) => {
    stopAudio();
    setExplanation(explanations[field]);
    setIconAnimation("pulse");
    setModalVisible(true);
    handleGlobalClick();
  };

  const closeModal = () => {
    modalRef.current.animate("fadeOutDown", 500).then(() => {
      setModalVisible(false);
      setIconAnimation("");
    });
    handleGlobalClick();
  };

  const handleMoveForward = () => {
    stopAudio();
    animatableRef.current.animate("fadeOutLeft", 500).then(() => {
      updateUser({
        ...user,
        selectedBank,
        bankAccountNumber,
        bankBranchNumber,
      });
      navigation.navigate("HomeSetUp");
    });
  };

  const handleGoBack = () => {
    stopAudio();
    animatableRef.current.animate("fadeOutRight", 500).then(() => {
      updateUser({
        ...user,
        selectedBank,
        bankAccountNumber,
        bankBranchNumber,
      });
      navigation.navigate("SetUp23");
    });
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

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
        <View style={styles.card}>
        <Text style={styles.title}>Setting up bank account details</Text>
        <Text style={styles.subtitle}>
          In order for the robot to operate its services for you, we will need your bank
          details. You can choose not to enter your account details, but you will not be able to use the bank
          services. The information is stored securely.
        </Text>     
          {/* Bank Picker with Bulb Icon */}
          <View style={[styles.inputContainer, { zIndex: 9999 }]}>
            <TouchableOpacity onPress={() => handleExplanationModal("bank")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <View style={{ flex: 1, zIndex: 9999 }}>
              <DropDownPicker
                open={openPicker}
                value={selectedBank}
                items={items}
                setOpen={setOpenPicker}
                setValue={setSelectedBank}
                onPress={()=>handleGlobalClick()}
                placeholder="Select a bank..."
                textStyle={{ textAlign: "center" }}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={9999}
                zIndexInverse={1000}
                listMode="SCROLLVIEW"
              />
            </View>
          </View>
  
          {/* Account Number Input with Bulb Icon */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleExplanationModal("account")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              placeholder="Account number"
              keyboardType="numeric"
              value={bankAccountNumber}
              style={styles.input}
              onChangeText={(t) => setBankAccountNumber(t.replace(/[^0-9]/g, ""))}
            />
          </View>
  
          {/* Branch Number Input with Bulb Icon */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleExplanationModal("branch")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              placeholder="Branch number"
              keyboardType="numeric"
              value={bankBranchNumber}
              style={styles.input}
              onChangeText={(t) => setBankBranchNumber(t.replace(/[^0-9]/g, ""))}
            />
          </View>
              <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                style={[{ backgroundColor: "green" }, styles.button]}
                onPress={handleMoveForward}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
        </View>
        {/* Modal for Explanations */}
        <Modal visible={modalVisible} transparent animationType="none">
          <View style={styles.modalContainer}>
            <Animatable.View ref={modalRef} animation="fadeInUp" duration={500} style={styles.modalContent}>
              <Text style={styles.fontex}>{explanation}</Text>
              <TouchableOpacity style={[styles.button, styles.closeBtn]} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Modal>
        <View>
          <TouchableOpacity
            style={styles.lottieButton}
            onPress={handleAudioPlayback}
            accessibilityLabel="Click to hear audio guidance"
          >
            <LottieView
              source={robotAnimation}
              autoPlay
              loop
              style={styles.lottie}
              rendererSettings={{
                preserveAspectRatio: 'xMidYMid slice'
              }}
            />
          </TouchableOpacity>
        </View>
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
    marginBottom:150,
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
    marginBottom: 110,
    zIndex: 1, // Lower z-index for card
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
    backgroundColor: "green",
  },
  backBtn: {
    backgroundColor: "orange",
  },
  closeBtn: {
    backgroundColor: "red",
    width: "100%",
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
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "whitesmoke",
    borderEndColor: "black",
    borderBottomEndRadius: 2,
    width: "80%",
    maxWidth: 400,
  },
  fontex: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    zIndex: 1,
  },
  dropdown: {
    flex: 1,
    borderColor: "gray",
    borderRadius: 5,
    zIndex: 9999,
    elevation: 9999,
  },
  dropdownContainer: {
    borderColor: "gray",
    position: "absolute",
    width: "100%",
    zIndex: 9999,
    elevation: 9999,
  },
  lottieButton: {
    position: "absolute",
    top: 0,
    right: 110,
    width: 300,
    height: 300,
    zIndex: 500,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default SetUp33;
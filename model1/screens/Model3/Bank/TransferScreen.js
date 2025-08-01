import React, { useState, useEffect, useRef } from "react";
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
import { useUser } from "../../Model2/userContext";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import robotAnimation from "../SetupScreens/robot.json";
import Toast from "react-native-toast-message";

const AUDIO_URL = "https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/moneyTransfer.mp3";

const Transaction3 = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const [selectedBank, setSelectedBank] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankBranchNumber, setBankBranchNumber] = useState("");
  const [selectedBankReciver, setSelectedBankReciver] = useState("");
  const [bankAccountNumberReciver, setBankAccountNumberReciver] = useState("");
  const [bankBranchNumberReciver, setBankBranchNumberReciver] = useState("");
  const [reason, setReason] = useState("");
  const [money, setMoney] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  
  // Audio state variables
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
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
  const animatableRef = useRef(null);
  const modalRef = useRef(null);

  // Function to handle Lottie animation press and audio playback
  const handleLottiePress = async () => {
    handleGlobalClick();
    if (sound && isPlaying) {
      // If playing, pause the audio
      await sound.pauseAsync();
      setIsPlaying(false);
    } else if (sound) {
      // If paused, resume playing
      await sound.playAsync();
      setIsPlaying(true);
    } else {
      // Load and play new sound
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: AUDIO_URL },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error playing recording',
          text2: 'Recording cannot be played at this time',
          visibilityTime: 4000,
        });
      }
    }
  };

  // Function to stop audio playback
  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    setSelectedBank(user.selectedBank || "");
    setBankAccountNumber(user.bankAccountNumber || "");
    setBankBranchNumber(user.bankBranchNumber || "");
  }, [user]);

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const handleIconPress = (field) => {
    stopAudio(); // Stop audio when opening explanation
    
    const fieldExplanations = {
      bank: "Please select a bank from the list.",
      account: "Please enter your bank account number.",
      branch: "Please enter your bank branch number.",
      money: "Please enter the amount you want to transfer.",
      reason: "Please enter the purpose of the transfer.",
    };
    setExplanation(fieldExplanations[field]);
    setIconAnimation("pulse");
    setModalVisible(true);
    handleGlobalClick();
  };

  const handleNavigate = (route, direction) => {
    stopAudio(); // Stop audio when navigating
    
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
    stopAudio(); // Stop audio when submitting
    handleGlobalClick();
    
    if (
      reason !== "" &&
      selectedBank !== "" &&
      money !== "" &&
      bankBranchNumber !== "" &&
      bankAccountNumber !== "" &&
      selectedBankReciver !== "" &&
      bankAccountNumberReciver !== "" &&
      bankBranchNumberReciver !== ""
    ) {
      // First, hide any currently showing Toast
      Toast.hide();
      
      // Use setTimeout to ensure the Toast appears after UI updates
      setTimeout(() => {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'success',
          text2: 'Transfer successful',
          visibilityTime: 4000,
        });
      }, 100);
      
      // Reset fields
      setBankAccountNumberReciver("");
      setBankBranchNumberReciver("");
      setReason("");
      setMoney("");
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
    stopAudio(); // Stop audio when closing modal
    
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
        <View style={[styles.card, open || open2 ? { zIndex: 100 } : {}]}>
        <Text style={styles.title}>Make a bank transfer</Text>
        <Text style={styles.subtitle}>
          Your information is stored securely. Fill in all the details to make a transfer.
        </Text>

          {/* Sender's bank section */}
          <View style={[styles.inputContainer, { zIndex: 3000 }]}>
            <TouchableOpacity onPress={() => handleIconPress("bank")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <DropDownPicker
              open={open}
              value={selectedBank}
              items={items}
              setOpen={(value) => {
                setOpen(value);
                if (value) setOpen2(false); // Close the other dropdown if opening this one
                handleGlobalClick();
              }}
              setValue={setSelectedBank}
              setItems={setItems}
              placeholder="Select a bank..."
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropDownDirection="BOTTOM"
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          {/* These fields should have lower z-index when dropdowns are open */}
          <View style={[styles.inputContainer, { zIndex: open || open2 ? 1 : 10 }]}>
            <TouchableOpacity onPress={() => handleIconPress("account")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Bank account number"
              value={bankAccountNumber}
              onPress={handleGlobalClick}
              onChangeText={(text) => {
                setBankAccountNumber(text.replace(/[^0-9]/g, ""));
                handleGlobalClick();
              }}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputContainer, { zIndex: open || open2 ? 1 : 10 }]}>
            <TouchableOpacity onPress={() => handleIconPress("branch")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Bank branch number"
              value={bankBranchNumber}
              onPress={handleGlobalClick}
              onChangeText={(text) => {
                setBankBranchNumber(text.replace(/[^0-9]/g, ""));
                handleGlobalClick();
              }}
              keyboardType="numeric"
            />
          </View>

          {/* Receiver's bank section */}
          <View style={[styles.inputContainer, { zIndex: 2000 }]}>
            <TouchableOpacity onPress={() => handleIconPress("bank")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <DropDownPicker
              open={open2}
              value={selectedBankReciver}
              items={items}
              setOpen={(value) => {
                setOpen2(value);
                if (value) setOpen(false); // Close the other dropdown if opening this one
                handleGlobalClick();
              }}
              setValue={setSelectedBankReciver}
              setItems={setItems}
              placeholder="Select recipient's bank..."
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              zIndex={2000}
              zIndexInverse={2000}
            />
          </View>

          <View style={[styles.inputContainer, { zIndex: open || open2 ? 1 : 10 }]}>
            <TouchableOpacity onPress={() => handleIconPress("account")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Recipient's bank account number"
              value={bankAccountNumberReciver}
              onPress={handleGlobalClick}
              onChangeText={(text) => {
                setBankAccountNumberReciver(text.replace(/[^0-9]/g, ""));
                handleGlobalClick();
              }}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputContainer, { zIndex: open || open2 ? 1 : 10 }]}>
            <TouchableOpacity onPress={() => handleIconPress("branch")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Recipient's bank branch number"
              value={bankBranchNumberReciver}
              onPress={handleGlobalClick}
              onChangeText={(text) => {
                setBankBranchNumberReciver(text.replace(/[^0-9]/g, ""));
                handleGlobalClick();
              }}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputContainer, { zIndex: open || open2 ? 1 : 10 }]}>
            <TouchableOpacity onPress={() => handleIconPress("reason")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Reason for transfer"
              value={reason}
              onPress={handleGlobalClick}
              onChangeText={(val) => {
                setReason(val);
                handleGlobalClick();
              }}
            />
          </View>

          <View style={[styles.inputContainer, { zIndex: open || open2 ? 1 : 10 }]}>
            <TouchableOpacity onPress={() => handleIconPress("money")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Transfer amount"
              value={money}
              onPress={handleGlobalClick}
              onChangeText={(text) => {
                setMoney(text.replace(/[^0-9]/g, ""));
                handleGlobalClick();
              }}
              keyboardType="numeric"
            />
          </View>

          <View style={[
            { alignItems: "center", marginBottom: 20, marginTop: 10, zIndex: open || open2 ? 1 : 10 }
          ]}>
            <TouchableOpacity
              style={[styles.button, styles.sendBtn]}
              onPress={handelSend}
            >
              <Text style={styles.buttonText}>Make a transfer</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={[styles.buttonRow, { zIndex: open || open2 ? 1 : 10 }]}>
            <TouchableOpacity
              style={[styles.button, styles.forwardBtn]}
              onPress={() => handleNavigate("Bank3", "forward")}
            >
              <Text style={styles.buttonText}>Banking Services</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.backBtn]}
              onPress={() => handleNavigate("Home13", "back")}
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
              <TouchableOpacity
                style={[styles.button, styles.closeBtn]}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Modal>
        
        {/* Lottie Animation */}
        <View>
          <TouchableOpacity
            style={styles.lottieButton}
            onPress={handleLottiePress}
          >
            <LottieView
              source={robotAnimation}
              autoPlay
              loop
              style={styles.lottie}
            />
          </TouchableOpacity>
        </View>
        
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
    zIndex: 1,
    position: "relative",
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
    backgroundColor: "green",
  },
  backBtn: {
    backgroundColor: "orange",
  },
  closeBtn: {
    backgroundColor: "red",
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
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "whitesmoke",
    borderEndColor: "black",
    borderBottomEndRadius: 2,
  },
  fontex: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "bold",
    color: "black",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
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
    backgroundColor: "#52bfbf",
    width: "60%",
  },
  lottieButton: {
    position: "absolute",
    bottom: -80,
    right: 300,
    width: 300,
    height: 300,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default Transaction3;
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
  Alert,
  LogBox
} from "react-native";
import { Entypo } from '@expo/vector-icons';
import * as Animatable from "react-native-animatable";
import DropDownPicker from "react-native-dropdown-picker";
import { useUser } from "../../Model2/userContext";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import robotAnimation from "./robot.json";

// Ignore specific warnings related to DropDownPicker
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const SetUp43 = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const [selectedhealthFund, setSelectedhealthFund] = useState("");
  const [healthFundAccountNumber, sethealthFundAccountNumber] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  const [open, setOpen] = useState(false);
  // Added audio state variables
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [items, setItems] = useState([
    { label: "מכבי", value: "מכבי" },
    { label: "כללית", value: "כללית" },
    { label: "מאוחדת", value: "מאוחדת" },
    { label: "לאומית", value: "לאומית" },
  ]);

  const animatableRef = useRef(null);
  const modalRef = useRef(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    setSelectedhealthFund(user.selectedHealthFund || "");
    sethealthFundAccountNumber(user.healthFundAccountNumber || "");
    setEmergencyPhone(user.emergencyNumber || "");
  }, [user]);

  // Function to stop audio playback
  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  const handleIconPress = (field) => {
    stopAudio(); // Stop audio when opening explanation modal

    const fieldExplanations = {
      healthFund: "אנא בחר קופת חולים מהרשימה.",
      account: "אנא הזן את מספר החשבון שלך.",
      phone: "אנא הזן את מספר הטלפון לאיש קשר למקרה חירום.",
    };
    setExplanation(fieldExplanations[field]);
    setIconAnimation("pulse");
    setModalVisible(true);
    handleGlobalClick();
  };

  const handleMoveForward = () => {
    stopAudio(); // Stop audio when navigating forward

    if (!animatableRef.current) {
      // Fallback if the animation reference is not set
      navigation.navigate("HomeSetUp");
      return;
    }
    animatableRef.current
      .animate("fadeOutLeft", 500)
      .then(() => {
        updateUser({
          ...user,
          selectedHealthFund: selectedhealthFund,
          healthFundAccountNumber: healthFundAccountNumber,
          emergencyNumber: emergencyPhone,
        });
        navigation.navigate("HomeSetUp");
      })
      .catch((error) => {
        console.error("Animation failed", error);
        navigation.navigate("HomeSetUp");
      });
  };

  const handleGoBack = () => {
    stopAudio(); // Stop audio when navigating back

    animatableRef.current.animate("fadeOutRight", 500).then(() => {
      navigation.navigate("SetUp33");
    });
  };

  // Updated to handle audio playback
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
          {uri:"https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/setup4.mp3"},
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
        Alert.alert("שגיאה בהפעלת ההקלטה", "לא ניתן להפעיל את ההקלטה כרגע.");
      }
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

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
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
          <Text style={styles.title}>הגדרת פרטי חשבון קופת חולים ואיש קשר</Text>
          <Text style={styles.subtitle}>
            .כדי שהרובוט המטפל יוכל להפעיל את שירותיו לטובך, נצטרך את פרטי קופת
            החולים שלך ומספר טלפון לאיש קשר למקרה חירום. קיימת אפשרות לא להזין
            את פרטי חשבונך אך לא תוכל להשתמש בשירותי קופת החולים או להתקשר לאיש
            קשר במקרה חירום. המידע נשמר בצורה מאובטחת.
          </Text>
          {/* Health Fund Picker */}
          <View style={[styles.inputContainer, { zIndex: 9999 }]}>
            {/* Icon and Label */}
            <TouchableOpacity onPress={() => handleIconPress("healthFund")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <View style={{ flex: 1, zIndex: 9999 }}>
              <DropDownPicker
                open={open}
                value={selectedhealthFund}
                items={items}
                setOpen={setOpen}
                onPress={()=>handleGlobalClick()}
                setValue={setSelectedhealthFund}
                setItems={setItems}
                placeholder="בחר קופת חולים..."
                textStyle={{ textAlign: "center" }}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={9999}
                zIndexInverse={1000}
                listMode="SCROLLVIEW"
              />
            </View>
          </View>

          {/* Account Number Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("account")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="מספר חשבון קופת חולים"
              value={healthFundAccountNumber}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                sethealthFundAccountNumber(numericText);
              }}
              onPress={() => handleGlobalClick()}
              keyboardType="numeric"
            />
          </View>

          {/* Emergency Phone Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("phone")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="מספר טלפון לאיש קשר במקרה חירום"
              value={emergencyPhone}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                setEmergencyPhone(numericText);
              }}
              onPress={() => handleGlobalClick()}
              keyboardType="numeric"
            />
          </View>
              <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                style={[{ backgroundColor: "green" }, styles.button]}
                onPress={handleMoveForward}
              >
                <Text style={styles.buttonText}>שמור</Text>
              </TouchableOpacity>
            </View>
        </View>

        {/* Modal */}
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
                <Text style={styles.buttonText}>סגור</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Modal>
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
    zIndex: 1,
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

export default SetUp43;
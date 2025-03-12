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
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import * as Animatable from "react-native-animatable";
import DropDownPicker from "react-native-dropdown-picker";
import { useUser } from "../../Model2/userContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";

const Schedule3 = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "בדיקה כללית", value: "בדיקה כללית" },
    { label: "רופא משפחה", value: "רופא משפחה" },
    { label: "בדיקות דם", value: "בדיקות דם" },
  ]);
  const animatableRef = useRef(null);
  const modalRef = useRef(null);

  const handleIconPress = (field) => {
    const fieldExplanations = {
      type: "בחר/י את סוג הטיפול שברצונך לקבוע",
      time: "בחר/י את השעה שאת/ה מעוניין/ת לקבוע בו את התור",
      date: "בחר/י את התאריך שאת/ה מעוניין/ת לקבוע בו את התור",
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
    if (time !== "" && date !== "" && type !== "") {
      Alert.alert("התור נקבע בהצלחה");
      handleGlobalClick();
      setType("");
      setDate(new Date());
      setTime(new Date());
    } else {
      Alert.alert("לא כל השדות מולאו. מלא/י את כלל השדות");
    }
  };

  const closeModal = () => {
    modalRef.current
      .animate("fadeOutDown", 500)
      .then(() => setModalVisible(false));
    setIconAnimation("");
    handleGlobalClick();
  };
  const handleLottiePress = () => {
    Alert.alert("play video");
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
        <View style={styles.card}>
          <Text style={styles.title}>קביעת תור</Text>
          <Text style={styles.subtitle}>
            המידע נשמר בצורה מאובטחת. מלא את כלל הפרטים כדי לקבוע את התור.
          </Text>

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("type")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <DropDownPicker
              open={open}
              value={type}
              items={items}
              setOpen={(value) => {
                setOpen(value);
                handleGlobalClick();
              }}
              setValue={setType}
              setItems={setItems}
              textStyle={styles.input}
              placeholder="בחר סוג טיפול..."
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("date")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={date}
                mode="date"
                display="inline"
                onChange={(event, selectedDate) => {
                  setDate(selectedDate || date);
                  handleGlobalClick();
                }}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("time")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={time}
                mode="time"
                display="inline"
                onChange={(event, selectedTime) => {
                  setTime(selectedTime || time);
                  handleGlobalClick();
                }}
                style={styles.time}
              />
            </View>
          </View>
          <View
            style={{ alignItems: "center", marginBottom: 20, marginTop: 10 }}
          >
            <TouchableOpacity
              style={[styles.button, styles.sendBtn]}
              onPress={handelSend}
            >
              <Text style={styles.buttonText}>קבע תור</Text>
            </TouchableOpacity>
          </View>
          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.forwardBtn]}
              onPress={() => handleNavigate("Health3", "forward")}
            >
              <Text style={styles.buttonText}>שירותי בריאות</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.backBtn]}
              onPress={() => handleNavigate("Home13", "back")}
            >
              <Text style={styles.buttonText}>מסך בית</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={styles.lottieButton}
            onPress={handleLottiePress}
          >
            <LottieView
              source={require("../SetupScreens/robot.json")}
              autoPlay
              loop
              style={styles.lottie}
            />
          </TouchableOpacity>
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
                <Text style={styles.buttonText}>סגור</Text>
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
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
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
    backgroundColor: "transperent",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "whitesmoke",
    borderEndColor: "black",
    borderBottomEndRadius: "2",
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
    width: 595,
    borderColor: "gray",
    borderRadius: 5,
  },

  dropdownContainer: {
    width: 595,
    borderColor: "gray",
  },
  sendBtn: {
    backgroundColor: "#52bfbf",
  },
  datePickerContainer: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "85%",
    padding: 10,
  },
  time: {
    width: 200,
  },
  lottieButton: {
    position: "absolute",
    top: -150,
    right: 110,
    width: 300,
    height: 300,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default Schedule3;

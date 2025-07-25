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
import DateTimePicker from "@react-native-community/datetimepicker";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import Toast from "react-native-toast-message";
import robotAnimation from "../SetupScreens/robot.json";

const AUDIO_URL = "https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/scheduleAppointment.mp3";

const Schedule3 = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  const [open, setOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'web');
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === 'web');
  const [items, setItems] = useState([
    { label: 'General Examination', value: 'General Examination' },
    { label: 'Family Doctor', value: 'Family Doctor' },
    { label: 'Blood Tests', value: 'Blood Tests' },
  ]);
  
  // Audio state variables
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const animatableRef = useRef(null);
  const modalRef = useRef(null);

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
      type: "Select the type of treatment you want to schedule",
      time: "Select the time you want to schedule the appointment",
      date: "Select the date you want to schedule the appointment",
    };
    setExplanation(fieldExplanations[field]);
    setIconAnimation("pulse");
    setModalVisible(true);
    handleGlobalClick();

    // On mobile, show the appropriate picker when the icon is pressed
    if (Platform.OS !== 'web') {
      if (field === 'date') {
        setShowDatePicker(true);
      } else if (field === 'time') {
        setShowTimePicker(true);
      }
    }
  };

  const handleNavigate = (route, direction) => {
    stopAudio(); // Stop audio when navigating
    
    if (!animatableRef.current) return;
    const animationType = direction === "forward" ? "fadeOutLeft" : "fadeOutRight";

    animatableRef.current
      .animate(animationType, 500)
      .then(() => navigation.navigate(route))
      .catch((error) => {
        console.error("Animation error:", error);
        navigation.navigate(route);
      });
  };

  const handelSend = () => {
    stopAudio(); // Stop audio when submitting
    handleGlobalClick();
    
    if (time !== "" && date !== "" && type !== null) {
      // First, hide any currently showing Toast
      Toast.hide();
      
      // Use setTimeout to ensure the Toast appears after UI updates
      setTimeout(() => {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'success',
          text2: 'Queue set successfully',
          visibilityTime: 4000,
          autoHide: true,
          });
        }, 100);
      
      setType(null);
      setDate(new Date());
      setTime(new Date());
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
          autoHide: true,
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

  // Handle Lottie animation press and audio playback
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

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (Platform.OS !== 'web') {
      setShowDatePicker(false);
    }
    setDate(currentDate);
    handleGlobalClick();
  };

  // Handle time change
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    if (Platform.OS !== 'web') {
      setShowTimePicker(false);
    }
    setTime(currentTime);
    handleGlobalClick();
  };

  // Format date for display
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Format time for display
  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render date picker according to platform
  const renderDatePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.inputWrapper}>
          <input
            type="date"
            style={{
              ...styles.webInput,
              textAlign: "center",
              // The following fixes alignment issues in some browsers
              MozAppearance: "textfield",
              WebkitAppearance: "none",
              margin: 0,
              // Force text centering in various browsers
              "-moz-text-align-last": "center",
              "text-align-last": "center"
            }}
            value={date.toISOString().split('T')[0]}
            onChange={(e) => {
              setDate(new Date(e.target.value));
              handleGlobalClick();
            }}
          />
        </View>
      );
    } else {
      return showDatePicker ? (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      ) : (
        <TouchableOpacity 
          style={styles.dateDisplay}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
        </TouchableOpacity>
      );
    }
  };

  // Render time picker according to platform
  const renderTimePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.inputWrapper}>
          <input
            type="time"
            style={{
              ...styles.webInput,
              textAlign: "center",
              // The following fixes alignment issues in some browsers
              MozAppearance: "textfield",
              WebkitAppearance: "none",
              margin: 0,
              // Force text centering in various browsers
              "-moz-text-align-last": "center",
              "text-align-last": "center"
            }}
            value={`${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`}
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(':');
              const newTime = new Date();
              newTime.setHours(parseInt(hours, 10));
              newTime.setMinutes(parseInt(minutes, 10));
              setTime(newTime);
              handleGlobalClick();
            }}
          />
        </View>
      );
    } else {
      return showTimePicker ? (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      ) : (
        <TouchableOpacity 
          style={styles.dateDisplay}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
        </TouchableOpacity>
      );
    }
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
        <View style={styles.cardWrapper}>
          <View style={[styles.card, open ? { zIndex: 100 } : {}]}>
          <Text style={styles.title}>Schedule an appointment</Text>
          <Text style={styles.subtitle}>
            Your information is stored securely. Fill in all the details to schedule an appointment.
          </Text>
            {/* Treatment Type Dropdown */}
            <View style={[styles.inputContainer, { zIndex: 3000 }]}>
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
                setOpen={(value) => {setOpen(value); handleGlobalClick();}}
                setValue={setType}
                setItems={setItems}
                placeholder="Select treatment type..."
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                dropDownDirection="BOTTOM"
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>

            {/* Date Picker */}
            <View style={[styles.inputContainer, { zIndex: open ? 1 : 10 }]}>
              <TouchableOpacity onPress={() => handleIconPress("date")}>
                <Animatable.View
                  animation={iconAnimation}
                  style={styles.iconContainer}
                >
                  <Entypo name="light-bulb" size={40} color="yellow" />
                </Animatable.View>
              </TouchableOpacity>
              <View style={styles.datePickerContainer}>
                {renderDatePicker()}
              </View>
            </View>

            {/* Time Picker */}
            <View style={[styles.inputContainer, { zIndex: open ? 1 : 10 }]}>
              <TouchableOpacity onPress={() => handleIconPress("time")}>
                <Animatable.View
                  animation={iconAnimation}
                  style={styles.iconContainer}
                >
                  <Entypo name="light-bulb" size={40} color="yellow" />
                </Animatable.View>
              </TouchableOpacity>
              <View style={styles.datePickerContainer}>
                {renderTimePicker()}
              </View>
            </View>

            {/* Send Button */}
            <View style={[
              { alignItems: "center", marginBottom: 20, marginTop: 10, zIndex: open ? 1 : 10 }
            ]}>
              <TouchableOpacity
                style={[styles.button, styles.sendBtn]}
                onPress={handelSend}
              >
                <Text style={styles.buttonText}>Make an appointment</Text>
              </TouchableOpacity>
            </View>

            {/* Navigation Buttons */}
            <View style={[styles.buttonRow, { zIndex: open ? 1 : 10 }]}>
              <TouchableOpacity
                style={[styles.button, styles.forwardBtn]}
                onPress={() => handleNavigate("Home1", "forward")}
              >
                <Text style={styles.buttonText}>Home screen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.backBtn]}
                onPress={() => handleNavigate("Health3", "back")}
              >
                <Text style={styles.buttonText}>Health Services</Text>
              </TouchableOpacity>
            </View>
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
              <TouchableOpacity style={[styles.button, styles.closeBtn]} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Modal>
        
        {/* Lottie Animation Button */}
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
        
        {/* Toast component */}
        <Toast />
      </KeyboardAvoidingView>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 20,
    position: "relative",
    zIndex: 1,
  },
  cardWrapper: {
    flex: 1,
    alignItems: "center", 
    justifyContent: "flex-start", // This positions content at the top
    marginTop: 100, // This moves the card up higher on the screen
    paddingTop: 0,
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
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "whitesmoke",
    borderColor: 'black',
    borderWidth: 1,
    width: "80%",
    maxWidth: 400,
  },
  fontex: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  dropdown: {
    flex: 1,
    borderColor: "#ccc",
    height: 45,
    width: "92%",
  },
  dropdownText: {
    textAlign: "center",
    fontSize: 16,
  },
  sendBtn: {
    backgroundColor: '#52bfbf',
    width: "60%",
  },
  datePickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
  },
  dateDisplay: {
    flex: 1,
    height: 45,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: "center",
  },
  dateTimeText: {
    fontSize: 16,
    textAlign: "center",
    width: "100%",
  },
  webInput: {
    width: "100%",
    height: 45,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    border: "none",
    outline: "none",
    textAlign: "center",
  },
  inputWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    textAlign: "center",
  },
  time: {
    width: "100%",
  },
  lottieButton: {
    position: "absolute",
    top: -350,
    right: 900,
    width: 300,
    height: 300,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default Schedule3;
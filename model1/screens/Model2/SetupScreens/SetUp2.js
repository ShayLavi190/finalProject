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
import { useUser } from "../userContext";

const SetUp2 = ({ navigation,handleGlobalClick }) => {
  const { user, updateUser } = useUser(); 
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");

  const modalRef = useRef(null); 
  const animatableRef = useRef(null); 

  useEffect(() => {
    setCity(user.city);
    setCountry(user.country);
    setNumber(user.number);
    setStreet(user.street);
  }, [user]);

  const handleIconPress = (field) => {
    const fieldExplanations = {
      street: "אנא הזן את שם הרחוב שלך.",
      "number and apartment": "אנא הזן את מספר הבית של ומספר דירה אם יש. זהו שדה חובה",
      city: "אנא הזן את שם העיר שלך.",
      country: "אנא הזן את שם המדינה שלך.",
    };
    setExplanation(fieldExplanations[field]);
    setIconAnimation("pulse");
    setModalVisible(true);
    handleGlobalClick();
  };

  const validateInputs = () => {
    const errors = [];
    if (!street.trim()) errors.push("רחוב נדרש. שדה זה חובה");
    if (!number.trim()) errors.push("מספר בית ודירה אם יש נדרש. שדה זה חובה");
    if (!city.trim()) errors.push("נא להזין את העיר בה אתה מתגורר. שדה זה חובה");
    if (!country.trim()) errors.push("נא להזין את המדינה בה אתם גרים. שדה זה חובה");
    if (errors.length > 0) {
      Alert.alert("שגיאה", errors.join("\n"));
      return false;
    }
    return true;
  };

  const handleMoveForward = () => {
    if (!validateInputs()) return;
    
    animatableRef.current
      .animate("fadeOutLeft", 500) 
      .then(() => {
        updateUser({
          ...user,
          street:street,
          number:number,
          city:city,
          country:country,
        });
        navigation.navigate("SetUp3"); 
      });
  };

  const handleGoBack = () => {
    animatableRef.current
    .animate("fadeOutRight", 500) 
    .then(() => {
      updateUser({
        ...user,
        street:street,
        number:number,
        city:city,
        country:country,
      });
      navigation.navigate("SetUp"); 
    });
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
        <View style={styles.card}>
          <Text style={styles.title}> הגדרת כתובת לקוח</Text>
          <Text style={styles.subtitle}>
          כדי שהרובוט המטפל יוכל להפעיל את שירותיו לטובך נצטרך את פרטי המגורים. כלל המידע נשמר בצורה מאובטחת ואינו
          משותף עם שום גורם חיצוני ללא ביצוע שירות ייעודי.
        </Text>
          {/* Street Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("street")}>
              <Animatable.View  animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="רחוב"
              value={street}
              onChangeText={(value)=>{setStreet(value);handleGlobalClick();}}
            />
          </View>

          {/* Number Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("number and apartment")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="מספר רחוב ודירה אם יש"
              value={number}
              onChangeText={(value)=>{setNumber(value);handleGlobalClick();}}
              keyboardType="numeric"
            />
          </View>

          {/* City Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("city")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="עיר"
              value={city}
              onChangeText={(value)=>{setCity(value);handleGlobalClick();}}
            />
          </View>

          {/* Country Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("country")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="מדינה"
              value={country}
              onChangeText={(value)=>{setCountry(value);handleGlobalClick();}}
            />
          </View>

          {/* Next Button */}
          <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button,styles.forwardBtn]} onPress={handleMoveForward}>
            <Text style={styles.buttonText}>המשך</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button,styles.backBtn]} onPress={handleGoBack}>
            <Text style={styles.buttonText}>חזור</Text>
          </TouchableOpacity>
        </View>
        </View>

        {/* Modal */}
        <Modal visible={modalVisible} transparent animationType="none">
          <View style={styles.modalContainer}>
            <Animatable.View
              ref={modalRef} 
              animation="fadeInUp"
              duration={500}
              style={styles.modalContent}
            >
              <Text style={styles.fontex}>{explanation}</Text>
              <TouchableOpacity style={[styles.button,styles.closeBtn]} onPress={closeModal}>
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
    marginBottom:100
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
  forwardBtn:
  {
    backgroundColor:'green'
  },
  backBtn:
  {
    backgroundColor:'orange'
  },
  closeBtn:
  {
    backgroundColor:'red'
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight:'bold'
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
    backgroundColor:"whitesmoke",
    borderEndColor:'black',
    borderBottomEndRadius:'2'
  },
  fontex: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight:'bold',
    color:'black'
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default SetUp2;

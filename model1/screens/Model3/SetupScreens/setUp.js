import React, { useState, useEffect,useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import * as Animatable from "react-native-animatable";
import { useUser } from "../../Model2/userContext";
import LottieView from "lottie-react-native";


const Setup3 = ({ navigation,handleGlobalClick }) => {
  const { user, updateUser } = useUser(); 
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  const modalRef = useRef(null); 
  const animatableRef = useRef(null); 
  
  useEffect(() => {
    setName(user.name);
    setId(user.id);
    setPhone(user.phone);
  }, [user]);

  const handleIconPress = (field) => {
    const fieldExplanations = {
      name: "אנא הזן את שמך המלא כפי שמופיע בתעודת זהות. זהו שדה חובה",
      id: "אנא הזן את מספר תעודת הזהות שלך (9 ספרות). זהו שדה חובה",
      phone: "אנא הזן את מספר הטלפון שלך (10 ספרות). זהו שדה חובה",
    };
    setExplanation(fieldExplanations[field]);
    setIconAnimation("pulse");
    setModalVisible(true);
    handleGlobalClick();
  };

  const validateInputs = () => {
    const errors = [];
    if (!name.trim()) errors.push("שם מלא נדרש.");
    if (!id.trim() || id.length !== 9) errors.push("תעודת זהות חייבת להיות 9 ספרות.");
    if (!phone.trim() || phone.length !== 10) errors.push("מספר טלפון חייב להיות באורך 10 ספרות.");
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
        name: name,
        phone: phone,
        id: id,
      });
      navigation.navigate("SetUp23");
    });
  };

  const closeModal = () => {
    modalRef.current
      .animate("fadeOutDown", 500)
      .then(() => setModalVisible(false));
    setIconAnimation("");
    handleGlobalClick();
  };
  const handleLottiePress = () => {
    Alert.alert("play video")
  }

  return (
    <Animatable.View
    animation="fadeInDown" 
    duration={2000} 
    style={{ flex: 1 }}
    ref={animatableRef}
    >
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <Text style={styles.title}>הגדרת פרטים אישיים</Text>
        <Text style={styles.subtitle}>
          כדי שהרובוט המטפל יוכל להפעיל את שירותיו לטובך נצטרך את פרטיך האישיים. כלל המידע נשמר בצורה מאובטחת ואינו
          משותף עם שום גורם חיצוני ללא ביצוע שירות ייעודי.
        </Text>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => handleIconPress("name")}>
            <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
              <Entypo name="light-bulb" size={40} color="yellow" />
            </Animatable.View>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="שם מלא"
            value={name}
            onChangeText={(value)=>{setName(value);handleGlobalClick();}}
          />
        </View>

        {/* ID Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => handleIconPress("id")}>
            <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
              <Entypo name="light-bulb" size={40} color="yellow" />
            </Animatable.View>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="תעודת זהות"
            value={id}
            onChangeText={(text) => {/^\d*$/.test(text) && setId(text);handleGlobalClick();}}
            keyboardType="numeric"
          />
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => handleIconPress("phone")}>
            <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
              <Entypo name="light-bulb" size={40} color="yellow" />
            </Animatable.View>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="מספר טלפון"
            value={phone}
            onChangeText={(text) => {/^\d*$/.test(text) && setPhone(text);handleGlobalClick();}}
            keyboardType="numeric"
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity style={[{backgroundColor:'green'},styles.button]} onPress={handleMoveForward}>
          <Text style={styles.buttonText}>המשך</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button,{backgroundColor:'red'}]} onPress={()=>{navigation.navigate("Premissions13");}}>
              <Text style={styles.buttonText}>מעבר</Text>
            </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} transparent animationType="none">
        <View style={styles.modalContainer}>
          <Animatable.View
            ref={modalRef} 
            animation="fadeInUp"
            duration={500} 
            style={styles.modalContent}
          >
            <Text style={styles.fontex}>{explanation}</Text>
            <TouchableOpacity style={[styles.button,{backgroundColor:'red'}]} onPress={closeModal}>
              <Text style={styles.buttonText}>סגור</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
      <View>
        <TouchableOpacity style={styles.lottieButton} onPress={handleLottiePress}>
          <LottieView
            source={require("/Users/shaylavi/Desktop/final_project/m1/model1/screens/Model3/SetupScreens/robot.json")}
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
    marginBottom:90
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
  lottieButton: {
    position: "absolute",
    top: 80,
    right: 110,
    width: 300,
    height: 300,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 2
  },
  lottie: {
    width: "100%",
    height: "100%",
  },  
});

export default Setup3;

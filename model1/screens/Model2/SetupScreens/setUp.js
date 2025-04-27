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
      name: "אנא הזן את שמך המלא כפי שמופיע בתעודת זהות. זהו שדה חובה",
      idr: "אנא הזן את מספר תעודת הזהות שלך (9 ספרות). זהו שדה חובה",
      id: "אנא הזן את מספר זיהוי משתתף. זהו שדה חובה",
      phone: "אנא הזן את מספר הטלפון שלך (10 ספרות). זהו שדה חובה",
    };
    setExplanation(fieldExplanations[field]);
    setIconAnimation("pulse");
    setModalVisible(true);
    handleGlobalClick();
  };

  const validateInputs = () => {
    const errors = [];
    
    if (!id) errors.push("מספר זיהוי משתתף נדרש.");
    if (!name) errors.push("שם מלא נדרש.");
    
    // Check if idr exists before checking its length
    if (!idr) {
      errors.push("תעודת זהות נדרשת.");
    } else if (idr.length !== 9) {
      errors.push("תעודת זהות חייבת להיות 9 ספרות.");
    }
    
    // Check if phone exists before checking its length
    if (!phone) {
      errors.push("מספר טלפון נדרש.");
    } else if (phone.length !== 10) {
      errors.push("מספר טלפון חייב להיות באורך 10 ספרות.");
    }
    
    if (errors.length > 0) {
      // Hide any currently showing Toast
      Toast.hide();
      
      // Show a single toast with all errors
      Toast.show({
        type: "error",
        text1: "שגיאה בטופס",
        text2: errors.join(" | "),
        visibilityTime: 4000,
        position: "top",
        textStyle: { fontSize: 18, textAlign: "right" },
        style: { width: "90%", backgroundColor: "#ff4d4d", borderRadius: 10, alignSelf: "flex-end" },
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
    modalRef.current
      .animate("fadeOutDown", 500)
      .then(() => setModalVisible(false));
    setIconAnimation("");
    handleGlobalClick();
  };

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
        <Toast/>
        <View style={styles.card}>
          <Text style={styles.title}>הגדרת פרטים אישיים</Text>
          <Text style={styles.subtitle}>
            כדי שהרובוט המטפל יוכל להפעיל את שירותיו לטובך נצטרך את פרטיך
            האישיים. כלל המידע נשמר בצורה מאובטחת ואינו משותף עם שום גורם חיצוני
            ללא ביצוע שירות ייעודי.
          </Text>
          {/* ID Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("id")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder=" מספר זיהוי משתתף"
              value={id}
              onChangeText={(text) => {
                /^\d*$/.test(text) && setId(text);
              }}
              onPress={() => handleGlobalClick()}
              keyboardType="numeric"
            />
          </View>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("name")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="שם מלא"
              value={name}
              onChangeText={(value) => {
                setName(value);
              }}
              onPress={() => handleGlobalClick()}
            />
          </View>

          {/* ID Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("idr")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="תעודת זהות"
              value={idr}
              onChangeText={(text) => {
                /^\d*$/.test(text) && setIdr(text);
              }}
              onPress={() => handleGlobalClick()}
              keyboardType="numeric"
            />
          </View>

          {/* Phone Input */}
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
              placeholder="מספר טלפון"
              value={phone}
              onChangeText={(text) => {
                /^\d*$/.test(text) && setPhone(text);
              }}
              keyboardType="numeric"
              onPress={() => handleGlobalClick()}
            />
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={[{ backgroundColor: "green" }, styles.button]}
            onPress={handleMoveForward}
          >
            <Text style={styles.buttonText}>המשך</Text>
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
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
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
});

export default SetUp;

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
import { useUser } from "../userContext";

const SetUp4 = ({ navigation,handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const [selectedhealthFund, setSelectedhealthFund] = useState("");
  const [healthFundAccountNumber, sethealthFundAccountNumber] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
        { label: 'מכבי', value: 'מכבי' },
        { label: 'כללית', value: 'כללית' },
        { label: 'מאוחדת', value: 'מאוחדת' },
        { label: 'לאומית', value: 'לאומית' }
    ]);
    
  const animatableRef = useRef(null); 
  const modalRef = useRef(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    setSelectedhealthFund(user.selectedHealthFund || "");
    sethealthFundAccountNumber(user.healthFundAccountNumber || "");
    setEmergencyPhone(user.emergencyNumber || "");
  }, [user]);

  const handleIconPress = (field) => {
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
    if (!animatableRef.current) {
      // Fallback if the animation reference is not set
      navigation.navigate("Premission1");
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
        navigation.navigate("Premissions1");
      })
      .catch((error) => {
        console.error("Animation failed", error);
        navigation.navigate("Premissions1");
      });
  };
  

  const handleGoBack = () => {
    animatableRef.current
      .animate("fadeOutRight", 500)
      .then(() => {
        navigation.navigate("SetUp3");
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
          <Text style={styles.title}>הגדרת פרטי חשבון קופת חולים ואיש קשר</Text>
          <Text style={styles.subtitle}>
            .כדי שהרובוט המטפל יוכל להפעיל את שירותיו לטובך, נצטרך את פרטי קופת החולים שלך ומספר טלפון לאיש קשר למקרה חירום. קיימת אפשרות לא להזין את פרטי חשבונך אך לא תוכל להשתמש בשירותי קופת החולים או להתקשר לאיש קשר במקרה חירום. המידע נשמר בצורה מאובטחת.
          </Text>
          {/* Bank Picker */}
          <View style={styles.inputContainer}>
            {/* Icon and Label */}
            <TouchableOpacity onPress={() => handleIconPress("healthFund")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
                <DropDownPicker
                  open={open}
                  value={selectedhealthFund}
                  items={items}
                  setOpen={(val)=>{setOpen(val);handleGlobalClick();}}
                  setValue={setSelectedhealthFund}
                  setItems={setItems}
                  textStyle={styles.input}
                  placeholder="בחר קופת חולים..."
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
          </View>

          {/* Account Number Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("account")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
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
                handleGlobalClick();
              }}
              keyboardType="numeric"
            />
          </View>

          {/* Branch Number Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("phone")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
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
                handleGlobalClick();
              }}
              keyboardType="numeric"
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.forwardBtn]} onPress={handleMoveForward}>
              <Text style={styles.buttonText}>המשך</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.backBtn]} onPress={handleGoBack}>
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
              duration={1000}
              style={styles.modalContent}
            >
              <Text style={styles.fontex}>{explanation}</Text>
              <TouchableOpacity style={[styles.button, styles.closeBtn]} onPress={closeModal}>
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
    marginBottom:110
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
  dropdown: {
    width: 595,
    borderColor: "gray",
    borderRadius: 5,
  },
  
  dropdownContainer: {
    width: 595,
    borderColor: "gray",
    
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    color: "black",
    marginBottom: 15,
    width:595,
    textAlign:'center'
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    textAlign:'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    color: "black",
    marginBottom: 15,
    width:595,
  },
};

export default SetUp4;
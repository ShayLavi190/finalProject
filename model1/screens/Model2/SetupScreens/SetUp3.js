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
import { useUser } from "../userContext";

const SetUp3 = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const [selectedBank, setSelectedBank] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankBranchNumber, setBankBranchNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "לאומי", value: "10" },
    { label: "פועלים", value: "12" },
    { label: "דיסקונט", value: "11" },
    { label: "יהב", value: "4" },
    { label: "בנק הדואר", value: "9" },
    { label: "אגוד", value: "13" },
    { label: "אוצר החייל", value: "14" },
    { label: "מרכנתיל", value: "17" },
    { label: "Citibank N.A", value: "22" },
    { label: "מזרחי טפחות", value: "20" },
    { label: "HSBC Bank plc", value: "23" },
    { label: 'יובנק בע"מ', value: "26" },
    { label: "Barclays Bank PLC", value: "27" },
    { label: 'בנק למסחר בע"מ', value: "30" },
    { label: "הבינלאומי הראשון לישראל", value: "31" },
    { label: "SBI State Bank of India", value: "39" },
    { label: "מסד", value: "46" },
    { label: "מרכז סליקה בנקאי", value: "50" },
    { label: "פועלי אגודת ישראל", value: "52" },
    { label: "חסך קופת חסכון לחינוך", value: "65" },
    { label: "בנק ישראל", value: "99" },
  ]);
  const animatableRef = useRef(null);
  const modalRef = useRef(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    setSelectedBank(user.selectedBank || "");
    setBankAccountNumber(user.bankAccountNumber || "");
    setBankBranchNumber(user.bankBranchNumber || "");
  }, [user]);

  const handleIconPress = (field) => {
    const fieldExplanations = {
      bank: "אנא בחר בנק מהרשימה.",
      account: "אנא הזן את מספר חשבון הבנק שלך.",
      branch: "אנא הזן את מספר סניף הבנק שלך.",
    };
    setExplanation(fieldExplanations[field]);
    setIconAnimation("pulse");
    setModalVisible(true);
    handleGlobalClick();
  };

  const handleMoveForward = () => {
    animatableRef.current.animate("fadeOutLeft", 500).then(() => {
      updateUser({
        ...user,
        selectedBank,
        bankAccountNumber,
        bankBranchNumber,
      });
      navigation.navigate("SetUp4");
    });
  };

  const handleGoBack = () => {
    animatableRef.current.animate("fadeOutRight", 500).then(() => {
      updateUser({
        ...user,
        selectedBank,
        bankAccountNumber,
        bankBranchNumber,
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
          <Text style={styles.title}>הגדרת פרטי חשבון בנק</Text>
          <Text style={styles.subtitle}>
            .כדי שהרובוט המטפל יוכל להפעיל את שירותיו לטובך, נצטרך את פרטי הבנק
            שלך. קיימת אפשרות לא להזין את פרטי חשבונך אך לא תוכל להשתמש בשירותי
            הבנק. המידע נשמר בצורה מאובטחת.
          </Text>
          
          <View style={styles.dropdownSection}>
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={() => handleIconPress("bank")}>
                <Animatable.View
                  animation={iconAnimation === "bank" ? iconAnimation : ""}
                  style={styles.iconContainer}
                >
                  <Entypo name="light-bulb" size={40} color="yellow" />
                </Animatable.View>
              </TouchableOpacity>
              <View style={styles.dropdownWrapper}>
                <DropDownPicker
                  open={open}
                  value={selectedBank}
                  items={items}
                  setOpen={(val) => {
                    setOpen(val);
                    handleGlobalClick();
                  }}
                  setValue={setSelectedBank}
                  setItems={setItems}
                  textStyle={styles.dropdownText}
                  placeholder="בחר בנק..."
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  zIndex={3000}
                  zIndexInverse={1000}
                />
              </View>
            </View>
          </View>

          {/* Account Number Input */}
          <View style={[styles.inputContainer, { zIndex: open ? -1 : 1 }]}>
            <TouchableOpacity onPress={() => handleIconPress("account")}>
              <Animatable.View
                animation={iconAnimation === "account" ? iconAnimation : ""}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="מספר חשבון בנק"
              value={bankAccountNumber}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                setBankAccountNumber(numericText);
              }}
              onPressIn={() => handleGlobalClick()}
              keyboardType="numeric"
            />
          </View>

          {/* Branch Number Input */}
          <View style={[styles.inputContainer, { zIndex: open ? -1 : 1 }]}>
            <TouchableOpacity onPress={() => handleIconPress("branch")}>
              <Animatable.View
                animation={iconAnimation === "branch" ? iconAnimation : ""}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="מספר סניף בנק"
              value={bankBranchNumber}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                setBankBranchNumber(numericText);
              }}
              onPressIn={() => handleGlobalClick()}
              keyboardType="numeric"
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.forwardBtn]}
              onPress={handleMoveForward}
            >
              <Text style={styles.buttonText}>המשך</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.backBtn]}
              onPress={handleGoBack}
            >
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
    marginBottom: 110,
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
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
    zIndex: -1,
  },
  dropdownSection: {
    zIndex: 5000,
    marginBottom: 15,
  },
  dropdownWrapper: {
    flex: 1,
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 5,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    position: "absolute",
    width: "100%",
  },
  dropdownText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default SetUp3;
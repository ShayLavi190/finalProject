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

const Transaction = ({ navigation,handleGlobalClick }) => {
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
    { label: "יובנק בע\"מ", value: "26" },
    { label: "Barclays Bank PLC", value: "27" },
    { label: "בנק למסחר בע\"מ", value: "30" },
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
      money: "אנא הזן את הסכום שברצונך להעביר.",
      reason: "אנא הזן את מטרת העברה.",
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
    handleGlobalClick();
    if ( reason !== "" && selectedBank !== "" && money !== "" && bankBranchNumber !== "" && bankAccountNumber !== "" && selectedBankReciver !== "" && bankAccountNumberReciver !== "" && bankBranchNumberReciver !== "") 
    {
      Alert.alert("העברה בוצעה בהצלחה");
      setBankAccountNumberReciver("");
      setBankBranchNumberReciver("");
      setReason("");
      setMoney("");
    } 
    else 
    {
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

  return (
    <Animatable.View
      ref={animatableRef}
      animation="fadeInDown"
      duration={2000}
      style={{ flex: 1}}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.card}>
          <Text style={styles.title}>ביצוע העברה בנקאית</Text>
          <Text style={styles.subtitle}>
            המידע נשמר בצורה מאובטחת. מלא את כלל הפרטים כדי לבצע העברה.
          </Text>
          <View style={styles.inputContainer}>
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
              setOpen={(value) => {setOpen(value); handleGlobalClick();}}
              setValue={setSelectedBank}
              setItems={setItems}
              placeholder="בחר בנק..."
              style={[styles.dropdown, { zIndex: 3000 }]}
              dropDownContainerStyle={{ zIndex: 3000 }}
              textStyle={styles.dropdownText}
              dropDownDirection="BOTTOM"
            />
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("account")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="מספר חשבון בנק"
              value={bankAccountNumber}
              onPress={handleGlobalClick}
              onChangeText={(text) =>{
                setBankAccountNumber(text.replace(/[^0-9]/g, ""));
                handleGlobalClick();}
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("branch")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="מספר סניף בנק"
              value={bankBranchNumber}
              onPress={handleGlobalClick}
              onChangeText={(text) =>{
                setBankBranchNumber(text.replace(/[^0-9]/g, ""));
                handleGlobalClick();}
              }
              keyboardType="numeric"
            />
          </View >
          <View style={styles.inputContainer}>
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
              setOpen={(value) => {setOpen2(value); handleGlobalClick();}}
              setValue={setSelectedBankReciver}
              setItems={setItems}
              placeholder="בחר בנק של המקבל..."
              style={styles.dropdown}
              textStyle={styles.dropdownText}
            />
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("account")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="מספר חשבון בנק של המקבל"
              value={bankAccountNumberReciver}
              onPress={handleGlobalClick}
              onChangeText={(text) =>{
                setBankAccountNumberReciver(text.replace(/[^0-9]/g, ""))
                handleGlobalClick();
              }
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("branch")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="מספר סניף בנק של המקבל"
              value={bankBranchNumberReciver}
              onPress={handleGlobalClick}
              onChangeText={(text) =>{
                setBankBranchNumberReciver(text.replace(/[^0-9]/g, ""));
                handleGlobalClick();
              }}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("reason")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="סיבת העברה"
              value={reason}
              onPress={handleGlobalClick}
              onChangeText={(val)=>{setReason(val);handleGlobalClick();}}
            />
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("money")}>
              <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="סכום העברה"
              value={money}
              onPress={handleGlobalClick}
              onChangeText={(text) => {setMoney(text.replace(/[^0-9]/g, ""));handleGlobalClick();}}
              keyboardType="numeric"
            />
          </View>
          <View style={{alignItems:'center',marginBottom:20,marginTop:10}}>
            <TouchableOpacity
                style={[styles.button, styles.sendBtn]}
                onPress={handelSend}
                >
                <Text style={styles.buttonText}>ביצוע העברה</Text>
                </TouchableOpacity>
          </View>
          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.forwardBtn]}
              onPress={() => handleNavigate("ContactBankerM2", "forward")}
            >
              <Text style={styles.buttonText}>כתוב לבנקאי</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.backBtn]}
              onPress={() => handleNavigate("Bankm2", "back")}
            >
              <Text style={styles.buttonText}>חזור</Text>
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
    zIndex:1
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
    marginBottom:140,
    zIndex:1
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
    zIndex:1 
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
    zIndex:1 
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
    zIndex:1 
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
    zIndex:1 
  },
  dropdown: {
    marginBottom: 15,
    borderColor: "#ccc",
    height: 50,
    width: "90%",
    zIndex:1000
  },
  dropdownText: {
    textAlign: "center",
    fontSize: 16,
    zIndex:1000
  },
  sendBtn:
  {
    backgroundColor:'#52bfbf'
  }
});

export default Transaction;
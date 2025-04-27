import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";

const TransferScreen = ({ navigation, handleGlobalClick }) => {
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchNumber, setBranchNumber] = useState("");
  const [reason, setReason] = useState("");
  const [money, setMoney] = useState("");

  const [bankOpen, setBankOpen] = useState(false);
  const [bankItems, setBankItems] = useState([
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
    { label: "יובנק בע״מ", value: "26" },
    { label: "Barclays Bank PLC", value: "27" },
    { label: "בנק למסחר בע״מ", value: "30" },
    { label: "הבינלאומי הראשון לישראל", value: "31" },
    { label: "SBI State Bank of India", value: "39" },
    { label: "מסד", value: "46" },
    { label: "מרכז סליקה בנקאי", value: "50" },
    { label: "פועלי אגודת ישראל", value: "52" },
    { label: "חסך קופת חסכון לחינוך", value: "65" },
    { label: "בנק ישראל", value: "99" },
  ]);

  const validateInputs = () => {
    const errors = [];

    if (!selectedBank) errors.push("יש לבחור בנק.");
    if (!accountNumber.trim()) errors.push("מספר חשבון נדרש.");
    if (!branchNumber.trim()) errors.push("מספר סניף נדרש.");
    if (!money.trim()) errors.push("יש להזין סכום.");
    if (!reason.trim()) errors.push(" יש להזין סיבה להעברה.");

    if (errors.length > 0) {
      errors.forEach((error, index) => {
        setTimeout(() => {
          Toast.show({
            type: "error",
            text1: "שגיאה",
            text2: error,
            visibilityTime: 4000,
            position: "right",
            textStyle: { fontSize: 18, textAlign: "right" },
            style: { width: "90%", backgroundColor: "#ff4d4d", borderRadius: 10 },
          });
        }, index * 800); 
      });

      return false;
    }
    return true;
  };

  const handleTransfer = () => {
    handleGlobalClick();
    if (!validateInputs()) return;

    Toast.show({
      type: "success",
      text1: "הצלחה",
      text2: "העברה בוצעה בהצלחה!",
      visibilityTime: 5000,
      position: "right",
      textStyle: { fontSize: 18 },
    });
    setTimeout(() => {
      navigation.navigate("Home");
    }, 5000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>העברת כספים</Text>
      </View>

      <DropDownPicker
        open={bankOpen}
        value={selectedBank}
        items={bankItems}
        setOpen={setBankOpen}
        setValue={(callback) => {
          setSelectedBank(callback);
          handleGlobalClick();
          handleGlobalClick();
        }}
        setItems={setBankItems}
        placeholder="בחר בנק..."
        style={styles.dropdown}
        textStyle={styles.dropdownText}
      />

      <TextInput
        style={styles.input}
        placeholder="מספר חשבון"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
        onPress={()=>handleGlobalClick}
      />

      <TextInput
        style={styles.input}
        placeholder="מספר סניף"
        value={branchNumber}
        onChangeText={setBranchNumber}
        keyboardType="numeric"
        onPress={()=>handleGlobalClick}
      />
      <TextInput
        style={styles.input}
        placeholder="סכום"
        value={money}
        onChangeText={setMoney}
        keyboardType="numeric"
        onPress={()=>handleGlobalClick}
      />
      <TextInput
        style={styles.input}
        placeholder="סיבה"
        value={reason}
        onChangeText={setReason}
        onPress={()=>handleGlobalClick}
      />

      <View style={styles.buttonContainer}>
        <Button title="שליחה" onPress={handleTransfer} />
      </View>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 200,
    marginTop: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    textAlign: "center",
    marginBottom: 15,
    fontSize: 16,
    width: "100%",
    backgroundColor: "#fff",
  },
  dropdown: {
    marginBottom: 15,
    borderColor: "#ccc",
    height: 50,
  },
  dropdownText: {
    textAlign: "center",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 40,
    width: "100%",
  },
});

export default TransferScreen;

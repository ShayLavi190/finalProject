import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useUser } from "./Model2/userContext";
import Toast from "react-native-toast-message";

const SetupScreen = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const [name, setName] = useState(user.name || "");
  const [idr, setIdr] = useState(user.id || "");
  const [id, setId] = useState(user.id || "");
  const [address, setAddress] = useState(user.address || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyPhone || "");
  const [bankAccountNumber, setBankAccountNumber] = useState(user.bankAccountNumber || "");
  const [bankBranchNumber, setBankBranchNumber] = useState(user.bankBranchNumber || "");
  const [healthFundAccountNumber, setHealthFundAccountNumber] = useState(user.healthFundAccountNumber || "");

  const [bankOpen, setBankOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(user.selectedBank || "");
  const [bankItems, setBankItems] = useState([
    { label: "לאומי", value: "10" },
    { label: "פועלים", value: "12" },
    { label: "דיסקונט", value: "11" },
    { label: "מזרחי טפחות", value: "20" },
  ]);

  const [healthOpen, setHealthOpen] = useState(false);
  const [selectedhealthFund, setSelectedhealthFund] = useState(user.selectedhealthFund || "");
  const [healthItems, setHealthItems] = useState([
    { label: "מכבי", value: "מכבי" },
    { label: "כללית", value: "כללית" },
    { label: "מאוחדת", value: "מאוחדת" },
    { label: "לאומית", value: "לאומית" },
  ]);

  const validateInputs = () => {
    const errors = [];

    if (!name.trim()) errors.push("שם מלא נדרש.");
    if (!idr.trim()) errors.push("מספר זיהוי משתתף נדרש.");
    if (!idr.trim() || idr.length !== 9) errors.push("תעודת זהות חייבת להיות 9 ספרות.");
    if (!address.trim()) errors.push("כתובת מגורים נדרשת.");
    if (!phone.trim() || phone.length !== 10) errors.push("מספר טלפון חייב להיות 10 ספרות.");
    if (!emergencyPhone.trim() || emergencyPhone.length !== 10) errors.push("מספר חירום חייב להיות 10 ספרות.");
    if (!selectedBank) errors.push("נא לבחור בנק.");
    if (!bankAccountNumber.trim()) errors.push("מספר חשבון בנק נדרש.");
    if (!bankBranchNumber.trim()) errors.push("מספר סניף בנק נדרש.");
    if (!selectedhealthFund) errors.push("נא לבחור קופת חולים.");
    if (!healthFundAccountNumber.trim()) errors.push("מספר חשבון קופת חולים נדרש.");

    if (errors.length > 0) {
      errors.forEach((error, index) => {
        setTimeout(() => {
          Toast.show({
            type: "error",
            text1: "שגיאה",
            text2: error,
            visibilityTime: 4000,
            position: "top",
            textStyle: { fontSize: 18, textAlign: "right" }, 
            style: { width: "90%", backgroundColor: "#ff4d4d", borderRadius: 10, alignSelf: "flex-end" },
          });
        }, index * 800); 
      });
  
      return false;
    }
    return true;
  };

  const handleSave = () => {
    handleGlobalClick();
    if (!validateInputs()) return;
    updateUser({
      name,
      id,
      idr,
      address,
      phone,
      emergencyPhone,
      selectedBank,
      bankAccountNumber,
      bankBranchNumber,
      selectedhealthFund,
      healthFundAccountNumber,
    });

    Toast.show({
      type: "success",
      text1: "הצלחה",
      text2: "הפרטים נשמרו בהצלחה!",
      visibilityTime: 5000,
      textStyle: { fontSize: 18 },
    });

    navigation.navigate("Premission");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.card}>
        <Text style={styles.title}>הגדרה ראשונית</Text>

        <TextInput style={styles.input} placeholder="שם מלא" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="מספר זיהוי משתתף" value={id} onChangeText={(text) => /^\d*$/.test(text) && setId(text)} keyboardType="numeric" onPress={()=>handleGlobalClick}/>
        <TextInput style={styles.input} placeholder="תעודת זהות" value={idr} onChangeText={(text) => /^\d*$/.test(text) && setIdr(text)} keyboardType="numeric" onPress={()=>handleGlobalClick}/>
        <TextInput style={styles.input} placeholder="כתובת מגורים" value={address} onChangeText={setAddress} />
        <TextInput style={styles.input} placeholder="מספר טלפון" value={phone} onChangeText={(text) => /^\d*$/.test(text) && setPhone(text)} keyboardType="numeric" onPress={()=>handleGlobalClick}/>
        <TextInput style={styles.input} placeholder="טלפון חירום" value={emergencyPhone} onChangeText={(text) => /^\d*$/.test(text) && setEmergencyPhone(text)} keyboardType="numeric" onPress={()=>handleGlobalClick}/>

        <DropDownPicker
          open={bankOpen}
          value={selectedBank}
          items={bankItems}
          setOpen={(open) => {
            setBankOpen(open);
          }}
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


        <TextInput style={styles.input} placeholder="מספר חשבון בנק" value={bankAccountNumber} onChangeText={setBankAccountNumber} onPress={()=>handleGlobalClick}/>
        <TextInput style={styles.input} placeholder="מספר סניף בנק" value={bankBranchNumber} onChangeText={setBankBranchNumber} onPress={()=>handleGlobalClick}/>

        <DropDownPicker
          open={healthOpen}
          value={selectedhealthFund}
          items={healthItems}
          setOpen={setHealthOpen}
          setValue={(callback) => {
            setSelectedhealthFund(callback);
            handleGlobalClick();
            handleGlobalClick();
          }}
          setItems={setHealthItems}
          placeholder="בחר קופת חולים..."
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          onPress={()=>handleGlobalClick}
        />

        <TextInput style={styles.input} placeholder="מספר חשבון קופת חולים" value={healthFundAccountNumber} onChangeText={setHealthFundAccountNumber} onPress={()=>handleGlobalClick} />

        <View style={styles.buttonContainer}>
          <Button title="שמירה" onPress={handleSave} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="שמירה" onPress={()=>{navigation.navigate("Home");}} />
        </View>
      </View>

      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  card: { width: "90%", maxWidth: 800, backgroundColor: "#fff", borderRadius: 10, padding: 20, elevation: 5 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 12, fontSize: 16, textAlign: "center", marginBottom: 15 },
  dropdown: { marginBottom: 15, borderColor: "#ccc", height: 50 },
  dropdownText: { textAlign: "center", fontSize: 16 },
  buttonContainer: { marginTop: 20 },
});

export default SetupScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useUser } from "./Model2/userContext";
import Toast from "react-native-toast-message";

const SetupScreen = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const [name, setName] = useState(user.name || "");
  const [idr, setIdr] = useState(user.idr || "");
  const [id, setId] = useState(user.id || "");
  const [address, setAddress] = useState(user.address || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyPhone || "");
  const [bankAccountNumber, setBankAccountNumber] = useState(user.bankAccountNumber || "");
  const [bankBranchNumber, setBankBranchNumber] = useState(user.bankBranchNumber || "");
  const [healthFundAccountNumber, setHealthFundAccountNumber] = useState(user.healthFundAccountNumber || "");

  // Important: Set these to different values to avoid conflict
  const [bankOpen, setBankOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(user.selectedBank || "");
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
    if (!idr.trim() || id.length !== 9) errors.push("תעודת זהות חייבת להיות 9 ספרות.");
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

  // Structure the form to solve dropdown issues
  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>הגדרה ראשונית</Text>
          <Text style={styles.subtitle}>כדי להתחבר למערכת יש למלא את כלל הפרטים הבאים. חשוב להדגיש שהפרטיכם לא ישמרו ולא יעשה בהם שימוש.</Text>
          
          {/* Personal Info Section */}
          <TextInput style={styles.input} placeholder="שם מלא" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="מספר זיהוי משתתף" value={idr} onChangeText={(text) => /^\d*$/.test(text) && setIdr(text)} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="תעודת זהות" value={id} onChangeText={(text) => /^\d*$/.test(text) && setId(text)} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="כתובת מגורים" value={address} onChangeText={setAddress} />
          <TextInput style={styles.input} placeholder="מספר טלפון" value={phone} onChangeText={(text) => /^\d*$/.test(text) && setPhone(text)} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="טלפון חירום" value={emergencyPhone} onChangeText={(text) => /^\d*$/.test(text) && setEmergencyPhone(text)} keyboardType="numeric" />
          
          {/* Bank Section */}
          <View style={styles.sectionContainer}>
            {/* Bank Dropdown */}
            <View style={styles.dropdownSection}>
              <DropDownPicker
                open={bankOpen}
                value={selectedBank}
                items={bankItems}
                setOpen={(open) => {
                  setBankOpen(open);
                  // Close other dropdown if this one is opening
                  if (open) setHealthOpen(false);
                }}
                setValue={setSelectedBank}
                setItems={setBankItems}
                placeholder="בחר בנק..."
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                dropDownContainerStyle={styles.dropdownContainer}
                listMode="SCROLLVIEW"
                zIndex={3000}
                zIndexInverse={1000}
                onPress={handleGlobalClick}
              />
            </View>
            
            {/* Only show these inputs if bank dropdown is closed */}
            {!bankOpen && (
              <>
                <TextInput 
                  style={styles.input} 
                  placeholder="מספר חשבון בנק" 
                  value={bankAccountNumber} 
                  onChangeText={setBankAccountNumber} 
                />
                <TextInput 
                  style={styles.input} 
                  placeholder="מספר סניף בנק" 
                  value={bankBranchNumber} 
                  onChangeText={setBankBranchNumber} 
                />
              </>
            )}
          </View>

          {/* Health Fund Section - Only show if bank dropdown is closed */}
          {!bankOpen && (
            <View style={styles.sectionContainer}>
              {/* Health Fund Dropdown */}
              <View style={styles.dropdownSection}>
                <DropDownPicker
                  open={healthOpen}
                  value={selectedhealthFund}
                  items={healthItems}
                  setOpen={(open) => {
                    setHealthOpen(open);
                    // Close other dropdown if this one is opening
                    if (open) setBankOpen(false);
                  }}
                  setValue={setSelectedhealthFund}
                  setItems={setHealthItems}
                  placeholder="בחר קופת חולים..."
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  dropDownContainerStyle={styles.dropdownContainer}
                  listMode="SCROLLVIEW"
                  zIndex={2000}
                  zIndexInverse={2000}
                  onPress={handleGlobalClick}
                />
              </View>
              
              {/* Only show this input if health dropdown is closed */}
              {!healthOpen && (
                <TextInput 
                  style={styles.input} 
                  placeholder="מספר חשבון קופת חולים" 
                  value={healthFundAccountNumber} 
                  onChangeText={setHealthFundAccountNumber} 
                />
              )}
            </View>
          )}

          {/* Button - Only show if both dropdowns are closed */}
          {!bankOpen && !healthOpen && (
            <View style={styles.buttonContainer}>
              <Button title="שמירה" onPress={handleSave} />
            </View>
          )}
        </View>
      </ScrollView>

      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },  
  card: { 
    alignSelf: "center",
    width: "90%", 
    maxWidth: 800, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    padding: 20, 
    elevation: 5,
  },
  
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 15, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 10 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 5, 
    padding: 12, 
    fontSize: 16, 
    textAlign: "center", 
    marginBottom: 15,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  dropdownSection: {
    marginBottom: 15,
    height: 50,
    zIndex: 5000,
  },
  dropdown: { 
    borderColor: "#ccc",
  },
  dropdownContainer: {
    borderColor: "#ccc",
    elevation: 5, // for Android
    shadowColor: "#000", // for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownText: { 
    textAlign: "center", 
    fontSize: 16 
  },
  buttonContainer: { 
    marginTop: 20,
  },
});

export default SetupScreen;
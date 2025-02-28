import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useUser } from "./Model2/userContext";


const SetupScreen = ({ navigation,handleGlobalClick }) => {
  const { user, updateUser } = useUser(); 
  const [name, setName] = useState(user.name ? user.name : "");
  const [id, setId] = useState(user.id ? user.id : "");
  const [address, setAddress] = useState(user.address ? user.address : "");
  const [phone, setPhone] = useState(user.phone ? user.phone : "");
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyPhone ? user.emergencyPhone : "");
  const [bankAccountNumber, setBankAccountNumber] = useState(user.bankAccountNumber ? user.bankAccountNumber : "");
  const [bankBranchNumber, setBankBranchNumber] = useState(user.bankBranchNumber ? user.bankBranchNumber : "");
  const [selectedBank, setSelectedBank] = useState(user.selectedBank ? user.selectedBank : "");
  const [selectedhealthFund, setSelectedhealthFund] = useState(user.selectedhealthFund ? user.selectedhealthFund : "");
  const [healthFundAccountNumber, setHealthFundAccountNumber] = useState(user.healthFundAccountNumber ? user.healthFundAccountNumber : "");
  
  const validateInputs = () => {
    const errors = [];

    if (!name.trim()) errors.push("שם מלא נדרש.");
    if (!id.trim() || id.length !== 9) errors.push("תעודת זהות חייבת להיות 9 ספרות.");
    if (!address.trim()) errors.push("כתובת מגורים נדרשת.");
    if (!phone.trim() || phone.length !== 10) errors.push("מספר טלפון חייב להיות באורך 10 ספרות.");
    if (!emergencyPhone.trim() || emergencyPhone.length !== 10)
      errors.push("מספר טלפון חירום חייב להיות באורך 10 ספרות.");
    if (!selectedBank) errors.push("נא לבחור בנק.");
    if (!bankAccountNumber.trim()) errors.push("מספר חשבון בנק נדרש.");
    if (!bankBranchNumber.trim()) errors.push("מספר סניף בנק נדרש.");
    if (!selectedhealthFund) errors.push("נא לבחור קופת חולים.");
    if (!healthFundAccountNumber.trim()) errors.push("מספר חשבון קופת חולים נדרש.");

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;
    else {
      updateUser({
        name,
        id,
        address,
        phone,
        emergencyPhone,
        selectedBank,
        bankAccountNumber,
        bankBranchNumber,
        selectedhealthFund,
        healthFundAccountNumber,
      });
      Alert.alert("הפרטים נשמרו בהצלחה");
      navigation.navigate("Premission");
    }
  };  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <Text style={styles.title}>הגדרה ראישונית</Text>
        <Text style={styles.subtitle}>
          כדי שהרובוט המטפל יוכל להפעיל את שירותיו לטובך נצטרך את פרטיך האישיים לכך. כלל המידע נשמר בצורה מאובטחת ואינו
          משותף עם שום גורם חיצוני ללא ביצוע שירות יעודי.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="שם מלא"
          value={name}
          onChangeText={(value) => {
            setName(value);
            handleGlobalClick();
          }}
          onPress={handleGlobalClick}
        />
        <TextInput
          style={styles.input}
          placeholder="תעודת זהות"
          value={id}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) setId(text); 
          }}
          keyboardType="numeric"
          onPress={handleGlobalClick}
        />
        <TextInput style={styles.input} placeholder="   כתובת מגורים במבנה: כתובת ,דירה אם יש, ישוב, מיקוד " value={address} onChangeText={setAddress} onPress={handleGlobalClick} />
        <TextInput
          style={styles.input}
          placeholder="מספר טלפון"
          value={phone}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) setPhone(text);
          }}
          keyboardType="numeric"
          onPress={handleGlobalClick}
        />
        <TextInput
          style={styles.input}
          placeholder="מספר טלפון של איש קשר למקרה חירום"
          value={emergencyPhone}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) setEmergencyPhone(text);
          }}
          keyboardType="numeric"
          onPress={handleGlobalClick}
        />
        <RNPickerSelect
          style={pickerSelectStyles}
          placeholder={{ label: "בחר בנק...", value: "" }}
          onValueChange={(value) => {setSelectedBank(value);handleGlobalClick();}}
          value={selectedBank}
          items={[
            { label: 'לאומי', value: '10' },
            { label: 'פועלים', value: '12' },
            { label: 'דיסקונט', value: '11' },
            { label: 'יהב', value: '4' },
            { label: 'בנק הדואר', value: '9' },
            { label: 'אגוד', value: '13' },
            { label: 'אוצר החייל', value: '14' },
            { label: 'מרכנתיל', value: '17' },
            { label: 'Citibank N.A', value: '22' },
            { label: 'מזרחי טפחות', value: '20' },
            { label: 'HSBC Bank plc', value: '23' },
            { label: 'יובנק בע"מ', value: '26' },
            { label: 'Barclays Bank PLC', value: '27' },
            { label: 'בנק למסחר בע"מ', value: '30' },
            { label: 'הבינלאומי הראשון לישראל', value: '31' },
            { label: 'SBI State Bank of India', value: '39' },
            { label: 'מסד', value: '46' },
            { label: 'מרכז סליקה בנקאי', value: '50' },
            { label: 'פועלי אגודת ישראל', value: '52' },
            { label: 'חסך קופת חסכון לחינוך', value: '65' },
            { label: 'בנק ישראל', value: '99' },
        ]}
          Icon={() => <Icon name="arrow-drop-down" size={24} color="gray" />}
        />
        <TextInput
          style={styles.input}
          placeholder="מספר חשבון בנק"
          value={bankAccountNumber}
          onChangeText={setBankAccountNumber}
          onPress={handleGlobalClick}
        />
        <TextInput
          style={styles.input}
          placeholder="מספר סניף בנק"
          value={bankBranchNumber}
          onChangeText={setBankBranchNumber}
          onPress={handleGlobalClick}
        />
        <RNPickerSelect
          style={pickerSelectStyles}
          placeholder={{ label: "בחר קופת חולים", value: "" }}
          onValueChange={(value) => {setSelectedhealthFund(value); handleGlobalClick();}}
          value={selectedhealthFund} 
          items={[
            { label: 'מכבי', value: 'מכבי' },
            { label: 'כללית', value: 'כללית' },
            { label: 'מאוחדת', value: 'מאוחדת' },
            { label: 'לאומית', value: 'לאומית' }
        ]}
          Icon={() => <Icon name="arrow-drop-down" size={24} color="gray" onPress={handleGlobalClick} /> }
        />
        <TextInput
          style={styles.input}
          placeholder="מספר חשבון קופת חולים"
          value={healthFundAccountNumber}
          onChangeText={setHealthFundAccountNumber}
          onPress={handleGlobalClick}
        />
        <View style={styles.buttonContainer}>
          <Button title="שמירה" onPress={() =>{handleSave(); handleGlobalClick();}}  />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  card: {
    width: '90%',
    maxWidth: 800,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },  
  buttonContainer: {
    marginTop: 20,
  },
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      marginBottom: 15,
      backgroundColor: '#fff',
      color: '#333',
      paddingRight: 30,
      textAlign: 'center',
    },
    inputAndroid: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      marginBottom: 15,
      backgroundColor: '#fff',
      color: '#333',
      paddingRight: 30,
    },
    iconContainer: {
      top: 10,
      right: 15,
    },
  });
  

export default SetupScreen;

import React, { useState, useEffect } from "react";
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
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../server/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData, decryptData } from "../server/utils";

const SetupScreen = ({ navigation,handleGlobalClick }) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankBranchNumber, setBankBranchNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedhealthFund, setSelectedhealthFund] = useState("");
  const [healthFundAccountNumber, setHealthFundAccountNumber] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("currentUserId");
        if (userId) {
          const userRef = doc(db, "users", userId);
          const userSnapshot = await getDoc(userRef);
  
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const secretKey = "model1";
            if (userData.encryptedData) {
              const decryptedData = decryptData(userData.encryptedData, secretKey);
              setName(decryptedData.name || "");
              setAddress(decryptedData.address || "");
              setPhone(decryptedData.phone || "");
              setEmergencyPhone(decryptedData.emergencyPhone || "");
              setBankAccountNumber(decryptedData.bankAccountNumber || "");
              setBankBranchNumber(decryptedData.bankBranchNumber || "");
              setSelectedBank(decryptedData.selectedBank || "");
              setSelectedhealthFund(decryptedData.selectedhealthFund || "");
              setHealthFundAccountNumber(decryptedData.healthFundAccountNumber || "");
            }
            setId(userData.id || ""); 
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data.");
      }
    };
  
    fetchUserData();
  }, []);
  

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
    const secretKey = "model1"; 
    const encryptedData = encryptData(
      {
        name,
        address,
        phone,
        emergencyPhone,
        bankAccountNumber,
        bankBranchNumber,
        selectedBank,
        selectedhealthFund,
        healthFundAccountNumber,
      },
      secretKey
    );
    const userData = {
      id, 
      encryptedData, 
    };
  
    try {
      const userRef = doc(db, "users", id);
      const userSnapshot = await getDoc(userRef);
  
      if (userSnapshot.exists()) {
        await setDoc(userRef, userData, { merge: true });
        Alert.alert("Success", "הפרטים עודכנו בהצלחה!");
      } else {
        await setDoc(userRef, userData);
        Alert.alert("Success", "הפרטים נשמרו בהצלחה!");
      }
      await AsyncStorage.setItem("currentUserId", id);
      navigation.navigate("Premission");
    } catch (error) {
      console.error("Error saving user:", error);
      Alert.alert("Error", "שגיאה בשמירת הפרטים.");
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

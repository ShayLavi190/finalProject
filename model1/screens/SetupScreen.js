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

  const [bankOpen, setBankOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(user.selectedBank || "");
  const [bankItems, setBankItems] = useState([
      { label: "Bank Leumi", value: "10" },
      { label: "Bank Hapoalim", value: "12" },
      { label: "Israel Discount Bank", value: "11" },
      { label: "Yahav Bank", value: "4" },
      { label: "Postal Bank", value: "9" },
      { label: "Igud Bank", value: "13" },
      { label: "Otsar HaChayal Bank", value: "14" },
      { label: "Mercantile Bank", value: "17" },
      { label: "Citibank N.A", value: "22" },
      { label: "Mizrahi Tefahot Bank", value: "20" },
      { label: "HSBC Bank plc", value: "23" },
      { label: "U.Bank Ltd.", value: "26" },
      { label: "Barclays Bank PLC", value: "27" },
      { label: "Bank for Trade Ltd.", value: "30" },
      { label: "First International Bank of Israel", value: "31" },
      { label: "SBI State Bank of India", value: "39" },
      { label: "Masad Bank", value: "46" },
      { label: "Banking Clearing Center", value: "50" },
      { label: "Poalei Agudat Israel Bank", value: "52" },
      { label: "Hessed Savings Fund for Education", value: "65" },
      { label: "Bank of Israel", value: "99" },
  ]);

  const [healthOpen, setHealthOpen] = useState(false);
  const [selectedhealthFund, setSelectedhealthFund] = useState(user.selectedhealthFund || "");
  const [healthItems, setHealthItems] = useState([
      { label: "Maccabi Healthcare Services", value: "Maccabi Healthcare Services" },
      { label: "Clalit Health Services", value: "Clalit Health Services" },
      { label: "Meuhedet Health Services", value: "Meuhedet Health Services" },
      { label: "Leumit Health Services", value: "Leumit Health Services" },
  ]);

  const validateInputs = () => {
    const errors = [];

    if (!name.trim()) errors.push("Full name is required.");
    if (!idr.trim()) errors.push("Participant ID number is required.");
    if (!idr.trim() || idr.length !== 9) errors.push("ID number must be 9 digits.");
    if (!address.trim()) errors.push("Home address is required.");
    if (!phone.trim() || phone.length !== 10) errors.push("Phone number must be 10 digits.");
    if (!emergencyPhone.trim() || emergencyPhone.length !== 10) errors.push("Emergency phone number must be 10 digits.");
    if (!selectedBank) errors.push("Please select a bank.");
    if (!bankAccountNumber.trim()) errors.push("Bank account number is required.");
    if (!bankBranchNumber.trim()) errors.push("Bank branch number is required.");
    if (!selectedhealthFund) errors.push("Please select a health fund.");

    if (errors.length > 0) {
      errors.forEach((error, index) => {
        setTimeout(() => {
          Toast.show({
            type: "error",
            text1: "Error",
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
      text1: "success",
      text2: "Details saved successfully!",
      visibilityTime: 5000,
      textStyle: { fontSize: 18 },
    });

    navigation.navigate("Premission");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 30, paddingHorizontal: 20 }}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Initial Setup</Text>
          <Text style={styles.subtitle}>To connect to the system, please fill in all the following details. It's important to emphasize that your information will not be saved and will not be used.</Text>

          {/* Personal Info Section */}
          <TextInput style={styles.input} placeholder="Full name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Participant ID number" value={id} onChangeText={(text) => /^\d*$/.test(text) && setId(text)} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="ID number" value={idr} onChangeText={(text) => /^\d*$/.test(text) && setIdr(text)} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Home address" value={address} onChangeText={setAddress} />
          <TextInput style={styles.input} placeholder="Phone number" value={phone} onChangeText={(text) => /^\d*$/.test(text) && setPhone(text)} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Emergency phone" value={emergencyPhone} onChangeText={(text) => /^\d*$/.test(text) && setEmergencyPhone(text)} keyboardType="numeric" />

          {/* Bank Section */}
          <View style={{ zIndex: 5000 }}>
            <DropDownPicker
              open={bankOpen}
              value={selectedBank}
              items={bankItems}
              setOpen={(open) => {
                setBankOpen(open);
                if (open) setHealthOpen(false);
              }}
              setValue={setSelectedBank}
              setItems={setBankItems}
              placeholder="Select bank..."
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropDownContainerStyle={styles.dropdownContainer}
              listMode="SCROLLVIEW"
              zIndex={5000}
              zIndexInverse={0}
              onPress={handleGlobalClick}
              dropDownDirection="AUTO"
            />
          </View>

          {!bankOpen && (
            <>
              <TextInput style={styles.input} placeholder="Bank account number" value={bankAccountNumber} onChangeText={setBankAccountNumber} />
              <TextInput style={styles.input} placeholder="Bank branch number" value={bankBranchNumber} onChangeText={setBankBranchNumber} />
            </>
          )}

          {/* Health Fund Section */}
          {!bankOpen && (
            <View style={{ zIndex: 4000 }}>
              <DropDownPicker
                open={healthOpen}
                value={selectedhealthFund}
                items={healthItems}
                setOpen={(open) => {
                  setHealthOpen(open);
                  if (open) setBankOpen(false);
                }}
                setValue={setSelectedhealthFund}
                setItems={setHealthItems}
                placeholder="Select health fund..."
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                dropDownContainerStyle={styles.dropdownContainer}
                listMode="SCROLLVIEW"
                zIndex={4000}
                zIndexInverse={0}
                onPress={handleGlobalClick}
                dropDownDirection="AUTO"
              />
            </View>
          )}

          {!healthOpen && !bankOpen && (
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={handleSave} />
            </View>
          )}
        </View>
      </ScrollView>
      <Text style={styles.subtitle}>
        This is the screen where you can fill in your personal details and connect to the system. This model doesn't contain any textual or vocal cues.
      </Text>
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
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
  dropdown: {
    borderColor: "#ccc",
  },
  dropdownContainer: {
    borderColor: "#ccc",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownText: {
    textAlign: "center",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default SetupScreen;

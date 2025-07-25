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
    { label: "Leumi", value: "10" },
    { label: "Poalim", value: "12" },
    { label: "Discont", value: "11" },
    { label: "Yahav", value: "4" },
    { label: "Post Bank", value: "9" },
    { label: "Igod", value: "13" },
    { label: "Otzar Hahail", value: "14" },
    { label: "Mercantil", value: "17" },
    { label: "Citibank N.A", value: "22" },
    { label: "Mizrahi Tphahon", value: "20" },
    { label: "HSBC Bank plc", value: "23" },
    { label: "Ubank Inc", value: "26" },
    { label: "Barclays Bank PLC", value: "27" },
  ]);

  const validateInputs = () => {
    const errors = [];

    if (!selectedBank) errors.push("You must select a bank.");
    if (!accountNumber.trim()) errors.push("Account number is required.");
    if (!branchNumber.trim()) errors.push("Branch number is required.");
    if (!money.trim()) errors.push("Amount is required.");
    if (!reason.trim()) errors.push("Reason is required.");

    if (errors.length > 0) {
      errors.forEach((error, index) => {
        setTimeout(() => {
          Toast.show({
            type: "error",
            text1: "Error",
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
      text1: "success",
      text2: "Transfer completed successfully.",
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
        <Text style={styles.title}>Money Transfer</Text>
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
        placeholder="Select Bank"
        style={styles.dropdown}
        textStyle={styles.dropdownText}
      />

      <TextInput
        style={styles.input}
        placeholder="Account Number"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
        onPress={()=>handleGlobalClick}
      />

      <TextInput
        style={styles.input}
        placeholder="Branch Number"
        value={branchNumber}
        onChangeText={setBranchNumber}
        keyboardType="numeric"
        onPress={()=>handleGlobalClick}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={money}
        onChangeText={setMoney}
        keyboardType="numeric"
        onPress={()=>handleGlobalClick}
      />
      <TextInput
        style={styles.input}
        placeholder="Reason for Transfer"
        value={reason}
        onChangeText={setReason}
        onPress={()=>handleGlobalClick}
      />

      <View style={styles.buttonContainer}>
        <Button title="Send" onPress={handleTransfer} />
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

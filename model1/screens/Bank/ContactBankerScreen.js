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

const ContactBankerScreen = ({ navigation, handleGlobalClick }) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [subjectItems, setSubjectItems] = useState([
    { label: "בקשה למידע נוסף", value: "בקשה למידע נוסף" },
    { label: "תלונה", value: "תלונה" },
    { label: "שירות לקוחות", value: "שירות לקוחות" },
    { label: "פעולה", value: "פעולה" },
    { label: "הגדלת מסגרת", value: "הגדלת מסגרת" },
    { label: "הלוואה", value: "הלוואה" },
    { label: "אחר", value: "אחר" },
  ]);

  const validateInputs = () => {
    const errors = [];

    if (!subject) errors.push("⚠️ יש לבחור נושא.");
    if (!description.trim()) errors.push("⚠️ יש להזין תיאור.");

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
        }, index * 500); 
      });

      return false;
    }
    return true;
  };

  /** 🔹 שליחת הטופס */
  const handleSubmit = () => {
    handleGlobalClick();
    if (!validateInputs()) return;

    Toast.show({
      type: "success",
      text1: "הצלחה",
      text2: "ההודעה נשלחה בהצלחה!",
      visibilityTime: 5000,
      position: "right",
      textStyle: { fontSize: 18 },
    });

    setTimeout(() => {
      navigation.navigate("Bank");
    }, 5000); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>צור קשר עם הבנקאי</Text>
      </View>

      <DropDownPicker
        open={subjectOpen}
        value={subject}
        items={subjectItems}
        setOpen={(open) => {
          setSubjectOpen(open);
        }}
        setValue={(callback) => {
          setSubject(callback);
          handleGlobalClick();
          handleGlobalClick();
        }}
        setItems={setSubjectItems}
        placeholder="בחר נושא..."
        style={styles.dropdown}
        textStyle={styles.dropdownText}
      />

      <TextInput
        style={[styles.desc, styles.textRight]}
        placeholder="תיאור"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        onPress={handleGlobalClick}
      />

      <View style={styles.buttonContainer}>
        <Button title="שליחה" onPress={() => { handleSubmit(); handleGlobalClick(); }} />
      </View>

      {/* Toast Component */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  desc: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    height: 100,
    marginBottom: 15,
    fontSize: 16,
    width: "100%",
    backgroundColor: "#fff",
  },
  textRight: {
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 40,
    width: "100%",
  },
});

export default ContactBankerScreen;

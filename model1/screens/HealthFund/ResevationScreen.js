import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";

const AppointmentScreen = ({ navigation, handleGlobalClick }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");

  const [typeOpen, setTypeOpen] = useState(false);
  const [typeItems, setTypeItems] = useState([
    { label: "בדיקה כללית", value: "בדיקה כללית" },
    { label: "רופא משפחה", value: "רופא משפחה" },
    { label: "בדיקות דם", value: "בדיקות דם" },
  ]);

  const handleSchedule = () => {
    if (!time || !date || !appointmentType) {
      ["תאריך נדרש.", "שעה נדרשת.", "בחר סוג תור"].forEach((error, index) => {
        setTimeout(() => {
          Toast.show({
            type: "error",
            text1: "⚠️ שגיאה",
            text2: error,
            visibilityTime: 4000,
            position: "right",
            textStyle: { fontSize: 18 },
          });
        }, index * 800);
      });
      return;
    }

    handleGlobalClick("קביעת תור");
    Toast.show({
      type: "success",
      text1: "✅ הצלחה",
      text2: "אישור התור ישלח לטלפון הנייד שלך.",
      visibilityTime: 5000,
      position: "right",
      textStyle: { fontSize: 18 },
    });

    setTimeout(() => {
      navigation.navigate("HealthFund");
    }, 5000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>קביעת תור</Text>
      </View>

      {/* בורר תאריך */}
      <Text style={styles.label}>בחר תאריך</Text>
      <input
        type="date"
        style={styles.input}
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          handleGlobalClick("תאריך נבחר");
        }}
      />

      {/* בורר שעה */}
      <Text style={styles.label}>בחר שעה</Text>
      <input
        type="time"
        style={styles.input}
        value={time}
        onChange={(e) => {
          setTime(e.target.value);
          handleGlobalClick("שעה נבחרה");
        }}
      />

      <Text style={styles.label}>בחר סוג תור</Text>
      <DropDownPicker
        open={typeOpen}
        value={appointmentType}
        items={typeItems}
        setOpen={setTypeOpen}
        setValue={(callback) => {
          setAppointmentType(callback);
          handleGlobalClick();
          handleGlobalClick();
        }}
        setItems={setTypeItems}
        placeholder="בחר סוג תור..."
        style={styles.dropdown}
        textStyle={styles.dropdownText}
      />

      <View style={styles.buttonContainer}>
        <Button title="הזמנה" onPress={handleSchedule} />
      </View>

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
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    width: "100%",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
    textAlign: "center",
    marginBottom: 15,
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

export default AppointmentScreen;

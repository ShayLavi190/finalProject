import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import { useUser } from "./Model2/userContext";

const PremissionScreen = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const [permissions, setPermissions] = useState({
    healthMonitoring: user.permissions.healthMonitoring
      ? user.permissions.healthMonitoring
      : false,
    emergencyContacts: user.permissions.emergencyContacts
      ? user.permissions.emergencyContacts
      : false,
    shareHealthInfo: user.permissions.shareHealthInfo
      ? user.permissions.shareHealthInfo
      : false,
    robotTracking: user.permissions.robotTracking
      ? user.permissions.robotTracking
      : false,
    automatedTasks: user.permissions.automatedTasks
      ? user.permissions.automatedTasks
      : false,
    smartHomeControl: user.permissions.smartHomeControl
      ? user.permissions.smartHomeControl
      : false,
    financialActions: user.permissions.financialActions
      ? user.permissions.financialActions
      : false,
    socialInteraction: user.permissions.socialInteraction
      ? user.permissions.socialInteraction
      : false,
    cameraAccess: user.permissions.cameraAccess
      ? user.permissions.cameraAccess
      : false,
    voiceRecognition: user.permissions.voiceRecognition
      ? user.permissions.voiceRecognition
      : false,
    publicServices: user.permissions.publicServices
      ? user.permissions.publicServices
      : false,
    familyUpdates: user.permissions.familyUpdates
      ? user.permissions.familyUpdates
      : false,
    customization: user.permissions.customization
      ? user.permissions.customization
      : false,
    maintenance: user.permissions.maintenance
      ? user.permissions.maintenance
      : false,
  });

  const permissionLabels = {
    healthMonitoring: "מעקב אחר מצב בריאותי",
    emergencyContacts: "גישה לאנשי קשר לשיחות חירום",
    shareHealthInfo: "שיתוף מידע עם גורמי בריאות",
    robotTracking: "מעקב אחר תנועת הלקוח",
    automatedTasks: "ביצוע משימות אוטומטיות",
    smartHomeControl: "שליטה על מערכות בית חכם",
    financialActions: "ביצוע פעולות כלכליות",
    socialInteraction: "אינטראקציה חברתית",
    cameraAccess: "גישה למצלמה",
    voiceRecognition: "זיהוי קולי",
    publicServices: "תיאום עם שירותים ציבוריים",
    familyUpdates: "עדכונים למשפחה",
    customization: "איסוף מידע על שימוש בתוכנה",
    maintenance: "תחזוקה ועדכונים אוטומטיים",
  };

  const toggleSwitch = (key) => {
    handleGlobalClick();
    setPermissions((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleSave = async () => {
    updateUser({
      permissions,
    });
    Alert.alert("ההעדפות נשמרו בהצלחה");
    navigation.navigate("Home");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>שמור העדפות למערכת</Text>
        <Text style={styles.description}>
          ניתן לבחור אילו הרשאות לתת לרובוט. יש לשים לב שביטול הרשאה מסוימת עשוי
          להגביל את תפקוד הרובוט במערכות הקשורות לה.
        </Text>
        {Object.keys(permissions).map((key) => (
          <View style={styles.toggleRow} key={key}>
            <Switch
              value={permissions[key]}
              onValueChange={() => toggleSwitch(key)}
            />
            <Text style={styles.label}>{permissionLabels[key]}</Text>
          </View>
        ))}
        <View style={styles.buttonContainer}>
          <Button
            title="שמירה"
            onPress={() => {
              handleSave();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    flex: 1,
    textAlign: "right",
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default PremissionScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../server/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

const PremissionScreen = ({ navigation,handleGlobalClick }) => {
  const [permissions, setPermissions] = useState({
    healthMonitoring: false,
    emergencyContacts: false,
    shareHealthInfo: false,
    robotTracking: false,
    automatedTasks: false,
    smartHomeControl: false,
    financialActions: false,
    socialInteraction: false,
    cameraAccess: false,
    voiceRecognition: false,
    publicServices: false,
    familyUpdates: false,
    customization: false,
    maintenance: false,
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

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const userId = await AsyncStorage.getItem('currentUserId');
        if (!userId) {
          Alert.alert('Error', 'User ID not found. Please log in again.');
          navigation.navigate('Setup');
          return;
        }

        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          if (userData.permissions) {
            setPermissions(userData.permissions);
          }
        } else {
          Alert.alert("Info", "No existing permissions found for this user.");
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
        Alert.alert("Error", "Failed to fetch permissions.");
      }
    };

    fetchPermissions();
  }, [navigation]);

  const handleSave = async () => {
    try {
      const userId = await AsyncStorage.getItem('currentUserId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        navigation.navigate('Setup');
        return;
      }

      const userRef = doc(db, "users", userId);
      await setDoc(
        userRef,
        { permissions },
        { merge: true }
      );
      Alert.alert("Success", "Permissions updated successfully!");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error saving permissions:", error);
      Alert.alert("Error", "Failed to save permissions.");
    }
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
            <Switch value={permissions[key]} onValueChange={() => toggleSwitch(key)} />
            <Text style={styles.label}>{permissionLabels[key]}</Text>
          </View>
        ))}
        <View style={styles.buttonContainer}>
          <Button title="שמירה" onPress={ () => {handleSave();handleGlobalClick()}} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default PremissionScreen;

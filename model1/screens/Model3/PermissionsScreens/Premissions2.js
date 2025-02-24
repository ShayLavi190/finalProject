import React, { useState, useEffect,useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Modal,
  TouchableOpacity,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import * as Animatable from "react-native-animatable";
import { useUser } from "../../Model2/userContext";
import LottieView from "lottie-react-native";

const Premissions23 = ({ navigation,handleGlobalClick }) => {
  const { user, updateUser } = useUser(); 
  const [maintenance, setMaintenance] = useState(false);
  const [customization, setCustomization] = useState(false);
  const [voiceRecognition, setVoiceRecognition] = useState(false);
  const [robotTracking, setRobotTracking] = useState(false);
  const [cameraAccess, setCameraAccess] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  const modalRef = useRef(null); 
  const animatableRef = useRef(null); 
  
  useEffect(() => {
    setMaintenance(user.permissions.maintenance);
    setCustomization(user.permissions.customization);
    setRobotTracking(user.permissions.robotTracking);
    setVoiceRecognition(user.permissions.voiceRecognition);
    setCameraAccess(user.permissions.cameraAccess)
  }, [user]);

  const handleIconPress = (field) => {
    const fieldExplanations = {
        cameraAccess: "ללא הרשאה זו לא נוכל לבצע המון פעולות כגון מעקב אחרי הלקוח, זיהוי מקרי חירום או תזוז של הרובוט. מומלץ להפעיל",
        voiceRecognition: "ללא הרשאה זו לא נוכל לנהל איתך דו שיח",
        robotTracking: "ללא הרשאה זו הרובוט לא יוכל לעקוב פיזית אחריך",
        customization: "שדה זה הוא חובה לטובת הניסוי",
        maintenance:"ללא הרשאה זו תצטרכ/י לעשות את עידכוני התוכנה בצורה ידנית"
    };
    setExplanation(fieldExplanations[field]);
    setIconAnimation("pulse");
    setModalVisible(true);
    handleGlobalClick();
  };

  const handleMoveForward = () => {
    animatableRef.current
    .animate("fadeOutLeft", 500) 
    .then(() => {
      updateUser({
        ...user,
        permissions: {
          ...user.permissions,
          cameraAccess: cameraAccess,
          robotTracking: robotTracking,
          voiceRecognition: voiceRecognition,
          customization: customization,
          maintenance: maintenance
        },
      });
      navigation.navigate("Premissions33");
    });
  };
  const handleGoBack = () => {
    animatableRef.current
    .animate("fadeOutRight", 500) 
    .then(() => {
        updateUser({
            ...user,
            permissions: {
              ...user.permissions,
              cameraAccess: cameraAccess,
              robotTracking: robotTracking,
              voiceRecognition: voiceRecognition,
              customization: customization,
              maintenance: maintenance
            },
          });
      navigation.navigate("Premissions13"); 
    });
  };
    const handleLottiePress = () => {
      Alert.alert("play video")
    }
  const closeModal = () => {
    modalRef.current
      .animate("fadeOutDown", 500)
      .then(() => setModalVisible(false));
    setIconAnimation("");
    handleGlobalClick();
  };
  

  return (
    <Animatable.View
    animation="fadeInDown" 
    duration={2000} 
    style={{ flex: 1 }}
    ref={animatableRef}
    >
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <Text style={styles.title}>הגדרת הרשאות למערכת הרובוט המטפל</Text>
        <Text style={styles.subtitle}>
          כדי שהרובוט המטפל יוכל להפעיל את שירותיו לטובך נצטרך את אישורך לפעולות מסויימות . כלל המידע נשמר בצורה מאובטחת ואינו
          משותף עם שום גורם חיצוני ללא ביצוע שירות ייעודי.
        </Text>

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => handleIconPress("cameraAccess")}>
            <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
              <Entypo name="light-bulb" size={40} color="yellow" />
            </Animatable.View>
          </TouchableOpacity>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={cameraAccess ? "#f5dd4b" : "#f4f3f4"}
                width = "200"
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {handleGlobalClick();setCameraAccess((prevState) => !prevState);}}
                value={cameraAccess}
            />
            <Text style={styles.input}>גישה למצלמה</Text>
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => handleIconPress("robotTracking")}>
            <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
              <Entypo name="light-bulb" size={40} color="yellow" />
            </Animatable.View>
          </TouchableOpacity>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={robotTracking ? "#f5dd4b" : "#f4f3f4"}
                width = "200"
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {handleGlobalClick();setRobotTracking((prevState) => !prevState);}}
                value={robotTracking}
            />
            <Text style={styles.input}>מעקב פיזי של הרובוט אחריך</Text>
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => handleIconPress("voiceRecognition")}>
            <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
              <Entypo name="light-bulb" size={40} color="yellow" />
            </Animatable.View>
          </TouchableOpacity>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={voiceRecognition ? "#f5dd4b" : "#f4f3f4"}
                width = "200"
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {handleGlobalClick();setVoiceRecognition((prevState) => !prevState);}}
                value={voiceRecognition}
            />
            <Text style={styles.input}>גישה למיקרופון וזיהוי קולי</Text>
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => handleIconPress("customization")}>
            <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
              <Entypo name="light-bulb" size={40} color="yellow" />
            </Animatable.View>
          </TouchableOpacity>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={customization ? "#f5dd4b" : "#f4f3f4"}
                width = "200"
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {handleGlobalClick();setCustomization((prevState) => !prevState);}}
                value={customization}
            />
            <Text style={styles.input}>גישה לשימוש במידע על שימושך באפליקציה</Text>
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => handleIconPress("maintenance")}>
            <Animatable.View animation={iconAnimation} style={styles.iconContainer}>
              <Entypo name="light-bulb" size={40} color="yellow" />
            </Animatable.View>
          </TouchableOpacity>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={maintenance ? "#f5dd4b" : "#f4f3f4"}
                width = "200"
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {handleGlobalClick();setMaintenance((prevState) => !prevState);}}
                value={maintenance}
            />
            <Text style={styles.input}>הרשאה לעידכוני מערכת אוטומטיים</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button,styles.forwardBtn]} onPress={handleMoveForward}>
            <Text style={styles.buttonText}>המשך</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button,styles.backBtn]} onPress={handleGoBack}>
            <Text style={styles.buttonText}>חזור</Text>
          </TouchableOpacity>
        </View>

      </View>
      <Modal visible={modalVisible} transparent animationType="none">
        <View style={styles.modalContainer}>
          <Animatable.View
            ref={modalRef} 
            animation="fadeInUp"
            duration={500} 
            style={styles.modalContent}
          >
            <Text style={styles.fontex}>{explanation}</Text>
            <TouchableOpacity style={[styles.button,{backgroundColor:'red'}]} onPress={closeModal}>
              <Text style={styles.buttonText}>סגור</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
        <View>
          <TouchableOpacity style={styles.lottieButton} onPress={handleLottiePress}>
            <LottieView
              source={require("/Users/shaylavi/Desktop/final_project/m1/model1/screens/Model3/SetupScreens/robot.json")}
              autoPlay
              loop
              style={styles.lottie}
            />
          </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom:90
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
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width:600
  },
  input: {
    flex: 1,
    textAlign: "right",
    marginRight:20,
    padding: 10,
    fontSize: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 60,
    shadowColor: "yellow",
    shadowRadius: 3,
    shadowOpacity: 1,
    marginLeft:70
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "48%",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transperent",
  },
  
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor:"whitesmoke",
    borderEndColor:'black',
    borderBottomEndRadius:'2'
  },
  fontex: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight:'bold',
    color:'black',
    textAlign:'center'
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  forwardBtn:
  {
    backgroundColor:'green'
  },
  backBtn:
  {
    backgroundColor:'orange'
  },
  closeBtn:
  {
    backgroundColor:'red'
  },
  lottieButton: {
    position: "absolute",
    top: 50,
    right: 110,
    width: 300,
    height: 300,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },  
});

export default Premissions23;

import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useUser } from "../../Model2/userContext";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";

const Bank3 = ({ navigation,handleGlobalClick }) => {
  const { user } = useUser();
  const animatableRef = useRef(null);

  const handleNavigate = (route, direction) => {
    if (direction === "forward") {
      animatableRef.current
        .animate("fadeOutLeft", 500)
        .then(() => navigation.navigate(route));
    } else if (direction === "back") {
      animatableRef.current
        .animate("fadeOutRight", 500)
        .then(() => navigation.navigate(route));
    }
  };
  const handelBank = () => {
    Alert.alert("הועברת למצב חשבון");
    handleGlobalClick();
    }
  const handleLottiePress = () => {
      Alert.alert("play video")
    }
  return (
    <Animatable.View
      ref={animatableRef}
      style={{ flex: 1 }}
      animation="fadeInDown"
      duration={2000}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>ברוך הבא לשירותי הבנק</Text>
        </View>
        <View>
          <Text style={styles.subtitle}>
          כדי לנווט בין השירותים השונים לחץ על הכפתור המתאים לשירות שברצונך להשתמש בו
          </Text>
        </View>
        <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.forwardButton,{backgroundColor:'#52bfbf',marginTop:'70'}]} onPress={handelBank}>
            <Text style={styles.forwardButtonText}>מצב חשבון</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.forwardButton,{backgroundColor:'#2D4B73',marginTop:'70'}]} onPress={() => handleNavigate("ContactBanker3", "forward")}>
            <Text style={styles.forwardButtonText}>כתוב לבנקאי</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.forwardButton,{backgroundColor:'#F2AB27',marginTop:'70'}]} onPress={() => handleNavigate("Transaction3", "forward")}>
        <Text style={styles.forwardButtonText}>העברה</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.forwardButton,{backgroundColor:'green',marginTop:'70'}]} onPress={() => handleNavigate("Home13", "back")}>
        <Text style={styles.forwardButtonText}>מסך בית</Text>
        </TouchableOpacity>
        </View>
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
      </ScrollView>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
    marginTop: 50,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 100,
    marginTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    paddingVertical: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginBottom: 50,
    marginTop: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  forwardButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 230,
    height:70,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  forwardButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 38,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
  lottieButton: {
    position: "absolute",
    bottom: -300,
    right: 110,
    width: 300,
    height: 300,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 2
  },
  lottie: {
    width: "100%",
    height: "100%",
  }
});

export default Bank3;

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

const Home23 = ({ navigation }) => {
  const { user } = useUser();
  const animatableRef = useRef(null);

  const buttons = [
    { label: "בידור", route: "Entertainment3", backgroundColor: "#a39193" },
    { label: 'עידכון פרטים אישיים', route: "Setup3", backgroundColor: "#8db1fa" },
    { label: 'הרשאות פרטיות', route: "Premissions13", backgroundColor: "#35223c" },
    { label: "ביצועים", route: "Performance3", backgroundColor: "#9dbda4" },
  ];

  const handleNavigate = (route) => {
    animatableRef.current
      .animate("fadeOutRight", 500)
      .then(() => navigation.navigate(route));
  };
  const handleLottiePress = () => {
      Alert.alert("play video")
    }
  return (
    <Animatable.View ref={animatableRef} style={{ flex: 1 }} animation="fadeInDown" duration={2000} >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.subtitle}>ברוך הבא לדף הבית. בחר את השירות שברצונך להשתמש. כל כפתור יוביל אותך לשירותים באותו נושא. אם קיבלת הודעה שלא ניתן לבצע את השירות הנ״ל ככל הנראה צריך למלא פרטים אישיים מסוימים או להפעיל הרשאות מסויימות. תיקון הפרטים יופיעו בהודעת השגיאה.</Text>
        </View>
        <View style={styles.buttonRowContainer}>
          {buttons.map((button) => (
            <View key={button.label} style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: button.backgroundColor }]}
                onPress={() => handleNavigate(button.route)}
              >
                <Text style={styles.buttonText}>{button.label}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.forwardButton} onPress={() => handleNavigate("Home13")}>
          <Text style={styles.forwardButtonText}>חזור</Text>
        </TouchableOpacity>
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
    marginTop:50,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 50,
    marginTop: 50,
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  buttonRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
  },
  buttonWrapper: {
    width: "48%",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginBottom: 50,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  forwardButton: {
    marginTop: 30,
    backgroundColor: "orange",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 300,
    marginTop: 50,
  },
  forwardButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#555",
    textAlign: "center",
    marginTop:20,
    fontWeight:'bold'
  }
});

export default Home23;

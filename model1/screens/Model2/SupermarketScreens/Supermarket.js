import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useUser } from "../userContext";
import * as Animatable from "react-native-animatable";

const Supermarket = ({ navigation, handleGlobalClick}) => {
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
    Alert.alert("הסל הוזמן בהצלחה");
    handleGlobalClick();
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
          <Text style={styles.title}>ברוך הבא לשירותי הסופרמרקט</Text>
        </View>
        <View>
          <Text style={styles.subtitle}>
            כדי לנווט בין השירותים השונים לשירותים השונים לחץ על לחץ יעודי. אם אין באפשרותכם להשתמש בשירות זה נא לעדכן פרטיכם האישיים וההרשאות המתאימות
          </Text>
        </View>
        <TouchableOpacity style={[styles.button, styles.forwardButton,{backgroundColor:'#52bfbf',marginTop:'150'}]} onPress={handelBank}>
            <Text style={styles.forwardButtonText}>הזמנת סל קיים</Text>
        </TouchableOpacity>
        <View style={styles.buttonRow}>
        <TouchableOpacity
            style={[styles.button, styles.forwardButton,{backgroundColor:'orange'}]}
            onPress={() => handleNavigate("EditCartM2", "forward")}
          >
            <Text style={styles.forwardButtonText}>עריכת סל קיים</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.forwardButton,{backgroundColor:'green'}]}
            onPress={() => handleNavigate("Home1", "back")}
          >
            <Text style={styles.forwardButtonText}>מסך בית</Text>
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
    marginBottom: 170,
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
    marginTop: 50,
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
  forwardButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 230,
  },
  forwardButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 30,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
});

export default Supermarket;

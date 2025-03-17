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
import Toast from "react-native-toast-message";

const Health = ({ navigation,handleGlobalClick }) => {
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
  const handelBuy = () => {
    Toast.show({
      type: "success",
      text1: "התרופות הוזמנו",
      visibilityTime: 4000,
      position: "top",
      textStyle: { fontSize: 18, textAlign: "right" }, 
      style: { 
        width: "90%", 
        backgroundColor: "#ff4d4d", 
        borderRadius: 10, 
        alignSelf: "flex-end",
        zIndex: 9999 
      },});
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
        <Toast/>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>ברוך הבא לשירותי קופת חולים</Text>
        </View>
        <View>
        <Text style={styles.subtitle}>
            כדי לנווט בין השירותים השונים ניתן לעבור למסך העברה משם לשאר השירותים
            שניתנים. להזמנת סל תרופות ניתן ללחוץ על המקש במסך זה
          </Text>
        </View>
        <TouchableOpacity style={[styles.button, styles.forwardButton,{backgroundColor:'#52bfbf',marginTop:'120'}]} onPress={handelBuy}>
            <Text style={styles.forwardButtonText}>הזמנת סל תרופות</Text>
        </TouchableOpacity>
        <View style={styles.buttonRow}>
        <TouchableOpacity
            style={[styles.button, styles.forwardButton,{backgroundColor:'orange'}]}
            onPress={() => handleNavigate("Schedule", "forward")}
          >
            <Text style={styles.forwardButtonText}>קביעת תור</Text>
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
    marginTop: 30,
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
    marginTop: 30,
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
    marginBottom: 30,
    marginTop: 10,
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
    fontSize: 38,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 80,
    fontWeight: "bold",
  },
});

export default Health;

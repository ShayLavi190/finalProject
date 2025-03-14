import React,{useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import * as Animatable from "react-native-animatable";

const Emergency = ({ navigation,handleGlobalClick }) => {
    const animatableRef = useRef(null);

  const buttons = [
    { label: 'חיוג למשטרה',backgroundColor:'#1f5eff', action: () => {Alert.alert('חירום', 'מחייג למשטרה'); handleGlobalClick();}},
    { label: 'חיוג מכבי אש',backgroundColor:'#ffd900', action: () => {Alert.alert('חירום', 'מחייג למכבי אש'); handleGlobalClick();}},
    { label: 'חיוג למגן דוד אדום',backgroundColor:'#f44336', action: () => {Alert.alert('חירום', 'מחייג למגן דוד אדום'); handleGlobalClick();}},
    { label: 'חיוג לאיש קשר',backgroundColor:'#6aa84f', action: () => {Alert.alert('חירום', 'מחייג לאיש קשר'); handleGlobalClick();}}
  ];
  const handleNavigate = (route) => {
    animatableRef.current
      .animate("fadeOutRight", 500)
      .then(() => navigation.navigate(route));
  };
  return (
    <Animatable.View ref={animatableRef} style={{ flex: 1 }} animation="fadeInDown" duration={2000} >
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.title}>חירום</Text>
            <Text style={styles.subtitle}>דף זה מאפשר לך להתקשר לגופי ביטחון והצלה ובנוסף לאיש קשר למקרה חירום שהזנת במערכת. כדי להתקשר לחץ על הכפתור המתאים</Text>
        </View>      
        <View style={styles.buttonRowContainer}>
            {buttons.map((button, index) => (
            <View key={button.label} style={[styles.buttonWrapper]}>
                <TouchableOpacity
                style={[styles.button,{backgroundColor:button.backgroundColor}]}
                onPress={button.route ? () => navigation.navigate(button.route) : button.action}
                >
                <Text style={styles.buttonText}>{button.label}</Text>
                </TouchableOpacity>
            </View>
            ))}
        </View>
        <TouchableOpacity style={styles.forwardButton} onPress={() => handleNavigate("Home1")}>
            <Text style={styles.forwardButtonText}>מסך בית</Text>
            </TouchableOpacity>
        </ScrollView>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 130,
    marginTop: 100, 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonWrapper: {
    width: '48%', 
    marginBottom: 20,
  },
  button: {
    paddingVertical: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:30,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    color: "#555",
    textAlign: "center",
    marginTop:50,
    fontWeight:'bold'
  },
  forwardButton: {
    marginTop: 30,
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 300,
  },
  forwardButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Emergency;

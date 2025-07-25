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
import Toast from "react-native-toast-message";

const Emergency = ({ navigation,handleGlobalClick }) => {
  const animatableRef = useRef(null);
  const buttons = [
    { 
    label: 'Call the police',
    backgroundColor: '#1f5eff',
    action: () => {
    makeToast('Emergency', 'Calling the police');
    handleGlobalClick();
    }
    },
    { 
    label: 'Call the fire department',
    backgroundColor: '#ffd900',
    action: () => {
    makeToast('Emergency', 'Calling the fire department'); 
    handleGlobalClick();
    }
    },
    { 
    label: 'Call the Magen David Adom',
    backgroundColor: '#f44336',
    action: () => {
    makeToast('Emergency', 'Calling the Magen David Adom'); 
    handleGlobalClick();
    }
    },
    { 
    label: 'Call Contact',
    backgroundColor: '#6aa84f',
    action: () => {
    makeToast('Emergency', 'Calling Contact');
    handleGlobalClick();
    }
    }
  ];
  
  const makeToast = (title, text) => {
    Toast.show({
      type: "success",
      text1: title,
      text2: text,
      visibilityTime: 4000,
      position: "top",
      textStyle: { fontSize: 18, textAlign: "right" }, 
      style: { width: "90%", backgroundColor: "#ff4d4d", borderRadius: 10, alignSelf: "flex-end" },
    });
  };  

  const handleNavigate = (route) => {
    animatableRef.current
      .animate("fadeOutRight", 500)
      .then(() => navigation.navigate(route));
  };
  return (
    <Animatable.View ref={animatableRef} style={{ flex: 1 }} animation="fadeInDown" duration={2000} >
        <ScrollView contentContainerStyle={styles.container}>
        <Toast/>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Emergency</Text>
          <Text style={styles.subtitle}>This page allows you to call security and rescue agencies as well as an emergency contact you have entered in the system. To call, click the appropriate button</Text>
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
            <Text style={styles.forwardButtonText}>Home Screen</Text>
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

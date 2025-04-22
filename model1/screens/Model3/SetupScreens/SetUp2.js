import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useUser } from '../../Model2/userContext';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';
import Toast from 'react-native-toast-message';
import robotAnimation from './robot.json';

// Configuration Constants
const AUDIO_URL = 'https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/setup2.mp3';
const MAX_LENGTHS = {
  street: 100,
  number: 10,
  city: 50,
  country: 50
};

const SetUp23 = ({ navigation, handleGlobalClick }) => {
  // Context and State Management
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    street: user.street || '',
    number: user.number || '',
    city: user.city || '',
    country: user.country || ''
  });
  const [modalState, setModalState] = useState({
    visible: false,
    explanation: '',
    iconAnimation: ''
  });
  const [audioState, setAudioState] = useState({
    sound: null,
    isPlaying: false,
    currentTime: 0
  });

  // Refs
  const animatableRef = useRef(null);
  const modalRef = useRef(null);
  const audioRef = useRef(null);

  // Validation Functions
  const validateInput = useCallback((field, value) => {
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 && trimmedValue.length <= MAX_LENGTHS[field];
  }, []);

  const validateAllInputs = useCallback(() => {
    const errors = [];
    
    Object.keys(formData).forEach(field => {
      if (!validateInput(field, formData[field])) {
        switch (field) {
          case 'street':
            errors.push('רחוב נדרש. שדה זה חובה');
            break;
          case 'number':
            errors.push('מספר בית ודירה אם יש נדרש. שדה זה חובה');
            break;
          case 'city':
            errors.push('נא להזין את העיר בה אתה מתגורר. שדה זה חובה');
            break;
          case 'country':
            errors.push('נא להזין את המדינה בה אתם גרים. שדה זה חובה');
            break;
        }
      }
    });

    return errors;
  }, [formData, validateInput]);

  // Audio Management
  const stopAudio = useCallback(async () => {
    if (Platform.OS === 'web') {
      if (audioRef.current) {
        setAudioState(prev => ({
          ...prev,
          currentTime: audioRef.current.currentTime,
          isPlaying: false
        }));
        audioRef.current.pause();
      }
      return;
    }
    
    if (audioState.sound) {
      try {
        const status = await audioState.sound.getStatusAsync();
        setAudioState(prev => ({
          ...prev,
          currentTime: status.positionMillis / 1000,
          isPlaying: false
        }));
        await audioState.sound.pauseAsync();
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
    }
  }, [audioState.sound]);

  // Navigation Handlers
  const handleMoveForward = useCallback(() => {
    if (audioState.isPlaying) {
      stopAudio();
    }

    const errors = validateAllInputs();
    
    if (errors.length > 0) {
      Platform.OS === 'web' 
        ? errors.forEach((error, index) => {
            setTimeout(() => {
              Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'שגיאה',
                text2: error,
                visibilityTime: 4000,
                autoHide: true,
              });
            }, index * 800);
          })
        : Alert.alert('שגיאה', errors.join('\n'));
      return;
    }

    animatableRef.current.animate('fadeOutLeft', 500).then(() => {
      updateUser({
        ...user,
        ...formData
      });
      navigation.navigate('HomeSetUp');
    });
  }, [
    audioState.isPlaying, 
    stopAudio, 
    validateAllInputs, 
    updateUser, 
    user, 
    navigation, 
    formData
  ]);

  const handleGoBack = useCallback(() => {
    if (audioState.isPlaying) {
      stopAudio();
    }

    animatableRef.current.animate('fadeOutRight', 500).then(() => {
      updateUser({
        ...user,
        ...formData
      });
      navigation.navigate('Setup33');
    });
  }, [
    audioState.isPlaying, 
    stopAudio, 
    updateUser, 
    user, 
    navigation, 
    formData
  ]);

  // Audio Playback Handler
  const handleAudioPlayback = useCallback(async () => {
    handleGlobalClick();

    if (Platform.OS === 'web') {
      if (!audioRef.current) {
        Toast.show({
          type: 'error',
          text1: 'שגיאה',
          text2: 'לא ניתן להפעיל את ההקלטה',
        });
        return;
      }

      if (audioState.isPlaying) {
        audioRef.current.pause();
        setAudioState(prev => ({
          ...prev,
          isPlaying: false,
          currentTime: audioRef.current.currentTime
        }));
      } else {
        try {
          audioRef.current.src = AUDIO_URL;
          audioRef.current.currentTime = audioState.currentTime;
          await audioRef.current.play();
          
          setAudioState(prev => ({
            ...prev,
            isPlaying: true,
            sound: true
          }));
        } catch (error) {
          console.error('Web audio error:', error);
          Toast.show({
            type: 'error',
            text1: 'שגיאה',
            text2: 'לא ניתן להפעיל את ההקלטה',
          });
        }
      }
      return;
    }

    try {
      if (audioState.sound && audioState.isPlaying) {
        await stopAudio();
      } else if (audioState.sound) {
        await audioState.sound.playFromPositionAsync(audioState.currentTime * 1000);
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      } else {
        const { sound } = await Audio.Sound.createAsync(
          { uri: AUDIO_URL },
          { 
            shouldPlay: true,
            positionMillis: 0
          }
        );

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setAudioState(prev => ({
              ...prev,
              isPlaying: false,
              currentTime: 0
            }));
          }
        });

        setAudioState({
          sound,
          isPlaying: true,
          currentTime: 0
        });
      }
    } catch (error) {
      console.error('Native audio error:', error);
      Alert.alert('שגיאה', 'לא ניתן להפעיל את ההקלטה');
    }
  }, [
    handleGlobalClick, 
    audioState.isPlaying, 
    audioState.sound, 
    audioState.currentTime,
    stopAudio
  ]);

  // Modal and Explanation Handlers
  const handleExplanationModal = useCallback((field) => {
    if (audioState.isPlaying) {
      stopAudio();
    }

    const explanations = {
      street: 'אנא הזן את שם הרחוב שלך.',
      number: 'אנא הזן את מספר הבית של ומספר דירה אם יש. זהו שדה חובה',
      city: 'אנא הזן את שם העיר שלך.',
      country: 'אנא הזן את שם המדינה שלך.',
    };

    setModalState({
      visible: true,
      explanation: explanations[field],
      iconAnimation: 'pulse'
    });
    handleGlobalClick();
  }, [audioState.isPlaying, stopAudio, handleGlobalClick]);

  const closeModal = useCallback(() => {
    modalRef.current.animate('fadeOutDown', 500)
      .then(() => setModalState(prev => ({
        ...prev,
        visible: false,
        iconAnimation: ''
      })));
    handleGlobalClick();
  }, [handleGlobalClick]);

  // Cleanup Effects
  useEffect(() => {
    return () => {
      if (Platform.OS !== 'web' && audioState.sound) {
        audioState.sound.unloadAsync();
      }
    };
  }, [audioState.sound]);

  useEffect(() => {
    if (Platform.OS === 'web' && audioRef.current) {
      const trackTime = () => {
        setAudioState(prev => ({
          ...prev,
          currentTime: audioRef.current.currentTime
        }));
      };

      const audioElement = audioRef.current;
      audioElement.addEventListener('timeupdate', trackTime);

      return () => {
        audioElement.removeEventListener('timeupdate', trackTime);
      };
    }
  }, []);

  return (
    <Animatable.View
      ref={animatableRef}
      animation="fadeInDown"
      duration={2000}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Toast />
        
        {Platform.OS === 'web' && (
          <audio
            ref={audioRef}
            style={{ display: 'none' }}
            onEnded={() => {
              setAudioState(prev => ({
                ...prev,
                isPlaying: false,
                currentTime: 0
              }));
            }}
          />
        )}
        
        <View style={styles.card}>
          <Text style={styles.title}>הגדרת כתובת לקוח</Text>
          <Text style={styles.subtitle}>
            כדי שהרובוט המטפל יוכל להפעיל את שירותיו לטובך נצטרך את פרטי
            המגורים. כלל המידע נשמר בצורה מאובטחת ואינו משותף עם שום גורם חיצוני
            ללא ביצוע שירות ייעודי.
          </Text>

          {/* Inputs Rendering */}
          {Object.keys(formData).map((field) => (
            <View key={field} style={styles.inputContainer}>
              <TouchableOpacity onPress={() => handleExplanationModal(field)}>
                <Animatable.View
                  animation={modalState.iconAnimation}
                  style={styles.iconContainer}
                >
                  <Entypo name="light-bulb" size={40} color="yellow" />
                </Animatable.View>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder={
                  field === 'street' ? 'רחוב' :
                  field === 'number' ? 'מספר בית ודירה אם יש' :
                  field === 'city' ? 'עיר' :
                  'מדינה'
                }
                value={formData[field]}
                onChangeText={(value) => {
                  // For number field, allow only digits
                  const processedValue = field === 'number' 
                    ? value.replace(/[^0-9]/g, '')
                    : value;
                  
                  // Limit to max length
                  const limitedValue = processedValue.slice(0, MAX_LENGTHS[field]);
                  
                  setFormData(prev => ({
                    ...prev,
                    [field]: limitedValue
                  }));
                }}
                keyboardType={field === 'number' ? 'numeric' : 'default'}
                maxLength={MAX_LENGTHS[field]}
              />
            </View>
          ))}
              <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                style={[{ backgroundColor: "green" }, styles.button]}
                onPress={handleMoveForward}
              >
                <Text style={styles.buttonText}>שמור</Text>
              </TouchableOpacity>
            </View>
        </View>

        {/* Explanation Modal */}
        <Modal 
          visible={modalState.visible} 
          transparent 
          animationType="none"
        >
          <View style={styles.modalContainer}>
            <Animatable.View
              ref={modalRef}
              animation="fadeInUp"
              duration={500}
              style={styles.modalContent}
            >
              <Text style={styles.fontex}>{modalState.explanation}</Text>
              <TouchableOpacity
                style={[styles.button, styles.closeBtn]}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>סגור</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Modal>
        <View>
          <TouchableOpacity
            style={styles.lottieButton}
            onPress={handleAudioPlayback}
            accessibilityLabel="לחץ לשמיעת הדרכה קולית"
          >
            <LottieView
              source={robotAnimation}
              autoPlay
              loop
              style={styles.lottie}
              rendererSettings={{
                preserveAspectRatio: 'xMidYMid slice'
              }}
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
    marginBottom: 200,
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    padding: 10,
    fontSize: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    shadowColor: "yellow",
    shadowRadius: 3,
    shadowOpacity: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
  },
  forwardBtn: {
    backgroundColor: "green",
  },
  backBtn: {
    backgroundColor: "orange",
  },
  closeBtn: {
    backgroundColor: "red",
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
    backgroundColor: "whitesmoke",
    borderEndColor: "black",
    borderBottomEndRadius: "2",
  },
  fontex: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "bold",
    color: "black",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  lottieButton: {
    position: "absolute",
    top: Platform.OS === 'web' ? 20 : 80,
    right: Platform.OS === 'web' ? 50 : 110,
    width: 300,
    height: 300,
    zIndex: 100,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default SetUp23;

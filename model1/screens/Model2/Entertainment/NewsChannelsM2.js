import React, { useState,useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Animatable from "react-native-animatable";

const channels = [
  { id: '1', name: 'ערוץ 12 - חדשות',backgroundColor:'#ffe59b', link: 'https://www.mako.co.il/mako-vod-live-tv/VOD-6540b8dcb64fd31006.htm' },
  { id: '2', name: 'ערוץ 13 - רשת',backgroundColor:'#c9272e', link: 'https://13tv.co.il/live/' },
  { id: '3', name: 'ערוץ 11 - כאן' ,backgroundColor:'#d0c0a9', link: 'https://www.kan.org.il/live/tv.aspx?stationId=2' },
  { id: '4', name: 'ערוץ 14 - עכשיו 14',backgroundColor:'#27496d', link: 'https://now14.co.il/live/' },
];

const NewsPapersM2 = ({ handleGlobalClick,navigation }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isWebViewVisible, setWebViewVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const animatableRef = useRef(null);
  const modalRef = useRef(null);

  const openWebView = (url) => {
    setCurrentUrl(url);
    setWebViewVisible(true);
    handleGlobalClick('Opened WebView for: ' + url);
  };
  const closeWebView = () => {
    modalRef.current
      .animate("fadeOut", 300) 
      .then(() => {
        setWebViewVisible(false); 
        setCurrentUrl('');
        handleGlobalClick('Closed WebView');
      });
  };


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

  return (
    <Animatable.View ref={animatableRef} style={{ flex: 1 }} animation="fadeInDown" duration={2000}>
    <View style={styles.container}>
      {isWebViewVisible ? (
          <Animatable.View ref={modalRef} style={{ flex: 1 }} animation="fadeIn" duration={1000}>
            <View style={styles.webviewContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={closeWebView}>
                <Text style={styles.closeButtonText}>סגור</Text>
                </TouchableOpacity>
                {loading && (
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={styles.loader}
                />
                )}
                <WebView
                source={{ uri: currentUrl }}
                style={styles.webview}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                />
            </View>
        </Animatable.View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>ערוצי חדשות</Text>
          <Text style={styles.subtitle}>על מנת לצפות בערוצי החדשות לחץ על ערוץ שברצונך לצפות כדי לעבור לשאר המסכים לחץ על לחצן עיתונים</Text>
          <View style={styles.buttonRowContainer}>
            {channels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
                style={[styles.card,{backgroundColor:channel.backgroundColor}]}
                onPress={() => openWebView(channel.link)}
              >
                <Text style={styles.cardTitle}>{channel.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        <View style={styles.buttonRow}>
         <TouchableOpacity
            style={[styles.button, styles.forwardButton,{backgroundColor:'orange'}]}
            onPress={() => handleNavigate("NewsPapersM2", "forward")}
          >
            <Text style={styles.forwardButtonText}>עיתונים</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.forwardButton,{backgroundColor:'green'}]}
            onPress={() => handleNavigate("Home1", "back")}
          >
            <Text style={styles.forwardButtonText}>מסך בית</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      )}
    </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    marginTop:80
  },
  buttonRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    width: '48%',
    padding: 30,
    marginTop: 30,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    width:80
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign:'center'
  },
  webview: {
    flex: 1,
    marginTop: 80,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },  
  subtitle: {
    fontSize: 28,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
    marginBottom:50,
    marginTop:50
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 150
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
  }
});

export default NewsPapersM2;

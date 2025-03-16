import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import * as Animatable from "react-native-animatable";

const channels = [
  { id: '1', name: 'ערוץ 12 - חדשות', backgroundColor: '#ffe59b', link: 'https://www.mako.co.il/mako-vod-live-tv/VOD-6540b8dcb64fd31006.htm' },
  { id: '2', name: 'ערוץ 13 - רשת', backgroundColor: '#c9272e', link: 'https://13tv.co.il/live/' },
  { id: '3', name: 'ערוץ 11 - כאן', backgroundColor: '#d0c0a9', link: 'https://www.kan.org.il/live/tv.aspx?stationId=2' },
  { id: '4', name: 'ערוץ 14 - עכשיו 14', backgroundColor: '#27496d', link: 'https://now14.co.il/live/' },
];

const NewsChannelsM2 = ({ handleGlobalClick, navigation }) => {
  const animatableRef = useRef(null);

  const openBrowser = (url) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
    handleGlobalClick('Opened external browser for: ' + url);
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>ערוצי חדשות</Text>
          <Text style={styles.subtitle}>על מנת לצפות בערוצי החדשות, לחץ על הערוץ הרצוי והוא ייפתח בדפדפן החיצוני.</Text>
          <View style={styles.buttonRowContainer}>
            {channels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
                style={[styles.card, { backgroundColor: channel.backgroundColor }]}
                onPress={() => openBrowser(channel.link)}
              >
                <Text style={styles.cardTitle}>{channel.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.forwardButton, { backgroundColor: 'orange' }]}
              onPress={() => handleNavigate("NewsPapersM2", "forward")}
            >
              <Text style={styles.forwardButtonText}>עיתונים</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.forwardButton, { backgroundColor: 'green' }]}
              onPress={() => handleNavigate("Home1", "back")}
            >
              <Text style={styles.forwardButtonText}>מסך בית</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    marginTop: 30,
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
  subtitle: {
    fontSize: 28,
    color: "#555",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 50,
    marginTop: 50,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 150,
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
});

export default NewsChannelsM2;

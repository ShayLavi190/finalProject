import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';

const channels = [
  { id: '1', name: 'ערוץ 12 - חדשות', link: 'https://www.mako.co.il/mako-vod-live-tv/VOD-6540b8dcb64fd31006.htm' },
  { id: '2', name: 'ערוץ 13 - רשת', link: 'https://13tv.co.il/live/' },
  { id: '3', name: 'ערוץ 11 - כאן', link: 'https://www.kan.org.il/live/tv.aspx?stationId=2' },
  { id: '4', name: 'ערוץ 14 - עכשיו 14', link: 'https://now14.co.il/live/' },
];

const NewsChannelsPage = ({ handleGlobalClick }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isWebViewVisible, setWebViewVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const openWebView = (url) => {
    setCurrentUrl(url);
    setWebViewVisible(true);
    handleGlobalClick('Opened WebView for: ' + url);
  };

  const closeWebView = () => {
    setCurrentUrl('');
    setWebViewVisible(false);
    handleGlobalClick('Closed WebView');
  };

  return (
    <View style={styles.container}>
      {isWebViewVisible ? (
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
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>ערוצי חדשות</Text>
          <View style={styles.buttonRowContainer}>
            {channels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
                style={styles.card}
                onPress={() => openWebView(channel.link)}
              >
                <Text style={styles.cardTitle}>{channel.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
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
  },
  buttonRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    width: '48%',
    backgroundColor: '#5d9592',
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
    backgroundColor: '#D9D4D0',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
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
});

export default NewsChannelsPage;

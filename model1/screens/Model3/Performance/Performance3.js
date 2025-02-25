import React ,  {useRef} from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, Button, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../server/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from "react-native-animatable";
import { useUser } from "../../Model2/userContext";


const Performance3 = ({ globalTasks = [], setGlobalTasks, navigation }) => {
  const { user, updateUser } = useUser(); 
  const calculateGraphData = () => {
    console.log("golbaltasks: ",globalTasks)
    const taskLabels = [];
    const pagesChanged = [];
    const durations = [];
    const clicks = [];
    const indicators = [];
    globalTasks.forEach((task, index) => {
      const { pagesChanged: pages, duration, clicks: taskClicks } = task;
      taskLabels.push(`Task ${index + 1}`);
      pagesChanged.push(pages || 0);
      durations.push(duration || 0);
      clicks.push(taskClicks || 0);

      const pageThreshold = 3;
      const clickThreshold = 6;
      const pageRatio = (pages / pageThreshold) || 0;
      const clickRatio = (taskClicks / clickThreshold) || 0;
      indicators.push((pageRatio + clickRatio) / 2);
    });

    return { taskLabels, pagesChanged, durations, clicks, indicators };
  };

  const { taskLabels, pagesChanged, durations, clicks, indicators } = calculateGraphData();

  const resetPerformance = async () => {
    try {
      const userId = user.id;
      if (!userId) throw new Error('User ID not found.');

      const performanceData = globalTasks.map((task, index) => ({
        ...task,
        name: `Task ${index + 1}`,
        timestamp: task.timestamp || new Date().toISOString(),
      }));

      const performanceRef = doc(collection(db, 'performance'), userId);
      await setDoc(performanceRef, { tasks: performanceData });

      setGlobalTasks([]);
      Alert.alert('Success', 'Performance data saved and tasks reset.');
    } catch (error) {
      console.error('Error resetting performance:', error);
      Alert.alert('Error', 'Failed to save performance data.');
    }
  };

  const handleReset = () => {
    Alert.alert('Reset Data', 'Are you sure you want to reset performance data?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', onPress: () => resetPerformance() },
    ]);
  };
  const handleNavigate = (route) => {
    if (!navigation) {
      console.error("Navigation prop is missing. Ensure the component is wrapped in a navigator.");
      return;
    }
  
    if (animatableRef.current) {
      animatableRef.current
        .animate("fadeOutRight", 500)
        .then(() => {
          navigation.navigate(route);
        })
        .catch((error) => {
          console.error("Animation error:", error);
          navigation.navigate(route); // Fallback navigation
        });
    } else {
      console.warn("Animation reference is null. Navigating without animation.");
      navigation.navigate(route);
    }
  };
  
  const animatableRef = useRef(null);

  return (
    <Animatable.View ref={animatableRef} style={{ flex: 1 }} animation="fadeInDown" duration={2000} >
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Performance Metrics</Text>
      </View>

      {taskLabels.length > 0 ? (
        <>
          <View style={styles.graphContainer}>
            <Text style={styles.graphDescription}>Number of Page Changes</Text>
            <BarChart
              data={{
                labels: taskLabels,
                datasets: [{ data: pagesChanged }],
              }}
              width={Dimensions.get('window').width - 40}
              height={170}
              chartConfig={chartConfig}
              style={styles.graphStyle}
            />
          </View>

          <View style={styles.graphContainer}>
            <Text style={styles.graphDescription}>Number of Clicks</Text>
            <BarChart
              data={{
                labels: taskLabels,
                datasets: [{ data: clicks }],
              }}
              width={Dimensions.get('window').width - 40}
              height={170}
              chartConfig={chartConfig}
              style={styles.graphStyle}
            />
          </View>

          <View style={styles.graphContainer}>
            <Text style={styles.graphDescription}>Task Duration (seconds)</Text>
            <LineChart
              data={{
                labels: taskLabels,
                datasets: [{ data: durations }],
              }}
              width={Dimensions.get('window').width - 40}
              height={170}
              chartConfig={chartConfig}
              style={styles.graphStyle}
            />
          </View>

          <View style={styles.graphContainer}>
            <Text style={styles.graphDescription}>Performance Indicator</Text>
            <BarChart
              data={{
                labels: taskLabels,
                datasets: [{ data: indicators }],
              }}
              width={Dimensions.get('window').width - 40}
              height={170}
              chartConfig={chartConfig}
              style={styles.graphStyle}
            />
          </View>
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No performance data available.</Text>
        </View>
      )}

      <View style={styles.resetButtonContainer}>
        <Button title="Reset Data" onPress={handleReset} color="#f4511e" />
      </View>
      <TouchableOpacity style={styles.forwardButton} onPress={() => handleNavigate("Home13")}>
          <Text style={styles.forwardButtonText}>חזור</Text>
        </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
    </Animatable.View>
  );
};

const chartConfig = {
  backgroundColor: '#e26a00',
  backgroundGradientFrom: '#fb8c00',
  backgroundGradientTo: '#ffa726',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f2f2f2',
  },
  titleContainer: {
    marginBottom: 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  graphContainer: {
    marginBottom: 2,
    alignItems: 'center',
    height: 200,
  },
  graphDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    marginTop: 3,
  },
  graphStyle: {
    borderRadius: 16,
    marginVertical: 10,
  },
  noDataContainer: {
    marginVertical: 50,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#555',
  },
  resetButtonContainer: {
    marginTop: 1,
    alignItems: 'center',
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
});

export default Performance3;

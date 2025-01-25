import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, Button } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../server/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

const PerformanceGraphs = ({ globalTasks = [], setGlobalTasks }) => {
  const calculateGraphData = () => {
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
      const userId = await AsyncStorage.getItem('currentUserId');
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

  return (
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
    </ScrollView>
    </SafeAreaView>
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
  },
  graphDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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
});

export default PerformanceGraphs;

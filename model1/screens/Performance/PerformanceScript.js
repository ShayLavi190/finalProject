import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const BottomTaskTimer = ({ globalTasks, setGlobalTasks, currentRoute, setTrackingStatus }) => {
  const [startTime, setStartTime] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [lastRoute, setLastRoute] = useState('');
  const [currentClicks, setCurrentClicks] = useState(0);

  useEffect(() => {
    setTrackingStatus(isTracking); 
  }, [isTracking, setTrackingStatus]);

  useEffect(() => {
    if (globalTasks.length > 0) {
      const lastTask = globalTasks[globalTasks.length - 1];
      if (lastTask && isTracking) {
        setCurrentClicks(lastTask.clicks || 0);
      }
    }
  }, [globalTasks, isTracking]);

  useEffect(() => {
    if (isTracking && lastRoute !== currentRoute) {
      setPageCount((prev) => prev + 1);
      setLastRoute(currentRoute);

      setGlobalTasks((prevTasks) => {
        if (prevTasks.length > 0) {
          const updatedTasks = [...prevTasks];
          const lastTask = updatedTasks[updatedTasks.length - 1];
          if (lastTask) {
            lastTask.pagesChanged = (lastTask.pagesChanged || 0) + 1;

            if ((lastTask.clicks || 0) === currentClicks) {
              lastTask.clicks += 1;
              console.log('Click incremented automatically due to page change.');
            }
          }
          return updatedTasks;
        }
        return prevTasks;
      });
    }
  }, [currentRoute, isTracking, lastRoute, currentClicks, setGlobalTasks]);

  const handleStart = () => {
    if (isTracking) {
      Alert.alert('Error', 'Task is already running.');
      return;
    }
    setStartTime(Date.now());
    setPageCount(0);
    setLastRoute(currentRoute);
    setIsTracking(true);
    const newTask = {
      name: currentRoute || 'Unknown',
      duration: 0,
      pagesChanged: 0,
      clicks: 0,
      timestamp: new Date().toLocaleString(),
    };
    setGlobalTasks((prevTasks) => [...prevTasks, newTask]);
    Alert.alert('Started', 'Task tracking has started.');
  };

  const handleStop = () => {
    if (!isTracking) {
      Alert.alert('Error', 'No task is currently running.');
      return;
    }
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    setCurrentClicks(0);

    setGlobalTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const lastTask = updatedTasks[updatedTasks.length - 1];
      if (lastTask) {
        lastTask.duration = parseFloat(duration) || 0;
        lastTask.pagesChanged = pageCount || 0;
      }
      return updatedTasks;
    });
    setIsTracking(false);
    setStartTime(null);
    setPageCount(0);
    Alert.alert('Stopped', 'Task has been stopped.');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.startButton]} onPress={handleStart}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={handleStop}>
        <Text style={styles.buttonText}>Stop</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>Pages Changed: {pageCount}</Text>
      <Text style={styles.infoText}>Clicks: {currentClicks}</Text>
      <Text style={styles.infoText}>Task Tracking: {isTracking ? 'Active' : 'Inactive'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#4caf50',
  },
  stopButton: {
    backgroundColor: '#f4511e',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
});

export default BottomTaskTimer;

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Screen2() {
  const router = useRouter();
  // Screen1
  const { userName, mssv } = useLocalSearchParams<{ userName: string; mssv: string }>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* top-lèt */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Screen 2</Text>
          <Text style={styles.infoText}>Name: {userName}</Text>
          <Text style={styles.infoText}>Student ID: {mssv}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'flex-start', // top-lèt
  },
  backButton: {
    backgroundColor: '#FF6D00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
});
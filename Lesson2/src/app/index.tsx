import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* 1 */}
        <View style={[styles.boxHorizontal, styles.box1]}>
          <Text style={styles.textWhite}>1</Text>
        </View>

        {/* 2 */}
        <View style={[styles.boxHorizontal, styles.box2]}>
          <Text style={styles.textWhite}>2</Text>
        </View>

        <View style={styles.middleRow}>
          {/* 3, 4 */}
          <View style={styles.halfLeft}>
            <View style={[styles.box, styles.box3]}>
              <Text style={styles.textBlack}>3</Text>
            </View>
            <View style={[styles.box, styles.box4]}>
              <Text style={styles.textWhite}>4</Text>
            </View>
          </View>

          {/* 5 */}
          <View style={styles.halfRight}>
            <View style={[styles.box, styles.box5]}>
              <Text style={styles.textWhite}>5</Text>
            </View>
          </View>
        </View>

        {/* 6 */}
        <View style={[styles.boxHorizontal, styles.box6]}>
          <Text style={styles.textWhite}>6</Text>
        </View>

        {/* space footer */}
        <View style={styles.spacer} />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Họ và tên - MSSV</Text>
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
    gap: 12, 
  },
  // Ngang
  boxHorizontal: {
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Dọc
  middleRow: {
    height: 170,
    flexDirection: 'row',
    gap: 12,
  },

  halfLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },

  halfRight: {
    flex: 1,
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  //
  spacer: {
    flex: 1,
  },

  footer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  textWhite: { fontSize: 48, fontWeight: 'bold', color: '#ffffff' },
  textBlack: { fontSize: 48, fontWeight: 'bold', color: '#000000' },
  footerText: { fontSize: 16, fontWeight: '500', color: '#000' },

  box1: { backgroundColor: '#2185D0' },
  box2: { backgroundColor: '#F83030' },
  box3: { backgroundColor: '#FFC508' },
  box4: { backgroundColor: '#22B455' },
  box5: { backgroundColor: '#7B2DE2' },
  box6: { height: 120, backgroundColor: '#FF6D00' },

});
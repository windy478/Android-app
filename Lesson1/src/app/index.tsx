// import * as Device from 'expo-device';
// import { Platform, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import { AnimatedIcon } from '@/components/animated-icon';
// import { HintRow } from '@/components/hint-row';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { WebBadge } from '@/components/web-badge';
// import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

// function getDevMenuHint() {
//   if (Platform.OS === 'web') {
//     return <ThemedText type="small">use browser devtools</ThemedText>;
//   }
//   if (Device.isDevice) {
//     return (
//       <ThemedText type="small">
//         shake device or press <ThemedText type="code">m</ThemedText> in terminal
//       </ThemedText>
//     );
//   }
//   const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
//   return (
//     <ThemedText type="small">
//       press <ThemedText type="code">{shortcut}</ThemedText>
//     </ThemedText>
//   );
// }

// export default function HomeScreen() {
//   return (
//     <ThemedView style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         <ThemedView style={styles.heroSection}>
//           <AnimatedIcon />
//           <ThemedText type="title" style={styles.title}>
//             Welcome to&nbsp;Expo
//           </ThemedText>
//         </ThemedView>

//         <ThemedText type="code" style={styles.code}>
//           get started
//         </ThemedText>

//         <ThemedView type="backgroundElement" style={styles.stepContainer}>
//           <HintRow
//             title="Try editing"
//             hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
//           />
//           <HintRow title="Dev tools" hint={getDevMenuHint()} />
//           <HintRow
//             title="Fresh start"
//             hint={<ThemedText type="code">npm run reset-project</ThemedText>}
//           />
//         </ThemedView>

//         {Platform.OS === 'web' && <WebBadge />}
//       </SafeAreaView>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
//   safeArea: {
//     flex: 1,
//     paddingHorizontal: Spacing.four,
//     alignItems: 'center',
//     gap: Spacing.three,
//     paddingBottom: BottomTabInset + Spacing.three,
//     maxWidth: MaxContentWidth,
//   },
//   heroSection: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     paddingHorizontal: Spacing.four,
//     gap: Spacing.four,
//   },
//   title: {
//     textAlign: 'center',
//   },
//   code: {
//     textTransform: 'uppercase',
//   },
//   stepContainer: {
//     gap: Spacing.three,
//     alignSelf: 'stretch',
//     paddingHorizontal: Spacing.three,
//     paddingVertical: Spacing.four,
//     borderRadius: Spacing.four,
//   },
// });

import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 1 và 2 */}
        <View style={styles.row}>
          <View style={[styles.box, styles.box1]}>
            <Text style={styles.textWhite}>1</Text>
          </View>
          <View style={[styles.box, styles.box2]}>
            <Text style={styles.textWhite}>2</Text>
          </View>
        </View>

        {/* 3, 4 và 5 */}
        <View style={styles.row}>
          <View style={styles.halfLeft}>
            <View style={[styles.box, styles.box3]}>
              <Text style={styles.textBlack}>3</Text>
            </View>
            <View style={[styles.box, styles.box4]}>
              <Text style={styles.textWhite}>4</Text>
            </View>
          </View>
          
          <View style={styles.halfRight}>
           <View style={[styles.box, styles.box5]}>
             <Text style={styles.textWhite}>5</Text>
           </View>
           {/* <View style={[styles.box, styles.box7]}>
              
            </View> */}
          </View>
        </View>

        {/* 6 */}
        <View style={styles.row}>
          <View style={[styles.box, styles.box6]}>
            <Text style={styles.textWhite}>6</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Nguyễn Ngọc Sơn - BIT240268</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: StatusBar.currentHeight || 0,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flex: 1.5,
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  footer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
  },
  halfLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
    halfRight: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },

  box1: { flex: 1, /*flexDirection: 'row', gap: 0, marginBottom: 12,*/ /*width: 150, height: 150,*/ backgroundColor: "#2185D0" },
  box2: { flex: 1, backgroundColor: "#DB2828" },
  box3: { flex: 1, backgroundColor: "#FBBD08" },
  box4: { flex: 1, backgroundColor: "#21BA45" },
  box5: { flex: 1, backgroundColor: "#8A2BE2" },
  box6: { flex: 1, backgroundColor: "#F2711C" },
  // box7: { flex: 1, backgroundColor: "#ffffff" },

  textWhite: { fontSize: 50, fontWeight: "bold", color: "#ffffff" },
  textBlack: { fontSize: 50, fontWeight: "bold", color: "#000000" },
  footerText: { fontSize: 18, fontWeight: "500", color: "#333" },
});

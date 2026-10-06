import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Screen1() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [mssv, setMssv] = useState("");

  const handleNext = () => {
    if (!userName.trim() || !mssv.trim()) {
      const message = "Hay dien dung thong tin SV va MSV";

      if (Platform.OS === "web") {
        alert("Thong bao: " + message);
      } else {
        Alert.alert("Thong bao", message);
      }
      return;
    }

    // Lesson4
    const mssvRegex = /^B[A-Z]{2}2[2-6]\d{4}$/;
    if (!mssvRegex.test(mssv.trim())) {
      const errorMsg = "Sai dinh dang ma so sinh vien, vui long thu lai (VD: BBA240146)";

      if (Platform.OS === "web") {
        alert("Thong bao: " + errorMsg);
      } else {
        Alert.alert("Thong bao", errorMsg);
      }
      return;
    }

    router.push({
      pathname: "/screen2",
      params: {
        userName: userName.trim(),
        mssv: mssv.trim(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* 1 */}
            <View style={[styles.boxHorizontal, styles.box1]}>
              <Text style={styles.textWhite}>1</Text>
            </View>

            {/* 2 */}
            <View style={[styles.boxHorizontal, styles.box2]}>
              <Text style={styles.textWhite}>2</Text>
            </View>

            {/* Dọc */}
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
                <View style={styles.spacer} />
              </View>
            </View>

            {/* 6 */}
            <View style={[styles.boxHorizontal, styles.box6]}>
              <Text style={styles.textWhite}>6</Text>
            </View>

            <View style={styles.spacer} />

            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Nhap thong tin sinh vien</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={userName}
                onChangeText={setUserName}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your student ID"
                value={mssv}
                onChangeText={setMssv}
              />

              <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.button} onPress={handleNext}>
                  <Text style={styles.buttonText}>Click me</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  // Ngang
  boxHorizontal: {
    height: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  // Dọc
  middleRow: {
    height: 170,
    flexDirection: "row",
    gap: 12,
  },

  halfLeft: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },

  halfRight: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },

  box: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  spacer: {
    flex: 1,
    minHeight: 20,
  },

  textWhite: { fontSize: 48, fontWeight: "bold", color: "#ffffff" },
  textBlack: { fontSize: 48, fontWeight: "bold", color: "#000000" },

  box1: { backgroundColor: "#2185D0" },
  box2: { backgroundColor: "#F83030" },
  box3: { backgroundColor: "#FFC508" },
  box4: { backgroundColor: "#22B455" },
  box5: { backgroundColor: "#7B2DE2" },
  box6: { height: 120, backgroundColor: "#FF6D00" },

  // Lesson3's styles
  formContainer: {
    width: "100%",
    paddingBottom: 10,
    gap: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  buttonWrapper: {
    alignItems: "center",
    marginTop: 6,
  },
  button: {
    backgroundColor: "#FF6D00",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

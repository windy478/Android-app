import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

// Kiểu dữ liệu Sinh viên
export interface Student {
  id: string; // ID duy nhất
  name: string;
  studentId: string;
  email: string;
  avatar: string;
}

export default function StudentListScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const router = useRouter();
  const { t } = useTranslation();

  // Load dữ liệu khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      loadStudents();
    }, []),
  );

  const loadStudents = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@students");
      if (jsonValue != null) {
        setStudents(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Loi khi load du lieu ", e);
    }
  };

  const deleteStudent = async (idToDelete: string) => {
    Alert.alert(t("Thong bao "), t("confirmDelete"), [
      { text: t("no"), style: "cancel" },
      {
        text: t("yes"),
        style: "destructive",
        onPress: async () => {
          const newStudents = students.filter(
            (student) => student.id !== idToDelete,
          );
          setStudents(newStudents);
          await AsyncStorage.setItem("@students", JSON.stringify(newStudents));
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Student }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        router.push({
          pathname: "/details",
          params: { studentData: JSON.stringify(item) },
        })
      }
    >
      <Image
        source={{ uri: item.avatar || "https://via.placeholder.com/50" }}
        style={styles.avatar}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.studentId}>{item.studentId}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/form",
              params: { studentData: JSON.stringify(item) },
            })
          }
        >
          <Text style={styles.editBtn}>{t("edit")}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteStudent(item.id)}>
          <Text style={styles.deleteBtn}>{t("delete")}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t("appListTitle")}</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Chua co sinh vien nao. Nhan "Them moi" de them
          </Text>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/form")}
      >
        <Text style={styles.addButtonText}>{t("addStudent")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  infoContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  studentId: { color: "#666" },
  actions: { flexDirection: "row", gap: 10 },
  editBtn: { color: "blue" },
  deleteBtn: { color: "red" },
  addButton: {
    backgroundColor: "#FF6D00",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function StudentDetailsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  // Nhận dữ liệu sinh viên từ Trang 1
  const { studentData } = useLocalSearchParams<{ studentData: string }>();

  let student = null;
  try {
    if (studentData) {
      student = JSON.parse(studentData);
    }
  } catch (e) {
    console.error("Lỗi parse dữ liệu sinh viên:", e);
  }

  if (!student) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Không tìm thấy thông tin sinh viên.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>{"< Quay lại"}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('studentDetails') || 'Chi tiết Sinh viên'}</Text>
          <View style={{ width: 80 }} /> 
        </View>

        <View style={styles.card}>
          <Image
            source={{ uri: student.avatar || 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('name') || 'Họ tên'}:</Text>
            <Text style={styles.value}>{student.name}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('studentId') || 'Mã số SV'}:</Text>
            <Text style={styles.value}>{student.studentId}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('email') || 'Email'}:</Text>
            <Text style={styles.value}>{student.email}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push({ pathname: '/form', params: { studentData: JSON.stringify(student) } })}
        >
          <Text style={styles.buttonText}>{t('edit') || 'Sửa thông tin'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  backBtnText: {
    fontSize: 16,
    color: '#FF6D00',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF6D00',
  },
  infoRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#2185D0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginTop: 50,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
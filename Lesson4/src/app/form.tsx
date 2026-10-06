import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function StudentFormScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { studentData } = useLocalSearchParams<{ studentData: string }>();

  //state
  const [id, setId] = useState<string>('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');

  //kiểm tra Mới hay Sửa
  const isEditing = !!id;

  useEffect(() => {
    if (studentData) {
      try {
        const student = JSON.parse(studentData);
        setId(student.id);
        setName(student.name);
        setStudentId(student.studentId);
        setEmail(student.email);
        setAvatar(student.avatar);
      } catch (e) {
        console.error('Loi parse du lieu sinh vien:', e);
      }
    }
  }, [studentData]);

  const saveToStorage = async (newStudent: any, isUpdate: boolean) => {
    try {
      const existingData = await AsyncStorage.getItem('@students');
      let students = existingData ? JSON.parse(existingData) : [];

      if (isUpdate) {
        //cập nhật sinh viên đã tồn tại
        students = students.map((s: any) => (s.id === newStudent.id ? newStudent : s));
      } else {
        //thêm/add
        students.push(newStudent);
      }

      await AsyncStorage.setItem('@students', JSON.stringify(students));
      
      //quay về trang chủ
      router.replace('/'); 
    } catch (e) {
      console.error('Loi luu du lieu: ', e);
    }
  };

  const handleSave = () => {
    //Validate không được bỏ trống
    if (!name.trim() || !studentId.trim() || !email.trim() || !avatar.trim()) {
      const errorMsg = t('validationError') || 'Vui lòng nhập đầy đủ thông tin!';
      Platform.OS === 'web' ? alert('Thong bao: ' + errorMsg) : Alert.alert('Thong bao', errorMsg);
      return;
    }

    //Validate định dạng MSSV (B + 2 chữ hoa + 22->26 + 4 số)
    const mssvRegex = /^B[A-Z]{2}2[2-6]\d{4}$/;
    if (!mssvRegex.test(studentId.trim())) {
      const errorMsg = 'Sai dinh dang MSSV. Vui long nhap lai (VD: BBA240146)';
      Platform.OS === 'web' ? alert('Thong bao: ' + errorMsg) : Alert.alert('Thong bao', errorMsg);
      return;
    }

    const studentToSave = {
      id: isEditing ? id : Date.now().toString(), //tao id moi
      name: name.trim(),
      studentId: studentId.trim(),
      email: email.trim(),
      avatar: avatar.trim(),
    };

    if (isEditing) {
      const confirmMsg = t('confirmEdit') || 'Bạn có muốn sửa thông tin SV không?';
      
      if (Platform.OS === 'web') {
        const confirmWeb = window.confirm(confirmMsg);
        if (confirmWeb) saveToStorage(studentToSave, true);
      } else {
        Alert.alert(
          t('Thong bao') || 'Xác nhận',
          confirmMsg,
          [
            { text: t('no') || 'Không', style: 'cancel' },
            { text: t('yes') || 'Có', onPress: () => saveToStorage(studentToSave, true) },
          ]
        );
      }
    } else {
      saveToStorage(studentToSave, false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>Hủy</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              {isEditing ? (t('edit') || 'Sửa Sinh Viên') : (t('addStudent') || 'Thêm Sinh Viên')}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>{t('name') || 'Họ tên SV'} *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nhập họ và tên"
            />

            <Text style={styles.label}>{t('studentId') || 'Mã số SV'} *</Text>
            <TextInput
              style={styles.input}
              value={studentId}
              onChangeText={setStudentId}
              placeholder="Nhập MSSV (VD: BBA240146)"
              autoCapitalize="characters"
            />

            <Text style={styles.label}>{t('email') || 'Email'} *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập địa chỉ email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>{t('avatarUrl') || 'Link ảnh Avatar'} *</Text>
            <TextInput
              style={styles.input}
              value={avatar}
              onChangeText={setAvatar}
              placeholder="Nhập URL hình ảnh (http...)"
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{t('save') || 'LƯU THÔNG TIN'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#F83030',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  saveButton: {
    backgroundColor: '#22B455',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
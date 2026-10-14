import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../services/api';

export default function CategoryManagementScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State cho Form Thêm/Sửa
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Tải cả danh mục và khóa học để lấy dữ liệu kiểm tra ràng buộc xóa
      const [catRes, courseRes] = await Promise.all([
        api.getCategories(),
        api.getCourses()
      ]);
      setCategories(catRes.data);
      setCourses(courseRes.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleSave = async () => {
    if (!name.trim()) {
      const msg = "Tên danh mục không được để trống!";
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Lỗi", msg);
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await api.updateCategory(editingId, { name, description });
        if (Platform.OS === 'web') window.alert("Sửa thành công!");
      } else {
        await api.addCategory({ name, description });
        if (Platform.OS === 'web') window.alert("Thêm thành công!");
      }
      // Reset form và tải lại dữ liệu
      setName('');
      setDescription('');
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: any) => {
    setName(cat.name);
    setDescription(cat.description);
    setEditingId(cat.id);
  };

  const handleDelete = (id: string) => {
    // 1. KIỂM TRA RÀNG BUỘC: Không cho xóa nếu đang có khóa học thuộc danh mục này
    const isCategoryUsed = courses.some(course => course.categoryId === id);
    if (isCategoryUsed) {
      const errorMsg = "Không thể xóa! Đang có khóa học thuộc danh mục này.";
      Platform.OS === 'web' ? window.alert(errorMsg) : Alert.alert("Cảnh báo", errorMsg);
      return;
    }

    // 2. Xác nhận xóa
    const confirmMsg = "Bạn có chắc chắn muốn xóa danh mục này?";
    if (Platform.OS === 'web') {
      const confirmWeb = window.confirm(confirmMsg);
      if (confirmWeb) {
        deleteCategoryAction(id);
      }
    } else {
      Alert.alert(
        "Xác nhận",
        confirmMsg,
        [
          { text: "Không", style: "cancel" },
          { text: "Có", style: "destructive", onPress: () => deleteCategoryAction(id) }
        ]
      );
    }
  };

  const deleteCategoryAction = async (id: string) => {
    try {
      setLoading(true);
      await api.deleteCategory(id);
      fetchData();
    } catch (error) {
      console.error("Lỗi xóa danh mục:", error);
    }
  };

  const cancelEdit = () => {
    setName('');
    setDescription('');
    setEditingId(null);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDesc}>{item.description || 'Không có mô tả'}</Text>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={() => handleEdit(item)}>
          <Text style={styles.actionText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item.id)}>
          <Text style={styles.actionText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>{"< Trở về"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý danh mục</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>{editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên danh mục..."
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mô tả..."
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.formActions}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{editingId ? 'Cập nhật' : 'Thêm mới'}</Text>
          </TouchableOpacity>
          {editingId && (
            <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
              <Text style={styles.cancelBtnText}>Hủy</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6D00" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6fa' },
  header: { padding: 16, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', elevation: 2 },
  backBtn: { marginRight: 16 },
  backBtnText: { color: '#2185D0', fontSize: 16, fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  formContainer: { padding: 16, backgroundColor: '#fff', margin: 16, borderRadius: 12, elevation: 2 },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#2c3e50' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 10, backgroundColor: '#fafafa' },
  formActions: { flexDirection: 'row', gap: 10 },
  saveBtn: { flex: 1, backgroundColor: '#27ae60', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  cancelBtn: { flex: 1, backgroundColor: '#e74c3c', padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelBtnText: { color: '#fff', fontWeight: 'bold' },
  listContainer: { paddingHorizontal: 16, paddingBottom: 50 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { flex: 1, paddingRight: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardDesc: { fontSize: 13, color: '#777', marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  editBtn: { backgroundColor: '#f39c12' },
  deleteBtn: { backgroundColor: '#e74c3c' },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});
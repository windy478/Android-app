import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../services/api';

export default function CourseListScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, courseRes] = await Promise.all([
        api.getCategories(),
        api.getCourses()
      ]);
      setCategories(catRes.data);
      setCourses(courseRes.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu API:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : 'Đang cập nhật...';
  };

  const filteredCourses = courses.filter(c => {
    const matchSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategoryId ? c.categoryId === selectedCategoryId : true;
    return matchSearch && matchCategory;
  });

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/course-details', params: { id: item.id } })}
    >
      <Image source={{ uri: item.thumbnail || 'https://via.placeholder.com/150' }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.category}>{getCategoryName(item.categoryId)}</Text>
        <Text style={styles.instructor}>GV: {item.instructor}</Text>
        <Text style={styles.price}>{Number(item.price).toLocaleString('vi-VN')} VNĐ</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Khóa học Online</Text>
        <TouchableOpacity 
          style={styles.categoryManageBtn} 
          onPress={() => router.push('/categories')}
        >
          <Text style={styles.categoryManageText}>QL Danh mục</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
         <TextInput
           style={styles.searchInput}
           placeholder="Tìm kiếm tên khóa học..."
           value={searchQuery}
           onChangeText={setSearchQuery}
         />
      </View>

      <View style={styles.filterContainer}>
        <FlatList
           horizontal
           showsHorizontalScrollIndicator={false}
           data={[{id: '', name: 'Tất cả'}, ...categories]}
           keyExtractor={item => item.id}
           renderItem={({item}) => (
             <TouchableOpacity
               style={[styles.filterBtn, selectedCategoryId === item.id && styles.filterBtnActive]}
               onPress={() => setSelectedCategoryId(item.id)}
             >
               <Text style={[styles.filterText, selectedCategoryId === item.id && styles.filterTextActive]}>
                 {item.name}
               </Text>
             </TouchableOpacity>
           )}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6D00" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có khóa học nào. Bấm dấu + để thêm nhé!</Text>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/course-form')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6fa' },
  header: { padding: 16, backgroundColor: '#fff', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  searchContainer: { padding: 16, paddingBottom: 8 },
  searchInput: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  filterContainer: { paddingHorizontal: 16, marginBottom: 12 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#e1e1e1', borderRadius: 20, marginRight: 8 },
  filterBtnActive: { backgroundColor: '#FF6D00' },
  filterText: { color: '#333', fontWeight: '500' },
  filterTextActive: { color: '#fff', fontWeight: 'bold' },
  listContainer: { padding: 16, paddingBottom: 100 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
  thumbnail: { width: 110, height: 110, backgroundColor: '#eee' },
  info: { flex: 1, padding: 12, justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  category: { fontSize: 13, color: '#FF6D00', fontWeight: 'bold' },
  instructor: { fontSize: 13, color: '#7f8c8d' },
  price: { fontSize: 15, fontWeight: 'bold', color: '#27ae60' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#7f8c8d', fontSize: 16 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#2185D0', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: -4 },
  header: { padding: 16, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
  categoryManageBtn: { backgroundColor: '#2185D0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  categoryManageText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { api } from '../services/api';

export default function CourseDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState<any>(null);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  // Dùng useFocusEffect thay vì useEffect để tự động tải lại dữ liệu mỗi khi quay về màn hình này
  useFocusEffect(
    useCallback(() => {
      const fetchCourseDetails = async () => {
        try {
          setLoading(true);
          const courseRes = await api.getCourseById(id as string);
          setCourse(courseRes.data);

          const catRes = await api.getCategories();
          const category = catRes.data.find((c: any) => c.id === courseRes.data.categoryId);
          if (category) {
            setCategoryName(category.name);
          }
        } catch (error) {
          console.error("Lỗi tải chi tiết:", error);
        } finally {
          setLoading(false);
        }
      };

      if (id) {
        fetchCourseDetails();
      }
    }, [id])
  );

  const handleDelete = () => {
    const confirmMsg = 'Bạn có chắc chắn muốn xóa khóa học này không?';

    if (Platform.OS === 'web') {
      const confirmWeb = window.confirm(confirmMsg);
      if (confirmWeb) {
        deleteCourseAction();
      }
    } else {
      Alert.alert(
        "Xác nhận xóa",
        confirmMsg,
        [
          { text: "Không", style: "cancel" },
          { text: "Có", style: "destructive", onPress: deleteCourseAction }
        ]
      );
    }
  };

  const deleteCourseAction = async () => {
    try {
      await api.deleteCourse(id as string);
      if (Platform.OS === 'web') {
          window.alert("Xóa thành công!");
      } else {
          Alert.alert("Thành công", "Đã xóa khóa học");
      }
      router.back();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FF6D00" style={{ marginTop: 50 }} />;
  }

  if (!course) {
    return <Text style={styles.errorText}>Không tìm thấy dữ liệu khóa học.</Text>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      {/* Sửa lại ResizeMode thành COVER để video tràn viền đen */}
      <View style={styles.videoContainer}>
        {course.trailerUrl ? (
          <Video
            style={styles.video}
            source={{ uri: course.trailerUrl }}
            useNativeControls
            resizeMode={ResizeMode.COVER} 
            isLooping={false}
          />
        ) : (
          <View style={styles.noVideo}>
            <Text style={{ color: '#fff' }}>Khóa học này chưa có Trailer</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>{"< Quay lại danh sách"}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.category}>Chuyên mục: {categoryName}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Giảng viên: <Text style={{fontWeight: 'bold'}}>{course.instructor}</Text></Text>
          <Text style={styles.infoText}>Thời lượng: <Text style={{fontWeight: 'bold'}}>{course.duration} giờ</Text></Text>
        </View>

        <Text style={styles.price}>{Number(course.price).toLocaleString('vi-VN')} VNĐ</Text>

        <Text style={styles.descTitle}>Mô tả chi tiết:</Text>
        <Text style={styles.description}>{course.description || 'Chưa có mô tả cho khóa học này.'}</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.btn, styles.editBtn]} 
            onPress={() => router.push({ pathname: '/course-form', params: { id: course.id } })}
          >
            <Text style={styles.btnText}>SỬA THÔNG TIN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={handleDelete}>
            <Text style={styles.btnText}>XÓA KHÓA HỌC</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  videoContainer: { width: '100%', aspectRatio: 16/9, backgroundColor: '#000' }, // Dùng aspectRatio để video cân đối theo mọi tỷ lệ màn hình
  video: { width: '100%', height: '100%' },
  noVideo: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16 },
  backBtn: { marginBottom: 12 },
  backBtnText: { color: '#2185D0', fontSize: 16, fontWeight: '500' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8 },
  category: { fontSize: 14, color: '#FF6D00', fontWeight: 'bold', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  infoText: { fontSize: 15, color: '#555' },
  price: { fontSize: 24, fontWeight: 'bold', color: '#27ae60', marginBottom: 20 },
  descTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  description: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 30 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  editBtn: { backgroundColor: '#f39c12' },
  deleteBtn: { backgroundColor: '#e74c3c' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  errorText: { textAlign: 'center', marginTop: 50, color: 'red', fontSize: 16 }
});
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator, Image, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { api } from '../services/api';
import { syncService } from '../services/sync';
import NetInfo from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';

export default function DishDetailsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  
  const [dish, setDish] = useState<any>(null);
  const [categoryName, setCategoryName] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // useFocusEffect: lấy dữ liệu mới nhất ở màn hình hiện tại
  useFocusEffect(
    useCallback(() => {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          const dishRes = await api.getDishById(id as string);
          setDish(dishRes.data);

          // tên danh mục
          const catRes = await api.getCategories();
          const category = catRes.data.find((c: any) => c.id === dishRes.data.BIT240268_DishCategoryId);
          if (category) {
            setCategoryName(category.BIT240268_Name);
          }

          // ảnh JSON
          try {
             const parsedImages = JSON.parse(dishRes.data.BIT240268_DishImage);
             if (Array.isArray(parsedImages)) {
                 setImages(parsedImages);
             }
          } catch(e) {
             setImages([]);
          }

        } catch (error) {
          console.error("Lỗi tải chi tiết:", error);
        } finally {
          setLoading(false);
        }
      };

      if (id) {
        fetchDetails();
      }
    }, [id])
  );

  const handleDelete = () => {
    const confirmMsg = t('confirm_delete') || 'Bạn có chắc chắn muốn xóa mục này không?';

    if (Platform.OS === 'web') {
      const confirmWeb = window.confirm(confirmMsg);
      if (confirmWeb) {
        deleteAction();
      }
    } else {
      Alert.alert(
        t('delete') || "Xóa",
        confirmMsg,
        [
          { text: t('no') || "Không", style: "cancel" },
          { text: t('yes') || "Có", style: "destructive", onPress: deleteAction }
        ]
      );
    }
  };

  const deleteAction = async () => {
    try {
      setLoading(true);
      const netState = await NetInfo.fetch();

      if (netState.isConnected) {
         await api.deleteDish(id as string);
         if (Platform.OS === 'web') window.alert("Đã xóa!");
      } else {
         await syncService.saveOfflineAction('DELETE', { id });
         const msg = "Đang lỗi mạng, sẽ tự xóa khi có mạng trở lại";
         Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Offline", msg);
      }
      router.back();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

  const getPrepTimeLabel = (time: number) => {
    return time <= 15 ? t('quick') : t('regular');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#e74c3c" style={{ marginTop: 50 }} />;
  }

  if (!dish) {
    return <Text style={styles.errorText}>Không tìm thấy dữ liệu.</Text>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <View style={styles.imageGallery}>
        {images.length > 0 ? (
           <FlatList
             horizontal
             showsHorizontalScrollIndicator={false}
             data={images}
             keyExtractor={(item, index) => index.toString()}
             renderItem={({ item }) => (
                <View style={styles.imageWrapper}>
                   <Image source={{ uri: item.ImageUrl }} style={styles.dishImage} />
                   {item.IsThumbnail && <Text style={styles.thumbnailBadge}>Thumbnail</Text>}
                </View>
             )}
           />
        ) : (
           <View style={styles.noImage}>
              <Text style={{color: '#999'}}>Chưa có ảnh</Text>
           </View>
        )}
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>{"< Quay lại"}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{dish.BIT240268_Name}</Text>
        <Text style={styles.category}>{categoryName}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            {t('prep_time')}: <Text style={{fontWeight: 'bold'}}>{dish.BIT240268_PreparationTime} {t('minutes')} ({getPrepTimeLabel(dish.BIT240268_PreparationTime)})</Text>
          </Text>
          <Text style={[styles.status, { color: dish.BIT240268_IsAvailable ? '#27ae60' : '#e74c3c' }]}>
            {dish.BIT240268_IsAvailable ? `● ${t('available')}` : `● ${t('out_of_stock')}`}
          </Text>
        </View>

        <Text style={styles.price}>{Number(dish.BIT240268_Price).toLocaleString()} VNĐ</Text>

        <Text style={styles.descTitle}>Mô tả:</Text>
        <Text style={styles.description}>{dish.BIT240268_Description || 'Chưa có mô tả chi tiết.'}</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.btn, styles.editBtn]} 
            onPress={() => router.push({ pathname: '/dish-form', params: { id: dish.id } })}
          >
            <Text style={styles.btnText}>{t('edit')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={handleDelete}>
            <Text style={styles.btnText}>{t('delete')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageGallery: { width: '100%', height: 220, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  dishImage: { width: 300, height: 220, resizeMode: 'cover', marginRight: 2 },
  imageWrapper: { position: 'relative' },
  thumbnailBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#e74c3c', color: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  noImage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16 },
  backBtn: { marginBottom: 12 },
  backBtnText: { color: '#e74c3c', fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
  category: { fontSize: 14, color: '#e67e22', fontWeight: 'bold', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
  infoText: { fontSize: 15, color: '#555' },
  status: { fontSize: 14, fontWeight: 'bold' },
  price: { fontSize: 26, fontWeight: 'bold', color: '#27ae60', marginBottom: 20 },
  descTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  description: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 30 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  editBtn: { backgroundColor: '#f39c12' },
  deleteBtn: { backgroundColor: '#e74c3c' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  errorText: { textAlign: 'center', marginTop: 50, color: 'red', fontSize: 16 }
});
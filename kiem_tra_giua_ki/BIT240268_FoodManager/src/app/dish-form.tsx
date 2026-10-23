import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { api } from '../services/api';
import { syncService } from '../services/sync';
import NetInfo from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';

export default function DishFormScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams(); 
  const isEditing = !!id;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState(''); 

  useEffect(() => {
    api.getCategories().then(res => {
      setCategories(res.data);
      if (res.data.length > 0 && !isEditing) {
        setCategoryId(res.data[0].id);
      }
    }).catch(err => console.log(err));

    if (isEditing) {
      api.getDishById(id as string).then(res => {
        const dish = res.data;
        setName(dish.BIT240268_Name);
        setPrice(dish.BIT240268_Price.toString());
        setPrepTime(dish.BIT240268_PreparationTime.toString());
        setIsAvailable(dish.BIT240268_IsAvailable);
        setDescription(dish.BIT240268_Description);
        setCategoryId(dish.BIT240268_DishCategoryId);

        try {
           const images = JSON.parse(dish.BIT240268_DishImage);
           if (images && images.length > 0) {
             setImageUrl(images[0].ImageUrl);
           }
        } catch(e) {}
      }).catch(err => console.log(err));
    }
  }, [id]);

  const showAlert = (title: string, msg: string) => {
    Platform.OS === 'web' ? window.alert(`${title}: ${msg}`) : Alert.alert(title, msg);
  };

  const handleSave = async () => {
    if (!name.trim() || !price.trim() || !prepTime.trim() || !categoryId) {
      showAlert("Lỗi", "Vui lòng nhập đủ Tên, Giá, Thời gian và chọn Loại món!");
      return;
    }

    if (Number(price) <= 0 || Number(prepTime) <= 0) {
      showAlert("Lỗi", "Giá và Thời gian chế biến phải lớn hơn 0!");
      return;
    }

    // ép kiểu mảng ảnh JSON
    const imageArray = imageUrl ? [{ ImageUrl: imageUrl, IsThumbnail: true }] : [];

    const dishData = {
      BIT240268_Name: name,
      BIT240268_Price: Number(price),
      BIT240268_PreparationTime: Number(prepTime),
      BIT240268_IsAvailable: isAvailable,
      BIT240268_Description: description,
      BIT240268_DishCategoryId: categoryId,
      BIT240268_DishImage: JSON.stringify(imageArray) 
    };

    setLoading(true);
    
    // offline mode
    const netState = await NetInfo.fetch();

    try {
      if (netState.isConnected) {
        if (isEditing) {
          await api.updateDish(id as string, dishData);
        } else {
          await api.addDish(dishData);
        }
        showAlert("Thành công", "Đã lưu dữ liệu lên hệ thống");
      } else {
        if (isEditing) {
           await syncService.saveOfflineAction('UPDATE', { id, ...dishData });
        } else {
           await syncService.saveOfflineAction('ADD', dishData);
        }
        showAlert("Đang Offline", "Đã lưu tạm vào máy. Sẽ tự đồng bộ khi có mạng");
      }
      router.back(); 
    } catch (error) {
       console.log(error);
       showAlert("Lỗi", "Có lỗi xảy ra khi lưu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>{"< Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? t('edit') : t('add_new')}</Text>
      </View>

      <Text style={styles.label}>Tên món ăn (*)</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="VD: Phở bò" />

      <Text style={styles.label}>Loại món ăn (*)</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={categoryId} onValueChange={setCategoryId}>
          {categories.map(cat => (
            <Picker.Item key={cat.id} label={cat.BIT240268_Name} value={cat.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.row}>
        <View style={{flex: 1, marginRight: 10}}>
          <Text style={styles.label}>{t('price')} (*)</Text>
          <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="VD: 50000" />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.label}>{t('prep_time')} (*)</Text>
          <TextInput style={styles.input} value={prepTime} onChangeText={setPrepTime} keyboardType="numeric" placeholder="VD: 15" />
        </View>
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Trạng thái: {isAvailable ? t('available') : t('out_of_stock')}</Text>
        <Switch value={isAvailable} onValueChange={setIsAvailable} />
      </View>

      <Text style={styles.label}>Mô tả chi tiết</Text>
      <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline numberOfLines={3} placeholder="Mô tả món ăn..." />

      <Text style={styles.label}>Link ảnh đại diện (Thumbnail URL)</Text>
      <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="https://..." />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? 'Đang lưu...' : 'LƯU DỮ LIỆU'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  backBtn: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 8, marginRight: 16 },
  backBtnText: { color: '#333', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 6, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, backgroundColor: '#fafafa' },
  textArea: { height: 80, textAlignVertical: 'top' },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 16, backgroundColor: '#fafafa' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  saveBtn: { backgroundColor: '#e74c3c', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
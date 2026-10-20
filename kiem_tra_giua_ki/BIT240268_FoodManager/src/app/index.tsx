import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Switch, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function HomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  // dữ liệu
  const [dishes, setDishes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // bộ lọc và tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');
  const [showFilters, setShowFilters] = useState(false);

  // ngôn ngữ
  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    await i18n.changeLanguage(newLang);
    await AsyncStorage.setItem('user-language', newLang);
  };

  // dữ liệu
  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, dishRes] = await Promise.all([
        api.getCategories(),
        api.getDishes()
      ]);
      setCategories(catRes.data);
      setDishes(dishRes.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // giữ trạng thái khi quay lại màn hình
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // phân loại thời gian nấu
  const getPrepTimeLabel = (time: number) => {
    return time <= 15 ? t('quick') : t('regular');
  };

  // ảnh thumbnail (JSON)
  const getThumbnail = (imageString: string) => {
    if (!imageString) return 'https://via.placeholder.com/100';
    try {
      const images = JSON.parse(imageString);
      const thumb = images.find((img: any) => img.IsThumbnail);
      return thumb ? thumb.ImageUrl : images[0]?.ImageUrl || 'https://via.placeholder.com/100';
    } catch {
      return 'https://via.placeholder.com/100';
    }
  };

  // lọc và sắp xếp (có logic)
  let filteredData = dishes.filter(item => {
    const matchName = item.BIT240268_Name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory ? item.BIT240268_DishCategoryId === selectedCategory : true;
    const matchStock = inStockOnly ? item.BIT240268_IsAvailable === true : true;
    
    const itemPrice = Number(item.BIT240268_Price);
    const matchMinPrice = minPrice ? itemPrice >= Number(minPrice) : true;
    const matchMaxPrice = maxPrice ? itemPrice <= Number(maxPrice) : true;

    return matchName && matchCat && matchStock && matchMinPrice && matchMaxPrice;
  });

  filteredData.sort((a, b) => {
    if (sortBy === 'price_asc') return Number(a.BIT240268_Price) - Number(b.BIT240268_Price);
    if (sortBy === 'price_desc') return Number(b.BIT240268_Price) - Number(a.BIT240268_Price);
    if (sortBy === 'time_asc') return Number(a.BIT240268_PreparationTime) - Number(b.BIT240268_PreparationTime);
    return 0;
  });

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({ pathname: '/dish-details', params: { id: item.id } })}
    >
      <Image source={{ uri: getThumbnail(item.BIT240268_DishImage) }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.BIT240268_Name}</Text>
        <Text style={styles.price}>{Number(item.BIT240268_Price).toLocaleString()} VNĐ</Text>
        
        <View style={styles.row}>
          <Text style={styles.prepTime}>🕒 {item.BIT240268_PreparationTime} {t('minutes')} ({getPrepTimeLabel(item.BIT240268_PreparationTime)})</Text>
        </View>

        <Text style={[styles.status, { color: item.BIT240268_IsAvailable ? '#27ae60' : '#e74c3c' }]}>
          {item.BIT240268_IsAvailable ? `● ${t('available')}` : `● ${t('out_of_stock')}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('food_manager')}</Text>
        <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage}>
          <Text style={styles.langBtnText}>{i18n.language === 'en' ? '🇻🇳 VN' : '🇬🇧 EN'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBlock}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('search_placeholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterToggleBtn} onPress={() => setShowFilters(!showFilters)}>
          <Text style={styles.filterToggleText}>⚙️ Filter/Sort</Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterPanel}>
          <View style={styles.filterRow}>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={selectedCategory} onValueChange={setSelectedCategory} style={{height: 40}}>
                <Picker.Item label={t('all_categories')} value="" />
                {categories.map(cat => (
                  <Picker.Item key={cat.id} label={cat.BIT240268_Name} value={cat.id} />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={sortBy} onValueChange={setSortBy} style={{height: 40}}>
                <Picker.Item label="Price: Low -> High" value="price_asc" />
                <Picker.Item label="Price: High -> Low" value="price_desc" />
                <Picker.Item label="Time: Fast -> Slow" value="time_asc" />
              </Picker>
            </View>
          </View>

          <View style={styles.filterRow}>
            <TextInput style={styles.priceInput} placeholder="Min Price" keyboardType="numeric" value={minPrice} onChangeText={setMinPrice} />
            <Text> - </Text>
            <TextInput style={styles.priceInput} placeholder="Max Price" keyboardType="numeric" value={maxPrice} onChangeText={setMaxPrice} />
            
            <View style={styles.switchWrapper}>
              <Switch value={inStockOnly} onValueChange={setInStockOnly} />
              <Text style={{fontSize: 12}}>In Stock</Text>
            </View>
          </View>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#FF6D00" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/dish-form')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6fa' },
  header: { padding: 16, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  langBtn: { padding: 8, backgroundColor: '#eee', borderRadius: 8 },
  langBtnText: { fontWeight: 'bold' },
  searchBlock: { padding: 16, flexDirection: 'row', gap: 10 },
  searchInput: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  filterToggleBtn: { backgroundColor: '#34495e', justifyContent: 'center', paddingHorizontal: 12, borderRadius: 8 },
  filterToggleText: { color: '#fff', fontWeight: 'bold' },
  filterPanel: { backgroundColor: '#fff', marginHorizontal: 16, padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 10 },
  pickerWrapper: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, backgroundColor: '#fafafa', overflow: 'hidden', justifyContent: 'center' },
  priceInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 8, backgroundColor: '#fafafa' },
  switchWrapper: { alignItems: 'center' },
  listContainer: { padding: 16, paddingBottom: 100 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, overflow: 'hidden', elevation: 2 },
  thumbnail: { width: 100, height: 100, backgroundColor: '#eee' },
  info: { flex: 1, padding: 12, justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 15, fontWeight: 'bold', color: '#e67e22', marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  prepTime: { fontSize: 12, color: '#7f8c8d' },
  status: { fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#e74c3c', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: -4 }
});
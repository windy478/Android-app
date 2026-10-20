import i18n from 'i18next';
import { initReactI18next } from 'react-i18next'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  en: {
    translation: {
      "food_manager": "Food Manager",
      "search_placeholder": "Search by name...",
      "all_categories": "All Categories",
      "add_new": "Add New",
      "price": "Price",
      "prep_time": "Prep Time",
      "minutes": "mins",
      "quick": "Quick",
      "regular": "Regular",
      "available": "Available",
      "out_of_stock": "Out of Stock",
      "edit": "Edit",
      "delete": "Delete",
      "confirm_delete": "Are you sure you want to delete this item?",
      "yes": "Yes",
      "no": "No",
      "language": "Language",
      "switch_lang": "Switch to Vietnamese"
    }
  },
  vi: {
    translation: {
      "food_manager": "Quản lý món ăn",
      "search_placeholder": "Tìm kiếm theo tên...",
      "all_categories": "Tất cả danh mục",
      "add_new": "Thêm mới",
      "price": "Giá",
      "prep_time": "Thời gian làm",
      "minutes": "phút",
      "quick": "Nhanh",
      "regular": "Thông thường",
      "available": "Đang bán",
      "out_of_stock": "Ngừng bán",
      "edit": "Sửa",
      "delete": "Xóa",
      "confirm_delete": "Bạn có chắc chắn muốn xóa mục này không?",
      "yes": "Có",
      "no": "Không",
      "language": "Ngôn ngữ",
      "switch_lang": "Chuyển sang Tiếng Anh"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', 
  fallbackLng: 'en',
  compatibilityJSON: 'v3', 
  interpolation: { escapeValue: false }
});

AsyncStorage.getItem('user-language')
  .then(lang => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
  })
  .catch(err => console.log('Lỗi lấy ngôn ngữ:', err));

export default i18n;
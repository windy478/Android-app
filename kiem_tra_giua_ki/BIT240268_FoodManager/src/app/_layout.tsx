import { Stack } from 'expo-router';
import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { syncService } from '../services/sync';
import { Alert, Platform } from 'react-native';

import '../i18n'; 

export default function Layout() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        // đồng bộ
        syncService.syncData().then((didSync) => {
          if (didSync) {
             const msg = "Đã đồng bộ dữ liệu offline lên hệ thống thành công!";
             Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Thông báo", msg);
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // ẩn thanh tiêu đề mặc định của hệ thống
  return <Stack screenOptions={{ headerShown: false }} />;
}
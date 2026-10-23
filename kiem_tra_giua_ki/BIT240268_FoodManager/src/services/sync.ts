import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

export const syncService = {
  saveOfflineAction: async (actionType: 'ADD' | 'UPDATE' | 'DELETE', data: any) => {
    try {
      const existingStr = await AsyncStorage.getItem('offline-actions');
      const actions = existingStr ? JSON.parse(existingStr) : [];
      actions.push({ actionType, data, timestamp: new Date().getTime() });
      await AsyncStorage.setItem('offline-actions', JSON.stringify(actions));
      console.log('Đã lưu offline 1 thao tác:', actionType);
    } catch (error) {
      console.error('Lỗi lưu offline:', error);
    }
  },

  // đẩy dữ liệu lên MockAPI
  syncData: async () => {
    try {
      const actionsStr = await AsyncStorage.getItem('offline-actions');
      if (!actionsStr) return false;
      
      const actions = JSON.parse(actionsStr);
      if (actions.length === 0) return false;

      console.log(`Bắt đầu đồng bộ ${actions.length} thao tác lên mạng...`);

      // đẩy dữ liệu
      for (const item of actions) {
        if (item.actionType === 'ADD') {
          await api.addDish(item.data);
        } else if (item.actionType === 'UPDATE') {
          await api.updateDish(item.data.id, item.data);
        } else if (item.actionType === 'DELETE') {
          await api.deleteDish(item.data.id);
        }
      }

      await AsyncStorage.removeItem('offline-actions');
      console.log('Đồng bộ hoàn tất!');
      return true;
    } catch (error) {
      console.error('Đồng bộ thất bại, có thể vẫn chưa có mạng:', error);
      return false;
    }
  }
};
import { Platform } from 'react-native';

export const Config = {
    API_URL: Platform.select({
        ios: 'http://192.168.1.10:3000',
        android: 'http://192.168.1.10:3000',
        default: 'http://192.168.1.10:3000',
    }),
};

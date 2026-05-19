import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '182427705211-2qiu01jp343n2o8aofhpjqpksn4iicbo.apps.googleusercontent.com',
  offlineAccess: false,
});

export { GoogleSignin };
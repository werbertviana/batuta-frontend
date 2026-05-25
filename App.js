// App.js

import 'react-native-url-polyfill/auto';
import './src/shims/backHandler';

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import Navigation from './src/navigation/StackNavigation';
import { AuthProvider } from './src/contexts/AuthContext';

const linking = {
  prefixes: ['batuta://'],

  config: {
    screens: {
      ResetPassword: {
        path: 'reset-password',

        parse: {
          token: token => `${token}`,
        },
      },
    },
  },
};

function App() {
  return (
    <AuthProvider>
      <NavigationContainer linking={linking}>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { loadUser } from './src/redux/actions/authActions';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  useEffect(() => {
    store.dispatch(loadUser() as any);
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigator />
        <StatusBar style="auto" />
        <Toast />
      </SafeAreaProvider>
    </Provider>
  );
}

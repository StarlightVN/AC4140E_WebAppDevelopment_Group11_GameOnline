import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { SessionProvider } from '@/src/context/SessionContext';
import { rootLayoutStyles as styles } from '@/src/styles';

export default function RootLayout() {
  return (
    <SessionProvider>
      <View style={styles.root}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ animation: 'slide_from_right', headerShown: false }} />
      </View>
    </SessionProvider>
  );
}

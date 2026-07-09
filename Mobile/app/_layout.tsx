import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { SessionProvider } from '@/src/context/SessionContext';
import { colors } from '@/src/theme';

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

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1,
  },
});

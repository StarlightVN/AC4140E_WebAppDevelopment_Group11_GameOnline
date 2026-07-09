import { Redirect } from 'expo-router';

import { LoadingView } from '@/components/LoadingView';
import { useSession } from '@/src/context/SessionContext';

export default function IndexScreen() {
  const { loading, session } = useSession();

  if (loading) {
    return <LoadingView label="Đang mở Quiz Arena..." />;
  }

  return <Redirect href={session ? '/home' : '/auth'} />;
}

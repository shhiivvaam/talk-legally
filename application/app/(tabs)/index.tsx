import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/auth.store';
import UserHome from '../../components/UserHome';
import LawyerDashboard from '../../components/LawyerDashboard';

export default function HomeScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {user?.role === 'lawyer' ? <LawyerDashboard /> : <UserHome />}
    </SafeAreaView>
  );
}

import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import axiosSecure from './axiosSecure';

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();

  // Query to fetch the role from the backend
  const { data: role = 'user', isLoading: roleLoading, error } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      try {
        // No token handling needed anymore
        const encodedEmail = encodeURIComponent(user.email);
        const res = await axiosSecure.get(`/api/users/${encodedEmail}/role`);
        return res.data.role;
      } catch (err) {
        console.error('Error fetching user role:', err);
        throw err;  // Rethrow error to be handled by React Query
      }
    },
  });

  return {
    role,
    roleLoading: authLoading || roleLoading,
    error,
  };
};

export default useUserRole;

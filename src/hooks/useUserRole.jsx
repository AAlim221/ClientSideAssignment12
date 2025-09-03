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
        // Ensure you get the latest token
        const token = await user?.getIdToken(true); // Get fresh token
        if (!token) throw new Error('Missing authorization token');

        const encodedEmail = encodeURIComponent(user.email);
        const res = await axiosSecure.get(`/api/users/${encodedEmail}/role`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Send the token in the header
          },
        });
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

import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/user.service';

// Custom Hook đóng vai trò Controller / State Manager cho React Component
export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = async (userData) => {
    try {
      const newUser = await userService.createUser(userData);
      setUsers((prev) => [...prev, newUser]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const removeUser = async (id) => {
    try {
      await userService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    removeUser
  };
}

import API from './api';

export const adminService = {
  // Get executive admin dashboard analytics metrics
  getAdminDashboard: async () => {
    const response = await API.get('/admin/dashboard');
    return response.data;
  },

  // Get inventory list with real database stock quantities
  getInventory: async () => {
    const response = await API.get('/admin/inventory');
    return response.data;
  },

  // Update product stock quantity in MongoDB Atlas
  updateInventoryStock: async (productId: string, stock: number, name?: string) => {
    const response = await API.put(`/admin/inventory/${productId}`, { stock, name });
    return response.data;
  },

  // Get all registered users from database
  getAllUsers: async () => {
    const response = await API.get('/admin/users');
    return response.data;
  },

  // Delete user account from database
  deleteUser: async (userId: string) => {
    const response = await API.delete(`/admin/users/${userId}`);
    return response.data;
  }
};

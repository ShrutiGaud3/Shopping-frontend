import API from './api';
import type { ShippingZone } from '../types';

export const shippingZoneService = {
  // Public - get active shipping zones
  getShippingZones: async (): Promise<{ success: boolean; data: ShippingZone[] }> => {
    try {
      const response = await API.get('/shipping-zones');
      if (response.data && Array.isArray(response.data.data)) {
        return { success: true, data: response.data.data };
      }
      return { success: false, data: [] };
    } catch (err) {
      console.error('Error fetching shipping zones:', err);
      return { success: false, data: [] };
    }
  },

  // Admin - get all shipping zones
  getAllShippingZonesAdmin: async (): Promise<{ success: boolean; data: ShippingZone[] }> => {
    try {
      const response = await API.get('/shipping-zones/admin');
      if (response.data && Array.isArray(response.data.data)) {
        return { success: true, data: response.data.data };
      }
      return { success: false, data: [] };
    } catch (err) {
      console.error('Error fetching admin shipping zones:', err);
      return { success: false, data: [] };
    }
  },

  // Admin - create shipping zone
  createShippingZone: async (zoneData: Partial<ShippingZone>) => {
    const response = await API.post('/shipping-zones', zoneData);
    return response.data;
  },

  // Admin - update shipping zone
  updateShippingZone: async (id: string, zoneData: Partial<ShippingZone>) => {
    const response = await API.put(`/shipping-zones/${id}`, zoneData);
    return response.data;
  },

  // Admin - delete shipping zone
  deleteShippingZone: async (id: string) => {
    const response = await API.delete(`/shipping-zones/${id}`);
    return response.data;
  }
};

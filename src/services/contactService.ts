import API from './api';

export interface ContactMessageData {
  name: string;
  email: string;
  orderNumber?: string;
  topic?: string;
  message: string;
}

export const contactService = {
  // Submit contact message to backend DB
  submitContactMessage: async (data: ContactMessageData) => {
    const response = await API.post('/contact', data);
    return response.data;
  },

  // Admin: Get all customer contact messages
  getAllContactMessages: async () => {
    const response = await API.get('/contact');
    return response.data;
  },

  // Admin: Update message status
  updateContactStatus: async (id: string, status: 'Pending' | 'Replied' | 'Resolved') => {
    const response = await API.put(`/contact/${id}`, { status });
    return response.data;
  }
};

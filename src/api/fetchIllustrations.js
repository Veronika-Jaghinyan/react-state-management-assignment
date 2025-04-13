import axios from 'axios';

export const fetchIllustrations = async (page, limit) => {
  try {
    const response = await axios.get(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
    return response.data.map(img => `https://picsum.photos/id/${img.id}/${100}/${100}`);
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
};

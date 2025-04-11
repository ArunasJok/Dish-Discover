<<<<<<< HEAD
// Production
// const BASE_URL = process.env.NODE_ENV === 'production' 
//   ? process.env.REACT_APP_API_URL 
//   : '';

// export const sendChatMessage = async (message, ingredients, history, authToken) => {
//   try {
//     const response = await fetch(`${BASE_URL}/api/ai/chat`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${authToken}`
//       },
//       body: JSON.stringify({
//         message,
//         ingredients,
//         history
//       })
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('AI chat request failed:', error);
//     throw error;
//   }
// };

//Development
import { API_URL } from '../config';

export const sendChatMessage = async (message, ingredients, history, authToken) => {
  try {
    const response = await fetch(`${API_URL}/api/ai/chat`, {
=======
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL 
  : '';

export const sendChatMessage = async (message, ingredients, history, authToken) => {
  try {
    const response = await fetch(`${BASE_URL}/api/ai/chat`, {
>>>>>>> 5cfe1a3de96ac884a0e9a0c9a6d61f05cc60c8f4
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        message,
        ingredients,
        history
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('AI chat request failed:', error);
    throw error;
  }
};
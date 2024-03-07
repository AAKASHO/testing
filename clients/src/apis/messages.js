import axios from 'axios';
import { REACT_APP_SERVER_URL } from '../helper.js';
const API = (token) =>
  axios.create({
    baseURL: REACT_APP_SERVER_URL,
    headers: { Authorization: token },
  });
export const sendMessage = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).post('/api/message/', body);
    return data;
  } catch (error) {
    console.log('error in sendmessage api' + error);
  }
};
export const fetchMessages = async (id) => {
  try {
    const token = localStorage.getItem('userToken');

    const { data } = await API(token).get(`/api/message/${id}`);
    return data;
  } catch (error) {
    console.log('error in fetch Message API ' + error);
  }
};

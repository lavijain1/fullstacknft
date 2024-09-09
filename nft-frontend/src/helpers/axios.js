import axios from 'axios';
import { baseapi } from '../apiconfig';

const token = window.localStorage.getItem('token');
export const axiosnew = axios.create({
    baseURL: baseapi,
    headers: {'Authorization' : token ? `Bearer ${token}`: ''}
})


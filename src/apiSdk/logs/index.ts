import axios from 'axios';
import queryString from 'query-string';
import { LogInterface, LogGetQueryInterface } from 'interfaces/log';
import { GetQueryInterface } from '../../interfaces';

export const getLogs = async (query?: LogGetQueryInterface) => {
  const response = await axios.get(`/api/logs${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createLog = async (log: LogInterface) => {
  const response = await axios.post('/api/logs', log);
  return response.data;
};

export const updateLogById = async (id: string, log: LogInterface) => {
  const response = await axios.put(`/api/logs/${id}`, log);
  return response.data;
};

export const getLogById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/logs/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteLogById = async (id: string) => {
  const response = await axios.delete(`/api/logs/${id}`);
  return response.data;
};

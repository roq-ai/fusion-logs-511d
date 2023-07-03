import axios from 'axios';
import queryString from 'query-string';
import { GameServerInterface, GameServerGetQueryInterface } from 'interfaces/game-server';
import { GetQueryInterface } from '../../interfaces';

export const getGameServers = async (query?: GameServerGetQueryInterface) => {
  const response = await axios.get(`/api/game-servers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createGameServer = async (gameServer: GameServerInterface) => {
  const response = await axios.post('/api/game-servers', gameServer);
  return response.data;
};

export const updateGameServerById = async (id: string, gameServer: GameServerInterface) => {
  const response = await axios.put(`/api/game-servers/${id}`, gameServer);
  return response.data;
};

export const getGameServerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/game-servers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteGameServerById = async (id: string) => {
  const response = await axios.delete(`/api/game-servers/${id}`);
  return response.data;
};

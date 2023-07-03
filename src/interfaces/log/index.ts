import { GameServerInterface } from 'interfaces/game-server';
import { GetQueryInterface } from 'interfaces';

export interface LogInterface {
  id?: string;
  game_server_id: string;
  player_id: string;
  date: any;
  type: string;
  permission: string;
  created_at?: any;
  updated_at?: any;

  game_server?: GameServerInterface;
  _count?: {};
}

export interface LogGetQueryInterface extends GetQueryInterface {
  id?: string;
  game_server_id?: string;
  player_id?: string;
  type?: string;
  permission?: string;
}

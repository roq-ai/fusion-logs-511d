import { LogInterface } from 'interfaces/log';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface GameServerInterface {
  id?: string;
  name: string;
  organization_id: string;
  created_at?: any;
  updated_at?: any;
  log?: LogInterface[];
  organization?: OrganizationInterface;
  _count?: {
    log?: number;
  };
}

export interface GameServerGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  organization_id?: string;
}

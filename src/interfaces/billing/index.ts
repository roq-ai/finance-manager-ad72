import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface BillingInterface {
  id?: string;
  cost: number;
  due_date: any;
  category: string;
  paid_status: boolean;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  _count?: {};
}

export interface BillingGetQueryInterface extends GetQueryInterface {
  id?: string;
  category?: string;
  organization_id?: string;
}

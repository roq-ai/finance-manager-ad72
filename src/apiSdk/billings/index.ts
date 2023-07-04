import axios from 'axios';
import queryString from 'query-string';
import { BillingInterface, BillingGetQueryInterface } from 'interfaces/billing';
import { GetQueryInterface } from '../../interfaces';

export const getBillings = async (query?: BillingGetQueryInterface) => {
  const response = await axios.get(`/api/billings${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBilling = async (billing: BillingInterface) => {
  const response = await axios.post('/api/billings', billing);
  return response.data;
};

export const updateBillingById = async (id: string, billing: BillingInterface) => {
  const response = await axios.put(`/api/billings/${id}`, billing);
  return response.data;
};

export const getBillingById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/billings/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBillingById = async (id: string) => {
  const response = await axios.delete(`/api/billings/${id}`);
  return response.data;
};

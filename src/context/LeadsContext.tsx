import { createContext } from 'react';
import type { LeadsContextType } from '../types';

export const LeadsContext = createContext<LeadsContextType>({
  leads: [],
  setLeads: () => {},
  updateLead: () => {},
  reloadLeads: () => {},
});
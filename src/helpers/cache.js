import { makeVar } from '@apollo/client';
// storage
import { getAuthStore } from './storage';

export const storeDataVar = makeVar(getAuthStore() || {});

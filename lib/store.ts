import { configureStore } from '@reduxjs/toolkit'
import sampleImageSlice from '@/lib/features/sampleImageSlice'

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; //

// export const makeStore = (reducer = {}) => {
//   return configureStore({
//     reducer: {
//       sampleImage: sampleImageSlice
//     }
//   })
// }

const persistConfig = {
  key: 'root', // Key for storage
  storage, // Storage engine (local storage by default)
  whitelist: ['sampleImage'], // List of slices to persist (only 'auth' in this case)
};

const persistedReducer = persistReducer(persistConfig, sampleImageSlice);

export const store = configureStore({
  reducer: persistedReducer,
});
export const persistor = persistStore(store);
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import categoriesReducer from './slices/categoriesSlice';
import productsReducer from './slices/productsSlice';
import ordersReducer from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    categories: categoriesReducer,
    products: productsReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



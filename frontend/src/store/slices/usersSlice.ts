import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import { User } from '../../types/types';

export interface UsersState {
  items: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<User[]>('users/fetchAll', async () => {
  const res = await api.get<User[]>('users');
  return res.data;
});

export const createUser = createAsyncThunk<User, Partial<User>>('users/create', async (payload) => {
  const res = await api.post<User>('users', payload);
  return res.data;
});

export const updateUser = createAsyncThunk<User, { id: string; data: Partial<User> }>('users/update', async ({ id, data }) => {
  const res = await api.put<User>(`users/${id}`, data);
  return res.data;
});

export const deleteUser = createAsyncThunk<string, string>('users/delete', async (id) => {
  await api.delete(`users/${id}`);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUsersState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })

      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const idx = state.items.findIndex(u => u._id === action.payload._id);
        if (idx > -1) state.items[idx] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(u => u._id !== action.payload);
      });
  }
});

export const { resetUsersState } = usersSlice.actions;
export default usersSlice.reducer;



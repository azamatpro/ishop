'use client';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentShop: null,
  error: null,
  loading: false,
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    createShopStart: (state) => {
      state.loading = true;
    },
    createShopSuccess: (state, action) => {
      state.currentShop = action.payload;
      state.loading = false;
      state.error = null;
    },
    createShopFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateShopStart: (state) => {
      state.loading = true;
    },
    updateShopSuccess: (state, action) => {
      state.currentShop = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateShopFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    deleteShopStart: (state) => {
      state.loading = true;
    },
    deleteShopSuccess: (state, action) => {
      state.currentShop = null;
      state.loading = false;
      state.error = null;
    },
    deleteShopFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  createShopStart,
  createShopSuccess,
  createShopFailure,
  updateShopStart,
  updateShopSuccess,
  updateShopFailure,
  deleteShopStart,
  deleteShopSuccess,
  deleteShopFailure,
} = shopSlice.actions;
export default shopSlice.reducer;

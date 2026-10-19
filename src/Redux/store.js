import { configureStore } from '@reduxjs/toolkit';
import products from './slicers/ProductListSlice';
import planList from './slicers/PlanListSlice';
import optionList from './slicers/OptionListSlice';
import shoppingListWithStoreStock from './slicers/ShoppingListWithStoreStockSlice.js';
const store = configureStore({
  reducer: {
    products,
    planList,
    optionList,
    shoppingListWithStoreStock,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      // serializableCheck: {warnAfter: 128},
      serializableCheck: false,
    }),
});

export default store;

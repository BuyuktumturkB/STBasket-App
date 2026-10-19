import {createSlice} from '@reduxjs/toolkit';
import {removeFromOptionsList} from './OptionListSlice';

const initialState = {
  ShoppingListWithStoreStockItems: [],
};
const ShoppingListWithStoreStockSlice = createSlice({
  name: 'shoppingListWithStoreStock',
  initialState,
  reducers: {
    addToShoppingListWithStore: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.ShoppingListWithStoreStockItems.find(
        item => item.name === newItem.name,
      );
      if (!existingItem) {
        state.ShoppingListWithStoreStockItems.push(newItem);
      } else {
        state.ShoppingListWithStoreStockItems =
          state.ShoppingListWithStoreStockItems.map(item =>
            item.name === newItem.name ? newItem : item,
          );
      }
    },
    removeFromShoppingListWithStore: (state, action) => {
      state.ShoppingListWithStoreStockItems =
        state.ShoppingListWithStoreStockItems.filter(
          item => item.name !== action.payload,
        );
    },
    resetShoppingListWithStore: state => {
      state.ShoppingListWithStoreStockItems = [];
    },
  },
});
export const {
  addToShoppingListWithStore,
  removeFromShoppingListWithStore,
  resetShoppingListWithStore,
} = ShoppingListWithStoreStockSlice.actions;
export default ShoppingListWithStoreStockSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  optionListItems: [],
};

const OptionListSlice = createSlice({
  name: 'optionList',
  initialState,
  reducers: {
    addToOptionsList: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.optionListItems.find(
        item => item.name === newItem.name,
      );
      if (!existingItem) {
        state.optionListItems.push(newItem);
      } else {
        state.optionListItems = state.optionListItems.map(item =>
          item.name === newItem.name ? newItem : item,
        );
      }
    },
    removeFromOptionsList: (state, action) => {
      state.optionListItems = state.optionListItems.filter(
        item => item.name !== action.payload,
      );
    },

    resetOptionList: state => {
      state.optionListItems = [];
    },
  },
});

export const {addToOptionsList, removeFromOptionsList, resetOptionList} =
  OptionListSlice.actions;
export default OptionListSlice.reducer;

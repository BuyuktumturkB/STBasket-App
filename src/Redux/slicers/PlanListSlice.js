import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  planListItems: [], // web socket verileri burada saklanacak
};

const PlanListSlice = createSlice({
  name: 'planList',
  initialState,
  reducers: {
    updatePlanList: (state, action) => {
      if (action.payload) {
        state.planListItems = action.payload;
      }
    },
  },
});

export const {updatePlanList} = PlanListSlice.actions;
export default PlanListSlice.reducer;

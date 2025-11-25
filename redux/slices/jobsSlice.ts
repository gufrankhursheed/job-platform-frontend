import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JobsState {
  loading: boolean | null;
  savedJobsCount: number;
}

const initialState: JobsState = {
  loading: null,
  savedJobsCount: 0,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setSavedJobsCount: (
        state, 
        action: PayloadAction<number>
    ) => {
      state.savedJobsCount = action.payload;
    },
  },
});

export const { setSavedJobsCount } = jobsSlice.actions;
export default jobsSlice.reducer;

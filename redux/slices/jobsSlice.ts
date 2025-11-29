import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JobsState {
  loading: boolean | null;
  savedJobsCount: number;
  totalJobsPosted: number;
}

const initialState: JobsState = {
  loading: null,
  savedJobsCount: 0,
  totalJobsPosted: 0,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setSavedJobsCount: (state, action: PayloadAction<number>) => {
      state.savedJobsCount = action.payload;
    },
    setTotalJobsPosted: (state, action: PayloadAction<number>) => {
      state.totalJobsPosted = action.payload;
    },
  },
});

export const { setSavedJobsCount, setTotalJobsPosted } = jobsSlice.actions;
export default jobsSlice.reducer;

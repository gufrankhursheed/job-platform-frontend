import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JobsState {
  loading: boolean | null;
  savedJobsCount: number;
  totalJobsPosted: number;
  savedJobs: string[];
}

const initialState: JobsState = {
  loading: null,
  savedJobsCount: 0,
  totalJobsPosted: 0,
  savedJobs: [],
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
    setSavedJobs: (state, action: PayloadAction<string[]>) => {
      state.savedJobs = action.payload;
      state.savedJobsCount = action.payload.length;
    },
    addSavedJob: (state, action: PayloadAction<string>) => {
      if (!state.savedJobs.includes(action.payload)) {
        state.savedJobs.push(action.payload);
        state.savedJobsCount += 1;
      }
    },
    removeSavedJob: (state, action: PayloadAction<string>) => {
      state.savedJobs = state.savedJobs.filter((id) => id !== action.payload);
      state.savedJobsCount = state.savedJobs.length;
    },
  },
});

export const { setSavedJobsCount, setTotalJobsPosted, setSavedJobs, addSavedJob, removeSavedJob } = jobsSlice.actions;
export default jobsSlice.reducer;

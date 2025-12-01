import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ApplicationsSlice {
  loading: boolean | null;
  applicationsCount: number;
  totalApplicants: number;
  appliedJobs: string[];
}
const initialState: ApplicationsSlice = {
  loading: null,
  applicationsCount: 0,
  totalApplicants: 0,
  appliedJobs: [],
};

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    setApplicationsCount: (state, action: PayloadAction<number>) => {
      state.applicationsCount = action.payload;
    },
    setTotalApplicants: (state, action: PayloadAction<number>) => {
      state.totalApplicants = action.payload;
    },
    setAppliedJobs: (state, action: PayloadAction<string[]>) => {
      state.appliedJobs = action.payload; 
    },
    addAppliedJob: (state, action: PayloadAction<string>) => {
      if (!state.appliedJobs.includes(action.payload)) {
        state.appliedJobs.push(action.payload);
        state.applicationsCount += 1;
      }
    },
  },
});

export const { setApplicationsCount, setTotalApplicants, setAppliedJobs, addAppliedJob } =
  applicationsSlice.actions;
export default applicationsSlice.reducer;

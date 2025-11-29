import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ApplicationsSlice {
  loading: boolean | null;
  applicationsCount: number;
  totalApplicants: number;
}
const initialState: ApplicationsSlice = {
  loading: null,
  applicationsCount: 0,
  totalApplicants: 0,
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
  },
});

export const { setApplicationsCount, setTotalApplicants } = applicationsSlice.actions;
export default applicationsSlice.reducer;

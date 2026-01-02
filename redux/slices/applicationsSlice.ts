import { apiFetch } from "@/utils/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

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

export const fetchAppliedJobs = createAsyncThunk<
  { ids: string[]; count: number },
  string
>("applications/fetchAppliedJobs", async (candidateId) => {
  const res = await apiFetch(`application/candidate/${candidateId}`, {
    method: "GET",
  });

  const data = await res.json();

  return {
    ids:  data.applications?.map((app: any) => String(app.job?.id)).filter(Boolean) || [],
    count: data.pagination?.totalItems || 0,
  };
});

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppliedJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedJobs = action.payload.ids;
        state.applicationsCount = action.payload.count;
      })
      .addCase(fetchAppliedJobs.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setApplicationsCount,
  setTotalApplicants,
  setAppliedJobs,
  addAppliedJob,
} = applicationsSlice.actions;
export default applicationsSlice.reducer;

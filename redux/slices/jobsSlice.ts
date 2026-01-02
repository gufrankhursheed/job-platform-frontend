import { apiFetch } from "@/utils/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Job {
  id: number;
  title: string;
  status: "open" | "closed";
  [key: string]: any;
}

interface JobsState {
  loading: boolean | null;
  savedJobsCount: number;
  totalJobsPosted: number;
  savedJobs: string[];
  recruiterJobs: Job[];
  activeJobs: Job[];
  closedJobs: Job[];
}

const initialState: JobsState = {
  loading: null,
  savedJobsCount: 0,
  totalJobsPosted: 0,
  savedJobs: [],
  recruiterJobs: [],
  activeJobs: [],
  closedJobs: [],
};

export const fetchSavedJobs = createAsyncThunk<{
  ids: string[];
  count: number;
}>("jobs/fetchSavedJobs", async () => {
  const res = await apiFetch("job/saved/", { method: "GET" });
  const data = await res.json();

  return {
    ids: data.savedJobs?.map((job: any) => String(job.id)) || [],
    count: data.pagination?.totalItems || 0,
  };
});

export const fetchRecruiterJobs = createAsyncThunk<Job[], string>(
  "jobs/fetchRecruiterJobs",
  async (employerId, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`job/employer/${employerId}`, {
        method: "GET",
      });

      const data = await res.json();

      return data.jobs || [];
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch recruiter jobs"
      );
    }
  }
);

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
    setRecruiterJobs: (state, action: PayloadAction<Job[]>) => {
      state.recruiterJobs = action.payload;
      state.activeJobs = action.payload.filter((j) => j.status === "open");
      state.closedJobs = action.payload.filter((j) => j.status === "closed");
      state.totalJobsPosted = action.payload.length;
    },
    updateJobStatus: (
      state,
      action: PayloadAction<{ id: number; status: "open" | "closed" }>
    ) => {
      const { id, status } = action.payload;

      state.recruiterJobs = state.recruiterJobs.map((job) =>
        job.id === id ? { ...job, status } : job
      );

      state.activeJobs = state.recruiterJobs.filter((j) => j.status === "open");
      state.closedJobs = state.recruiterJobs.filter(
        (j) => j.status === "closed"
      );
    },
    addNewJob: (state, action: PayloadAction<Job>) => {
      state.recruiterJobs.push(action.payload);
      state.totalJobsPosted = state.recruiterJobs.length;
      state.activeJobs = state.recruiterJobs.filter((j) => j.status === "open");
      state.closedJobs = state.recruiterJobs.filter(
        (j) => j.status === "closed"
      );
    },
    updateExistingJob: (state, action: PayloadAction<Job>) => {
      state.recruiterJobs = state.recruiterJobs.map((job) =>
        job.id === action.payload.id ? action.payload : job
      );

      state.activeJobs = state.recruiterJobs.filter((j) => j.status === "open");
      state.closedJobs = state.recruiterJobs.filter(
        (j) => j.status === "closed"
      );
    },
    removeJob: (state, action: PayloadAction<number>) => {
      const jobId = action.payload;

      state.recruiterJobs = state.recruiterJobs.filter((j) => j.id !== jobId);
      state.activeJobs = state.activeJobs.filter((j) => j.id !== jobId);
      state.closedJobs = state.closedJobs.filter((j) => j.id !== jobId);

      state.totalJobsPosted = state.recruiterJobs.length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.savedJobs = action.payload.ids;
        state.savedJobsCount = action.payload.count;
      })
      .addCase(fetchSavedJobs.rejected, (state) => {
        state.loading = false;
      })
      
      .addCase(fetchRecruiterJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecruiterJobs.fulfilled, (state, action) => {
        state.loading = false;

        state.recruiterJobs = action.payload;
        state.activeJobs = action.payload.filter((j) => j.status === "open");
        state.closedJobs = action.payload.filter((j) => j.status === "closed");
        state.totalJobsPosted = action.payload.length;
      })
      .addCase(fetchRecruiterJobs.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setSavedJobsCount,
  setTotalJobsPosted,
  setSavedJobs,
  addSavedJob,
  removeSavedJob,
  setRecruiterJobs,
  updateJobStatus,
  addNewJob,
  updateExistingJob,
  removeJob,
} = jobsSlice.actions;
export default jobsSlice.reducer;

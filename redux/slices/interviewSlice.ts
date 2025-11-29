import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InterviewSlice {
  loading: boolean | null;
  candidateInterviewsCount: number;
  recruiterInterviewsCount: number;
}

const initialState: InterviewSlice = {
  loading: null,
  candidateInterviewsCount: 0,
  recruiterInterviewsCount: 0,
};

const interviewSlice = createSlice({
  name: "interviews",
  initialState,
  reducers: {
    setCandidateInterviewsCount: (state, action: PayloadAction<number>) => {
      state.candidateInterviewsCount = action.payload;
    },
    setRecruiterInterviewsCount: (state, action: PayloadAction<number>) => {
      state.recruiterInterviewsCount = action.payload;
    },
  },
});

export const { setCandidateInterviewsCount, setRecruiterInterviewsCount } =
  interviewSlice.actions;
export default interviewSlice.reducer;

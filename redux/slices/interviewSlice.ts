import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InterviewSlice {
    loading: boolean | null;
    interviewsCount: number;
}

const initialState: InterviewSlice = {
    loading: null,
    interviewsCount: 0
}

const interviewSlice = createSlice({
    name: "interviews",
    initialState,
    reducers: {
        setInterviewsCount: (
            state,
            action: PayloadAction<number>
        ) => {
            state.interviewsCount = action.payload;
        }
    }
})

export const { setInterviewsCount } = interviewSlice.actions;
export default interviewSlice.reducer;
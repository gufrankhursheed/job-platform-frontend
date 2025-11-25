import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ApplicationsSlice {
    loading: boolean | null;
    applicationsCount: number;
}
const initialState: ApplicationsSlice = {
    loading: null,
    applicationsCount: 0
}

const applicationsSlice = createSlice({
    name: "applications",
    initialState,
    reducers: {
        setApplicationsCount: (
            state,
            action: PayloadAction<number>
        ) => {
            state.applicationsCount = action.payload;
        }
    }
})

export const { setApplicationsCount } = applicationsSlice.actions;
export default applicationsSlice.reducer;

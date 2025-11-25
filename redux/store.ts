import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import applicationsReducer from "./slices/applicationsSlice";
import interviewReducer from "./slices/interviewSlice";
import jobsReducer from "./slices/jobsSlice";
import chatReducer from "./slices/chatSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        applications: applicationsReducer,
        interview: interviewReducer,
        jobs: jobsReducer,
        chat: chatReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
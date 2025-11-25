import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  unreadCount: number;
}

const initialState: ChatState = {
  unreadCount: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
    increaseUnread(state) {
      state.unreadCount += 1;
    },
    clearUnread(state) {
      state.unreadCount = 0;
    },
  },
});

export const { setUnreadCount, increaseUnread, clearUnread } = chatSlice.actions;

export default chatSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import danmakuReducer from './features/danmakuSlice';
import counterReducer from './features/counterSlice';
import configReducer from './features/configSlice';

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    danmaku: danmakuReducer,
    counter: counterReducer,
    config: configReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import slideSlice from './slideSlice';
import uiSlice from './uiSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        slide: slideSlice,
        ui: uiSlice
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

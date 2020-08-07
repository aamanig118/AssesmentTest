import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metrics: [],
  selectedMetrics: []
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricDataReceived: (state, action) => {
      const metrics = action.payload;
      return {
        ...state,
        metrics
      };
    },
    metricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    metricSelectionChange: (state, action) => {
      const metrics = action.payload;
      return {
        ...state,
        selectedMetrics: metrics
      };
    }
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

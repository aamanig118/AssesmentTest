import { createSlice } from 'redux-starter-kit';
import { TimeSeries } from "pondjs";

const initialState = {};
type tplotOptions = {
  [key: string]: TimeSeries
}
const slice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    setReceivedMeasurement: (state, action) => {
      const { metric, measurement } = action.payload;
      const { at, value, unit } = measurement;
      const points = [[at, value, unit]];
      const series = new TimeSeries({
          name: metric,
          columns: ["time", "value", "unit"],
          points
        });
        const updatedState: tplotOptions = {...state};
        const timeseries: any = TimeSeries;
        if (!updatedState[metric]) {
          updatedState[metric] = series;
        } else {
          updatedState[metric] = timeseries.timeSeriesListMerge({
            name: metric,
            seriesList: [updatedState[metric], series]
          });
        }
      
        return updatedState;
    },
    setMultipleReceivedMeasurement: (state, action) => {
      let updatedState = {...state};
         updatedState = action.payload.reduce((accum: Record<string, TimeSeries>, elem: {metric: string, measurements: Array<{at:number, value: number, unit: string}>}) => {
          const {
              metric,
              measurements
          } = elem;
          const points = measurements.map((m: {at: number, value: number, unit: string}) => [m.at, m.value, m.unit]);

          const series = new TimeSeries({
              name: metric,
              columns: ["time", "value", "unit"],
              points
          });

          if (!accum[metric]) {
              accum[metric] = series;
          } else {
            const timeseries: any = TimeSeries;
              accum[metric] = timeseries.timeSeriesListMerge({
                  name: metric,
                  seriesList: [accum[metric], series]
              });
          }
   
          return accum;
      }, updatedState);
      return updatedState;
    }
  },
});


export const reducer =  slice.reducer;
export const actions = slice.actions

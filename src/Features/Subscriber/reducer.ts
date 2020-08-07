import { createSlice, PayloadAction } from 'redux-starter-kit';
import { TimeSeries } from "pondjs";

const setReceivedMeasurement = (data: any) => {
  return {
    type: 'MEASUREMENT_RECEIVED',
    data
  }
}

const setMultipleReceivedMeasurement = (data: any) => {
  return {
    type: 'MULTIPLE_MEASUREMENT_RECEIVED',
    data
  }
}

export type ApiErrorAction = {
  error: string;
};

const initialState = {
 };


const Subscriber = (state = initialState, action: any) => {
  switch(action.type) {
    case 'MEASUREMENT_RECEIVED': 
    { 
      const { metric, measurement } = action.data;
      const { at, value, unit } = measurement;
      const points = [[at, value, unit]];
      const series = new TimeSeries({
          name: metric,
          columns: ["time", "value", "unit"],
          points
        });
        const updatedState: any = {...state};
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
      }
      case 'MULTIPLE_MEASUREMENT_RECEIVED':
       {
         let updatedState = {...state};
         updatedState = action.data.reduce((accum: any, elem: any) => {
          const {
              metric,
              measurements
          } = elem;
          const points = measurements.map((m: any) => [m.at, m.value, m.unit]);

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
      
      default :
      return state;
  }
}

export const reducer =  Subscriber;
export const actions = {setReceivedMeasurement, setMultipleReceivedMeasurement}

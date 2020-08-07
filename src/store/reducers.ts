import { reducer as metricrReducer } from '../Features/Metrics/reducer';
import {reducer as subscriberReducer} from '../Features/Subscriber/reducer';

export default {
  metrics: metricrReducer,
  measurements: subscriberReducer
};

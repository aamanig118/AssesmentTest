import { spawn } from 'redux-saga/effects';
import metricsSaga from '../Features/Metrics/saga';

export default function* root() {
    yield spawn(metricsSaga);
}
import React from 'react';
import createStore, { IState } from './store';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import Subscriber from './Features/Subscriber/Subscriber';
import Chart from './Features/Charts/Charts';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import {
  Provider as UrqProvider,
  Client,
  defaultExchanges,
  subscriptionExchange
} from "urql";
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Card from '../src/Features/Card';

const useStyles = makeStyles({
  cardlayout: {
   height: "100px",
   float: "left",
   marginBottom: "50px"
  },
});

const subscriptionClient = new SubscriptionClient(
  'wss://react.eogresources.com/graphql',
  {
    reconnect: true,
    timeout: 20000
  }
);

const client = new Client({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        return subscriptionClient.request(operation);
      },
    }),
  ],
});

const store = createStore();
const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: '#fff',
    },
  },
});

const getMetrics = (state: IState) => {
  return state.metrics;
};

function MetricCard() {
  const classes = useStyles();
  const { selectedMetrics} = useSelector(getMetrics);
  return (<div className={classes.cardlayout}>{selectedMetrics.map((item: string, index: number) => <Card metric={item} key={index}/>)}</div>);
}

const App = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <UrqProvider value={client}>
      <Subscriber />
        <Wrapper>
        <Header />
        <MetricCard />
        <Chart />
      </Wrapper>
      </UrqProvider>
    </Provider>
  </MuiThemeProvider>
);

export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import WebTorrent from "webtorrent";
import Home from './Pages/Home';

const client = new WebTorrent();
const StoreContext = React.createContext({
  client,
  theme: 'dark',
});

export default function App() {
  return (
    <StoreContext.Provider>
      <Router>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </StoreContext.Provider>
  );
}
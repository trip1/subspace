import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import Home from './Pages/Home';
import Broadcaster from "./Pages/WebRTC/Broadcaster";
import Watcher from "./Pages/WebRTC/Watcher";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/broadcaster">
          <Broadcaster />
        </Route>
        <Route path="/watcher">
          <Watcher />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import Torrent from './Pages/Torrent';
import Broadcaster from "./Pages/WebRTC/Broadcaster";
import Watcher from "./Pages/WebRTC/Watcher";
import Home from './Pages/Home';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/stream">
          <Broadcaster />
        </Route>
        <Route path="/watch">
          <Watcher />
        </Route>
        <Route path="/torrent">
          <Torrent />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";

import ScoreBoard from "./components/ScoreBoard.js";
import EditableScoreBoard from "./components/EditableScoreBoard.js";
import Welcome from "./components/Welcome.js";
import NotFound from "./components/NotFound.js";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }

  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#222";
    } else {
      document.body.style.backgroundColor = "#eee";
    }
  }, [darkMode]);

  return (
    <div>
      <div
        className={"mode-toggle darkmode-" + darkMode}
        onClick={toggleDarkMode}
      >
        ☀
      </div>
      <div className={"App darkmode-" + darkMode}>
        <Router>
          <Switch>
            <Route exact path="/">
              <Welcome />
            </Route>
            <Route path="/room/:roomId/edit">
              <EditableScoreBoard />
            </Route>
            <Route path="/room/:roomId">
              <ScoreBoard />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

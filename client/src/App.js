import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./App.css";

import ScoreBoard from "./components/ScoreBoard.js";
import ScoreEditor from "./components/ScoreEditor.js";
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
            <Route exact path="/" children={<Welcome />} />
            <Route path="/room/:roomId/edit" children={<ScoreEditor />} />
            <Route path="/room/:roomId" children={<ScoreBoard />} />
            <Route children={<NotFound />} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

import ScoreBoard from "./components/ScoreBoard.js";
import EditableScoreBoard from "./components/EditableScoreBoard.js";
import Welcome from "./components/Welcome.js";
import NotFound from "./components/NotFound.js";

const GlobalStyle = createGlobalStyle`
    body {
      font-size: 24px;
      color: #fff;
      background-color: #222;
    }

    h1, h2 {
      text-align: center;
    }

    h1 {
      font-size: 64px;
    }

    h2 {
      font-size: 32px;
    }
  `;

export default function App() {
  return (
    <div>
      <div className="App">
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
        <GlobalStyle />
      </div>
    </div>
  );
}

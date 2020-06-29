import React, { Component } from "react";
import "./App.css";

import Converter from "./components/Converter";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        <Converter />
      </div>
    );
  }
}

export default App;

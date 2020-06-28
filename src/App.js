import React, { Component } from "react";
import "./App.css";

import Converter from "./components/Converter";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: 0,
    };

    this.updateResult = (newResult) => {
      this.setState({
        result: newResult,
      });
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        <Converter
          updateResult={this.updateResult}
          result={this.state.conversionResult}
        />
      </div>
    );
  }
}

export default App;

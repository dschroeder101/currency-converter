import React, { Component } from "react";
import { Jumbotron, Form, Col, Button } from "react-bootstrap";
import axios from "axios";

class Converter extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendFormData = this.sendFormData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      amount: "",
      currencyFrom: "",
      currencyTo: "",
      year: "",
      month: "",
      day: "",
      result: "",
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.sendFormData();
  };

  sendFormData = () => {
    const { amount, currencyFrom, currencyTo, year, month, day } = this.state;

    axios
      .post("/convert", {
        amount: amount,
        baseCurrency: currencyFrom,
        targetCurrency: currencyTo,
        date: {
          year: year,
          month: month,
          day: day,
        },
      })
      .then((result) => {
        this.setState({
          result: "$" + result.data + " " + this.state.currencyTo,
        });
      })
      .catch((err) => {
        console.log(err);
        alert(
          "Something went wrong - check the input fields for errors and try again"
        );
      });
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div>
        <Jumbotron>
          <h2>Convert currency</h2>
          <Form action="" onSubmit={this.handleSubmit}>
            <Form.Group controlId="formAmount">
              <Form.Label>
                Amount to convert (numbers only, maximum 2 decimal places):
              </Form.Label>
              <Form.Control
                required
                pattern="^[0-9]+(\.[0-9]([0-9])?)?$"
                type="text"
                value={this.state.amount}
                onChange={this.handleInputChange}
                placeholder="Enter amount to convert"
                name="amount"
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="formCurrencyFrom">
              <Form.Label>
                Currency to convert from (letters only, 3 characters,
                uppercase):
              </Form.Label>
              <Form.Control
                pattern="[A-Z]{3}"
                required
                type="text"
                value={this.state.currencyFrom}
                onChange={this.handleInputChange}
                placeholder="Currency to convert from eg. USD"
                name="currencyFrom"
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="formCurrencyTo">
              <Form.Label>
                Currency to convert to (letters only, 3 characters, uppercase):
              </Form.Label>
              <Form.Control
                required
                pattern="[A-Z]{3}"
                type="text"
                value={this.state.currencyTo}
                onChange={this.handleInputChange}
                placeholder="Currency to convert from eg. CAD"
                name="currencyTo"
              ></Form.Control>
            </Form.Group>
            <Form.Row>
              <Form.Group as={Col} controlId="formYear">
                <Form.Label>Year (YYYY)</Form.Label>
                <Form.Control
                  pattern="[0-9]{4}"
                  required
                  type="text"
                  value={this.state.year}
                  onChange={this.handleInputChange}
                  placeholder="Year ex. 2020"
                  name="year"
                ></Form.Control>
                <Form.Text className="text-muted">
                  Note: Results are only available going back to 1999
                </Form.Text>
              </Form.Group>
              <Form.Group as={Col} controlId="formMonth">
                <Form.Label>Month (MM)</Form.Label>
                <Form.Control
                  required
                  pattern="[0-9]{2}"
                  type="text"
                  value={this.state.month}
                  onChange={this.handleInputChange}
                  placeholder="Month ex. 06"
                  name="month"
                ></Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="formDay">
                <Form.Label>Day (DD)</Form.Label>
                <Form.Control
                  required
                  pattern="[0-9]{2}"
                  type="text"
                  value={this.state.day}
                  onChange={this.handleInputChange}
                  placeholder="Day ex. 22"
                  name="day"
                ></Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Group></Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Jumbotron>
        <div>
          <p>Result: {this.state.result}</p>
        </div>
      </div>
    );
  }
}

export default Converter;

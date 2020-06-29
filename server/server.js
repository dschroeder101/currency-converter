import path from "path";
import fs from "fs";
import React from "react";
import express from "express";
import ReactDOMServer from "react-dom/server";
import bodyParser from "body-parser";
import axios from "axios";
import Big from "big.js";

import App from "../src/App";

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static("./build"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const app = ReactDOMServer.renderToString(<App />);

  const indexFile = path.resolve("./build/index.html");

  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error encountered on server: ", err);
      return res.status(500).send("500 - Server error occurred");
    }

    return res.send(
      data.replace('div id="root"></div>', `<div id="root">${app}</div>`)
    );
  });
});

function calculateResult(baseAmount, baseToEuroRate, euroToTargetRate) {
  // Convert all values to Big to retain precision
  let baseBig = new Big(baseAmount);
  let baseToEuroBig = new Big(baseToEuroRate);
  let euroToTargetBig = new Big(euroToTargetRate);

  return baseBig.div(baseToEuroBig).times(euroToTargetBig).round(2).toString();
}

app.post("/convert", (req, res) => {
  console.log(req.body);
  let formattedDate =
    req.body.date.year + "-" + req.body.date.month + "-" + req.body.date.day;

  axios
    .get(
      `http://data.fixer.io/api/${formattedDate}?access_key=${process.env.FIXER_KEY}&symbols=${req.body.baseCurrency},${req.body.targetCurrency}`
    )
    .then(
      (fixerResponse) => {
        console.log(fixerResponse);
        if (fixerResponse.data.success) {
          const result = calculateResult(
            req.body.amount,
            fixerResponse.data.rates[req.body.baseCurrency],
            fixerResponse.data.rates[req.body.targetCurrency]
          );
          return res.status(200).send(result);
        } else {
          return res
            .status(500)
            .send(
              "Error making fixer request - " +
                fixerResponse.data.error.type +
                " - " +
                fixerResponse.data.error.info
            );
        }
      },
      (error) => {
        console.log(error);
        res.status(500).send("500 - Server error occurred");
      }
    );
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

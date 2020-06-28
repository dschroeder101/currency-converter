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
  let baseBig = new Big(baseAmount);
  let baseToEuroBig = new Big(baseToEuroRate);
  let euroToTargetBig = new Big(euroToTargetRate);

  return baseBig.div(baseToEuroBig).times(euroToTargetBig).round(2).toString();
}

app.post("/convert", (req, res) => {
  let year = req.body.date.year;
  let month =
    req.body.date.month < 10 ? "0" + req.body.date.month : req.body.date.month;
  let date =
    req.body.date.day < 10 ? "0" + req.body.date.day : req.body.date.day;

  let dateAsString = year + "-" + month + "-" + date;

  axios
    .get(
      `http://data.fixer.io/api/${dateAsString}?access_key=${process.env.FIXER_KEY}&symbols=${req.body.baseCurrency},${req.body.targetCurrency}`
    )
    .then(
      (fixerResponse) => {
        console.log(fixerResponse);
        const result = calculateResult(
          req.body.amount,
          fixerResponse.data.rates[req.body.baseCurrency],
          fixerResponse.data.rates[req.body.targetCurrency]
        );
        return res.status(200).send(result);
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

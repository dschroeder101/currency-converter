## Currency Converter

This app converts an amount of a given currency to another for a specified date, using [Fixer.io's](https://fixer.io/) Historical endpoint. 

The app is currently hosted at: https://daniel-currency-converter.herokuapp.com/. Please allow some time for the page to load for the first time, as I am using Heroku's free tier which puts apps to sleep when inactive.

Built using React + Express + Node and bootstrapped using creat-react-app.

## Notes

/server/server.js is responsible for pre-rendering and serving the React front-end, making the API calls to Fixer.io, and calculating the currency conversions.

A POST endpoint at /convert accepts a request with a JSON body formatted like so:

```{
    "amount": 3000,
    "baseCurrency": "USD",
    "targetCurrency": "CAD",
    "date": {
        "month": 6,
        "day": 28,
        "year": 2020
    }
}
```

The React front-end displays a submission form with the corresponding fields. The form is contained in src/components/Converter.js. This component is responsible for handling state and making requests to the server's /convert endpoint.

To ensure precision is retained when multiplying and dividing currency by the converstion rates, server.js utilizes [Big.js](http://mikemcl.github.io/big.js/) 


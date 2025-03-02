import axios from 'axios';
import fs from 'fs';

// URL of the server
const url = 'http://localhost:8083/eventsBatch';

// Data to send in the POST request
const data = {
  "contracts": [
    {
      "contractType": "ANN",
      "contractID": "ann01",
      "contractRole": "RPA",
      "contractDealDate": "2012-12-28T00:00:00",
      "initialExchangeDate": "2013-01-01T00:00:00",
      "statusDate": "2012-12-30T00:00:00",
      "notionalPrincipal": "5000",
      "cycleAnchorDateOfPrincipalRedemption": "2013-02-01T00:00:00",
      "nextPrincipalRedemptionPayment": "434.866594118346",
      "dayCountConvention": "A365",
      "nominalInterestRate": "0.08",
      "currency": "USD",
      "cycleOfPrincipalRedemption": "P1ML0",
      "maturityDate": "2014-01-01T00:00:00",
      "rateMultiplier": "1.0",
      "rateSpread": "0.0",
      "fixingDays": "P0D",
      "cycleAnchorDateOfInterestPayment": "2013-02-01T00:00:00",
      "cycleOfInterestPayment": "P1ML0"
    },
		{
      "contractType": "ANN",
      "contractID": "ann02",
      "contractRole": "RPA",
      "contractDealDate": "2013-03-28T00:00:00",
      "initialExchangeDate": "2013-04-01T00:00:00",
      "statusDate": "2013-03-30T00:00:00",
      "notionalPrincipal": "100000",
      "cycleAnchorDateOfPrincipalRedemption": "2013-05-01T00:00:00",
      "nextPrincipalRedemptionPayment": "1161.08479218624",
      "dayCountConvention": "30E360",
      "nominalInterestRate": "0.07",
      "currency": "USD",
      "cycleOfPrincipalRedemption": "P1ML0",
      "maturityDate": "2014-03-01T00:00:00",
      "rateMultiplier": "1.0",
      "rateSpread": "0.0",
      "fixingDays": "P0D",
      "cycleAnchorDateOfInterestPayment": "2013-05-01T00:00:00",
      "cycleOfInterestPayment": "P1ML0"
    }
  ],
  "riskFactors": []
};


// Send POST request using axios
axios.post(url, data)
  .then(response => {
    console.log('Response Code:', response.status);
    console.log('Response Body:', response.data);

    // Save the response body to a JSON file
    const jsonData = JSON.stringify(response.data, null, 2);
    fs.writeFileSync('src/response.json', jsonData, 'utf8');
    console.log('Response saved to response.json');
  })
  .catch(error => {
    console.error('Error:', error.response ? error.response.data : error.message);
  });

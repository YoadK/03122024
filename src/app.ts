// imports for needed components
const express = require('express'); //establish local server
const axios = require('axios'); // make http requests to rest apis
const https = require('https'); // for ignoring sll certificate issue (could not solve it otherwise)
import moment from 'moment'; // library that handles date validation

//setting an 'express' server on port 3000 for handling requests
const app = express();
const PORT = 3000;
app.use(express.json());

//helper function for date validation
function isDateValid(year: number, month: number, day: number): boolean {
    // Check if the date components create the exact date specified
    const date = moment([year, month - 1, day]);
    return date.year() === year &&
        date.month() === month - 1 &&
        date.date() === day;
}


/// this function gets the user request for date conversion & uses the 'hebcal' service for making the conversion.
function convertDateGregToHeb(req, res) {
    let year, month, day; //  variables holding date information
    const date = req.query.date; // for handling  the 1st url format (that format uses the "cfg,g2h,date,gs,strict" parameters)

    //checking for url format number 1: (https://www.hebcal.com/converter?cfg=json&date=2011-06-02&g2h=1&strict=1)
    if (req.query.gy && req.query.gm && req.query.gd) {
        year = req.query.gy;
        month = req.query.gm;
        day = req.query.gd;
    }
    //checking for url format number 2: (using 'gy', 'gm' and 'gd' parameters)
    else if (req.query.date) {
        //checking that 'date' indeed exists
        if (!date) {
            return res.status(400).json({ error: 'Date parameter is required' });
        }
        //manipulating the 'date' parameter in order to extract 'year' 'month' and 'day' information.
        const dateParts = date.split('-');
        year = Number(dateParts[0]);
        month = Number(dateParts[1]);
        day = Number(dateParts[2]);
    }


    //checking that the date is valid
    if (!isDateValid(+year, +month, +day))
        return res.status(400).json({ error: 'Given Date is not valid' });

    // checking that 'year', 'month' and 'day' are numbers
    if (!year || !month || !day) {
        return res.status(400).json({ error: 'Date must be in the YYYY-MM-DD format' });
    }

    //using the 'hebcal' service to convert the date
    axios.get('https://www.hebcal.com/converter', {


        // --- bypass the 'Hebcal API Error: self-signed certificate in certificate chain' error.------------------------
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
        // ---------------------------------------------------------------------------------------------------------------

        //passing the query parameters for the request 
        params: {
            cfg: 'json',
            gy: year,
            gm: month,
            gd: day,
            g2h: 1,
            strict: 1,
        },
    })
        //Sends the JSON response from the Hebcal API back to the client.
        .then(function (response) {
            res.json(response.data);
        })
        //Error handling
        .catch(function (error) {
            console.error('Hebcal API Error:', error.message);
            res.status(500).json({ error: 'Failed to retrieve data from Hebcal API' });
        });
}

//  listening to web requests...
app.get('/convert-date', convertDateGregToHeb);

app.listen(PORT, () => {
    console.log('My basic server is running on http://localhost:' + PORT);
});



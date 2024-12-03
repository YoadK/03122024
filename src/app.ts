// imports
const express = require('express');
const axios = require('axios');
const https = require('https');
import moment from 'moment';

//setting an 'express' server on port 3000 for handling requests
const app = express();
const PORT = 3000;
app.use(express.json());

//helper function
function isDateValid(year: number, month: number, day: number): boolean {
    // Check if the date components create the exact date specified
    const date = moment([year, month - 1, day]);
    return date.year() === year && 
           date.month() === month - 1 && 
           date.date() === day;
}


/// this function gets the user request for date conversion & uses the 'hebcal' service for making the conversion.
function convertDateGregToHeb(req, res) {
    let year, month, day;
    const date = req.query.date;

    console.log(`-----------------------------------------------`);
    console.log(`processing the conversion of this date: ${date}`);
    console.log(`reqest is: `, req);
    console.log(`req.query.date is: `, req.query.date);
    console.log(`req.query is: `, req.query);
   

    if (req.query.gy && req.query.gm && req.query.gd) {
        year = req.query.gy;
        month = req.query.gm;
        day = req.query.gd;
    }

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

    // executed anyway:
    if (!isDateValid(year,month,day))
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

        params: {
            cfg: 'json',
            gy: year,
            gm: month,
            gd: day,
            g2h: 1,
            strict: 1,
        },
    })
        .then(function (response) {
            res.json(response.data);
        })
        .catch(function (error) {
            console.error('Hebcal API Error:', error.message);
            //  console.error('Error response data:', error.response.data);
            //  console.error('Error response status:', error.response.status);
            //  console.error('Error response headers:', error.response.headers);     
            res.status(500).json({ error: 'Failed to retrieve data from Hebcal API' });
        });
}

app.get('/convert-date', convertDateGregToHeb);

app.listen(PORT, () => {
    console.log('My basic server is running on http://localhost:' + PORT);
});



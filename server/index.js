
const express = require('express');
const cors = require('cors');
const monk = require('monk');
const filter = require('bad-words');
const rateLimit = require('express-rate-limit');


const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/chirpdb');      //creates database
const chirps = db.get('chirps');                //creates collection


app.use(cors());
app.use(express.json());


//Very important to include a validation check to avoid injections or anything bad in the database.
function isValidChirp(chirp) {
    return chirp.name && chirp.name.toString().trim() !== '' &&
        chirp.msg && chirp.msg.toString().trim() !== '';

}

// When you enter a url and hit enter on your browser that is a GET request
//This basically say 'hey server, when you get a GET request on the '/' route run this function
app.get('/', (request, response) => {
    response.json({
        name: 'tweety',
        msg: 'chirp'
    });
});


app.get('/chirps', (req, res) => {
    chirps
        .find()
        .then(chirps => {
            res.json(chirps);
        });
});

//Limit request: 1 req every minute
//ONLY affects the POST request below not the GET requests above.
app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 1
}));


//This basically says, "hey, im waiting for someone to submit a tweet before i run this function"
//This works hand in hand with a fetch req in the front end
app.post('/chirps', (req, res) => {

    //once it finds a tweet/chirp, we validate it, 
    //based on validation passes or not we give an error or
    //we create a chirp object which will then be inserted into our database
    //then respond with what was inserted to the db

    // console.log(req.body);
    if (isValidChirp(req.body)) {
        let date = new Date();
        let dateStr = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
        const chirp = {
            // name: filter.clean(req.body.name.toString()),
            // msg: filter.clean(req.body.msg.toString()),
            name: req.body.name.toString(),
            msg: req.body.msg.toString(),
            created_date: dateStr
        };
        chirps
            .insert(chirp)
            .then(createdChirp => {
                res.json(createdChirp);
            });
    }
    else {
        res.status(422);
        res.json({
            msg: "Hey? Name and Content are required!"
        });
    }

});

app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
})
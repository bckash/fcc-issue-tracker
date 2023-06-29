
let mongoose = require('mongoose')
require('dotenv').config();

// connect to DB 
const connect = mongoose.connect( 
    process.env.MONGO_URL,     
    { useNewUrlParser: true, useUnifiedTopology: true }
)

module.export = connect
const students = require('./routes/students')
const classes = require('./routes/classes')
const marksheets = require('./routes/marksheets')

Joi = require('joi')            //global.joi (package for object schema validation validation)

const express = require('express')    
const app = express()

mysql = require('mysql')        //  global.mysql
pool = mysql.createPool({       //  global.pool
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'school'
})



//use middleware
app.use(express.urlencoded())
app.use(express.json())
app.use('/api/students',students)
app.use('/api/classes',classes)
app.use('/api/marksheets',marksheets)


app.listen(5000,()=>{
    console.log('listening to port 5000')
})
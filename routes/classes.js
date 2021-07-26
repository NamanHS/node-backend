const express = require('express')
const router = express.Router()

//[READ] read all classes
router.get('/',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err){
            res.status(500).send('Internal Server Error')
        }
        else{
            let mysql_query = 'select * from classes'
            connection.query(mysql_query,(err,result)=>{
                let output
                if(err){
                    output = {
                        msg: err
                    }
                    res.send(output)
                }
                else{
                    res.send(result)
                }
                connection.release()
            })
        }
    })
})

//export router
module.exports = router
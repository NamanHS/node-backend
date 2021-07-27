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


//check if student has class or not and return class and subjects [JOIN on students and classes]
router.get('/getsubjects/:id',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err){
            res.status(500).send('Internal Server Error')
        }
        else{
            let id = parseInt(req.params.id)
            let mysql_query = 'select s.firstName, s.lastName, s.classId, c.className, c.subjects from students s inner join classes c on s.classId = c.classId where s.studentId = ?'
            connection.query(mysql_query,[id],(err,result)=>{
                let output
                if(err){
                    output = {
                        msg: 'error'
                    }
                    res.send(output)
                }
                else{
                    //result.lenght = 0  if no student exists
                    //result.length = 1 if a student exists
                    res.send(result)
                }
                connection.release()
            })
        }
    })
})


//export router
module.exports = router
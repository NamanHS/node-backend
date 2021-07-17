const express = require('express')
const router = express.Router()

//[read] fetch all students
router.get('/',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err){
            res.status(500).send('Internal Server Error')
        }
        else{
            let mysql_query = 'select * from students'
            connection.query(mysql_query,(err,result)=>{
                if(err){
                    res.send('error')
                }
                else{
                    res.send(result)
                }
                connection.release()
            })
        }
    })
})

//[read one] fetch one student by studentId
router.get('/:id',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err){
            res.status(500).send('Internal Sever Error')
        }
        else{
            let id = parseInt(req.params.id)
            let mysql_query = 'select * from students where studentId = ?'
            connection.query(mysql_query,[id],(err,result)=>{
                if(err){
                    res.send('error')
                } 
                else{
                    res.send(result)
                }
                connection.release()
            })
        }
    })
})

//[create] insert one student
router.post('/',(req,res)=>{

    let joiResult = validateSchema(req.body)
    if(joiResult.error) return res.status(400).send(joiResult.error.details[0].message) //object schema not valid
    
    pool.getConnection((err,connection)=>{
        if(err){
            res.status(500).send('Internal Server Error')
        }else{
            let student = req.body
            let sql_query = 'insert into students set ?'
            connection.query(sql_query,[student],(err,result)=>{
                if(err){
                    if(err.errno === 1452) res.send('Class with given Id does not exist') // foreign key cannot reference primary key
                    else res.send('error')
                }
                else{
                    if(result.affectedRows === 0){
                        res.send('student not added')
                    }else{
                        res.send('student added')
                    }
                }
                connection.release()
            })
        }
    })
})

//[update] update one student by studentId
router.put('/:id',(req,res)=>{
    let joiResult = validateSchema(req.body)
    if(joiResult.error) return res.status(400).send(joiResult.error.details[0].message) //object schema not valid

    pool.getConnection((err,connection)=>{
        if(err){
            res.status(500).send('Internal Server Error')
        }
        else{
            let student = req.body
            let firstName = student.firstName
            let lastName = student.lastName
            let phoneNumber = student.phoneNumber
            let emailId = student.emailId
            let classId = student.classId
            let studentId = req.params.id
            let sql_query = 'update students set firstName = ?, lastName = ? , phoneNumber = ? , emailId = ?, classId = ? where studentId = ?'
            
            connection.query(sql_query,[firstName,lastName,phoneNumber,emailId,classId,studentId],(err,result)=>{
                if(err){
                    res.send('error')
                }
                else{
                    if(result.affectedRows === 0){
                        res.status(404).send('student with given id not found')
                    }
                    else{
                        res.send('Student details updated')
                    }
                }
                connection.release()
            })
        }
    })
})

//[delete] delete one student by studentId
router.delete('/:id',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err){
            res.status(500).send('Internal Server Error')
        }
        else{
            let id = req.params.id
            let mysql_query = 'delete from students where studentId = ?'
            connection.query(mysql_query,[id],(err,result)=>{
                if(err){
                    res.send('error')
                }
                else{
                    if(result.affectedRows === 0){
                        res.send('Student with given id does not exist')
                    }
                    else{
                        res.send('student deleted')
                    }
                }
                connection.release()
            })
        }
    })
})


function validateSchema(body){
    let schema = {
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        phoneNumber: Joi.string().min(10).max(15).required(),
        emailId: Joi.string().required(),
        classId: Joi.number().required()
    }

    return Joi.validate(body,schema)
}


//export router 
module.exports = router
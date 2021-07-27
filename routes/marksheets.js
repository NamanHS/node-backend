const express = require('express')
const router = express.Router()

//[read] read marksheet of given studentId
router.get('/student/:studentId',(req,res)=>{
    pool.getConnection((err,connection)=>{
        let output;
        if(err){
            output = {
                msg: 'Internal Server Error'
            }
            res.status(500).send(output)
        }
        else{
            let studentId = req.params.studentId
            let mysql_query = 'select firstName from students where studentId = ?'

            connection.query(mysql_query,[studentId],(err,result)=>{
                
                if(result.length > 0){

                    mysql_query = 'select m.marksheetId, m.classId , c.className, m.studentId, s.firstName, s.lastName, m.marks from marksheets m left join students s on m.studentId = s.studentId join classes c on m.classId = c.classId AND m.studentId = ? order by s.studentId'
                    
                    connection.query(mysql_query,[studentId],(err,result)=>{
                        if(err){
                            output = {
                                msg: 'error'
                            }
                            res.send(output)
                            console.log(err)
                        }
                        else{
                            console.log(result)
                            if(result.length > 0)
                            {
                                res.send(result)
                            }
                            else{
                                output = {
                                    msg: 'result not available'
                                }
                                res.send(output)
                            }
                        }
                        connection.release()
                    })
                }
                else{
                    output = {
                        msg: 'Student with given Student ID not found'
                    }
                    res.status(404).send(output)
                    connection.release()
                }
            })

        }
    })
})

//[read] read marksheet of given classId
router.get('/class/:classId',(req,res)=>{
    pool.getConnection((err,connection)=>{
        let output;
        if(err){
            output = {
                msg: 'Internal Server Error'
            }
            res.status(500).send(output)
        }
        else{
            let classId = req.params.classId
            let mysql_query = 'select className from classes where classId = ?'

            connection.query(mysql_query,[classId],(err,result)=>{
                

                if(result.length > 0){

                    mysql_query = 'select m.marksheetId, m.classId , c.className, m.studentId , s.firstName, s.lastName, m.marks from marksheets m left join students s on m.studentId = s.studentId join classes c on m.classId = c.classId AND m.classId = ? order by s.studentId'
                    
                    connection.query(mysql_query,[classId],(err,result)=>{
                        if(err){
                            output = {
                                msg: 'error'
                            }
                            res.send(output)
                            console.log(err)
                        }
                        else{
                            if(result.length > 0)
                            {
                                res.send(result)
                            }
                            else{
                                output = {
                                    msg: 'result not available'
                                }
                                res.send(output)
                            }
                        }
                        connection.release()
                    })
                }else{
                    output = {
                        msg: 'Class with given id not found'
                    }
                    res.status(404).send(output)
                    connection.release()
                }
            })
            
        }
    })
})

//[create] insert marksheet
router.post('/',(req,res)=>{
    let output;
    let joiResult = validateSchema(req.body)
    if(joiResult.error){
        output = {
            msg: joiResult.error.details[0].message  //object schema not valid
        }
        return res.status(400).send(output)
    } 
    
    pool.getConnection((err,connection)=>{
        if(err){
            output = {
                msg: 'Internal Server Error'
            }
            res.status(500).send(output)
        }
        else{      
            let mysql_query = 'select firstName from students where studentId = ? AND classId = ?'
            connection.query(mysql_query,[req.body.studentId,req.body.classId],(err,result)=>{
                
                if(result.length > 0){            //check if class id and studentid relates

                    let marks = JSON.stringify(req.body.marks)
                    
                    let mysql_query = 'insert into marksheets (classId,studentId,marks) values (?,?,?)'
                    
                    connection.query(mysql_query,[req.body.classId,req.body.studentId,marks],(err,result)=>{
                        if(err){
                            if(err.code === 'ER_DUP_ENTRY'){
                                output = {
                                    msg: `Result for Student ID ${req.body.studentId} already entered`
                                }
                                res.send(output)
                            } 
                            else if(err.errno === 1452){
                                output = {
                                    msg: `No student with given Student ID : ${req.body.studentId} exists`
                                }
                                res.send(output) // foreign key cannot ref primary key
                            } 
                            else{
                                output = {
                                    msg: 'error'
                                }
                                res.send(output)
                            } 
                        }
                        else{
                            if(result.affectedRows === 1){
                                output = {
                                    msg: 'Marks Entered!'
                                }
                                res.send(output)
                            }
                            else{
                                output = {
                                    msg: 'result not added'
                                }
                                res.send(output)
                            }
                        }
                        connection.release()
                    })

                }else{
                    res.send('class does not have student with given Id')
                    connection.release()
                }
            }) 
        }
    })
})

function validateSchema(body){
    let schema = {
        classId: Joi.number().required(),
        studentId: Joi.number().required(),
        marks: Joi.array().required()
    }
    return Joi.validate(body,schema)
}


//export router
module.exports = router
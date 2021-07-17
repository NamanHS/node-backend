const express = require('express')
const router = express.Router()

//[read] read marksheet of given studentId
router.get('/student/:studentId',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err){
            res.status(500).send('Internal Server Error')
        }
        else{
            let studentId = req.params.studentId
            let mysql_query = 'select firstName from students where studentId = ?'

            connection.query(mysql_query,[studentId],(err,result)=>{
                
                if(result.length > 0){

                    mysql_query = 'select m.marksheetId, m.classId , c.className, m.studentId as rollNumber, s.firstName, s.lastName, m.marks from marksheets m left join students s on m.studentId = s.studentId join classes c on m.classId = c.classId AND m.studentId = ?'
                    
                    connection.query(mysql_query,[studentId],(err,result)=>{
                        if(err){
                            res.send('error')
                            console.log(err)
                        }
                        else{
                            console.log(result)
                            if(result.length > 0)
                            {
                                res.send(result)
                            }
                            else{
                                res.send('result not available')
                            }
                        }
                        connection.release()
                    })
                }
                else{
                    res.status(404).send('Student with given Roll Number not found')
                    connection.release()
                }
            })

        }
    })
})

//[read] read marksheet of given classId
router.get('/class/:classId',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err){
            res.status(500).send('Internal Server Error')
        }
        else{
            let classId = req.params.classId
            let mysql_query = 'select className from classes where classId = ?'

            connection.query(mysql_query,[classId],(err,result)=>{

                if(result.length > 0){

                    mysql_query = 'select m.marksheetId, m.classId , c.className, m.studentId as rollNumber, s.firstName, s.lastName, m.marks from marksheets m left join students s on m.studentId = s.studentId join classes c on m.classId = c.classId AND m.classId = ?'
                    
                    connection.query(mysql_query,[classId],(err,result)=>{
                        if(err){
                            res.send('error')
                            console.log(err)
                        }
                        else{
                            if(result.length > 0)
                            {
                                res.send(result)
                            }
                            else{
                                res.send('result not available')
                            }
                        }
                        connection.release()
                    })
                }else{
                    res.status(404).send('Class with given id not found')
                    connection.release()
                }
            })
            
        }
    })
})

//[create] insert marksheet
router.post('/',(req,res)=>{
    
    let joiResult = validateSchema(req.body)
    if(joiResult.error) return res.status(400).send(joiResult.error.details[0].message) //object schema not valid
    
    pool.getConnection((err,connection)=>{
        if(err){
            res.status(500).send('Internal Server Error')
        }
        else{      
            let mysql_query = 'select firstName from students where studentId = ? AND classId = ?'
            connection.query(mysql_query,[req.body.studentId,req.body.classId],(err,result)=>{
                
                if(result.length > 0){            //check if class id and studentid relates

                    let marks = JSON.stringify(req.body.marks)
                    
                    let mysql_query = 'insert into marksheets (classId,studentId,marks) values (?,?,?)'
                    
                    connection.query(mysql_query,[req.body.classId,req.body.studentId,marks],(err,result)=>{
                        if(err){
                            if(err.code === 'ER_DUP_ENTRY') res.send(`Result for Roll Number ${req.body.studentId} already entered`)
                            else if(err.errno === 1452) res.send(`No student with given Roll Number ${req.body.studentId} exist`) // foreign key cannot ref primary key
                            else res.send('error')
                        }
                        else{
                            if(result.affectedRows === 1){
                                res.send('Marks entered')
                            }
                            else{
                                res.send('result not added')
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
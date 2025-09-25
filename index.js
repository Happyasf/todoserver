import express from 'express'
import cors from 'cors'
import {configDB, configDB_} from './configDB.js'
import mysql from 'mysql2/promise'



const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 8000

let connection

try{
    connection = await mysql.createConnection(configDB)
}catch(error){
    console.log(error);
    
}

app.get('/todos',async (req,resp)=>{
    try{
        const sql='SELECT * FROM todolist ORDER BY timestamp DESC'
        const [rows,fields] = await connection.execute(sql)
        //console.log(rows);
        //console.log(fields);
        resp.status(200).send(rows)
        
        

    }catch(error){
        console.log(error);
        
    }
})

app.post('/todos',async (req,resp)=>{
    if(!req.body) return resp.json({msg:"Hiányos adat"})
    const {task} = req.body
    if(!task) return resp.json({msg:"Hiányos adat!"})
    try{
        const sql ="INSERT INTO todolist (task) VALUES (?)"
        const values = [task]
        const [result] = await connection.execute(sql,values)
        console.log(result);
        resp.status(201).json({masg:"Sikeres hozzáadás!"})
        

    }catch(error){
        console.log(error);
        
    }
})

app.delete('/todos/:id',async (req,resp)=>{
    const {id} = req.params

    try{
        const sql = "DELETE FROM todolist where id = ?"
        const values = [id]
        const [rows] = await connection.execute(sql,values)
        console.log(rows.affectedRows);
        if(rows.affectedRows == 0) return resp.json({msg:"Nincs mit törölni!"})
        resp.json({msg:"Sikeres törlés!"})

    }catch(error){
        console.log(error);
        
    }
})
/*app.patch('/todos/:id', async (req,resp)=>{
    const {id} = req.params
    const {completed} = req.body

    try{
        const sql = "UPDATE todolist set completed = NOT completed where id = ?"
        const values = [id]
        const comp = [completed]
        const [rows] = await connection.execute(sql,values,completed)
        if (completed = 0) {
            console.log(rows);
            completed == 1;
            resp.json({msg:"A feladat frissitve!(teljesítve)"})

        }else{
            console.log(rows);
            
            resp.json({msg:"A feladat már teljesítve van!"})
        }
    
    
    }catch(error){
        console.log(error);
        
    }
})*/





app.listen(port,()=>console.log(`server listening on port ${port}`))
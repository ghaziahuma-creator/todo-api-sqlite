const express = require('express');
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send({
  "name": "Task API",
  "version": "1.0",
  "endpoints": ["/tasks"]
});
})

app.get("/health",(req, res) => {
 res.send({ "status": "ok" } )
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

let tasks=[
{
id:1,
title:"JS",
done : false
},
{
id:2,
title:"React",
done : true
},
{
id:3,
title:"Node",
done : false
}]

app.get("/tasks",(req, res) => {
res.send(tasks);
})

app.get("/tasks/:id",(req, res) => {
const id = parseInt(req.params.id);
const task = tasks.find((task)=> task.id === id);
if(!task){
    res.status(404).json({
        "error": `Task ${id} not found `
    })
}

res.send({
    task
})
})
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

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
res.status(200).json(tasks);
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

app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const newTask = {
        id: tasks.length + 1,
        title: title,
        done: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});


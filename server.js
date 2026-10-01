const express = require('express');
const app = express();
const PORT = 3000;
const yaml = require('yaml');
const swaggerUiExpress = require('swagger-ui-express');
const fs = require('fs');

const openapiFile = fs.readFileSync('./openapi.yaml', 'utf8');
const openapiDocument = yaml.parse(openapiFile);

app.use(
    '/docs',
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(openapiDocument)
);

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

app.delete("/tasks/:id", (req, res) => {
    try {
        const id = parseInt(req.params.id);

        tasks = tasks.filter((task) => task.id != id);

        res.send({
            status: 200,
            tasks
        });
    } catch (error) {
        res.send({
            status: 401,
            message: error.message
        });
    }
});

app.put("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const task = req.body;

    const taskToBeUpdated = tasks.find((task) => task.id === id);

    if (!taskToBeUpdated) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    if (!task || Object.keys(task).length === 0) {
        return res.status(400).json({
            error: "Request body cannot be empty"
        });
    }

    if (task.title !== undefined) {
        if (typeof task.title !== "string" || task.title.trim() === "") {
            return res.status(400).json({
                error: "Title must be a non-empty string"
            });
        }

        taskToBeUpdated.title = task.title;
    }

    if (task.done !== undefined) {
        if (typeof task.done !== "boolean") {
            return res.status(400).json({
                error: "Done must be a boolean"
            });
        }

        taskToBeUpdated.done = task.done;
    }

    res.status(200).json(taskToBeUpdated);
});
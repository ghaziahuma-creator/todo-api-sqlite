const express = require('express');
const app = express();
const PORT = 3000;
const yaml = require('yaml');
const swaggerUiExpress = require('swagger-ui-express');
const fs = require('fs');
const Database = require('better-sqlite3');
const db = new Database("tasks.db");

const openapiFile = fs.readFileSync('./openapi.yaml', 'utf8');
const openapiDocument = yaml.parse(openapiFile);

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        title TEXT,
        done INTEGER CHECK (done IN (0, 1))
    )
`);

const result = db.prepare("SELECT COUNT(*) AS count FROM tasks").get();

console.log(result.count);

if (result.count === 0){
db.exec(`
    INSERT INTO tasks (title, done) VALUES ('Nextjs', 0);
    INSERT INTO tasks (title, done) VALUES ('LMS', 0);
    INSERT INTO tasks (title, done) VALUES ('React', 1);
`);
}


app.use(
    '/docs',
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(openapiDocument)
);

console.log(db.prepare("SELECT * FROM tasks").all());

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


app.get("/tasks",(req, res) => {
    const tasks = db.prepare(`SELECT * FROM  tasks`).all();
res.status(200).json(tasks);
})

app.get("/tasks/:id",(req, res) => {
const id = parseInt(req.params.id);
const task = db.prepare(`SELECT * FROM tasks WHERE id = ${id}`).get();
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
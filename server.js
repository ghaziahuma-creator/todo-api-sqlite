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


if (result.count === 0){
db.exec(`
    INSERT INTO tasks (title, done) VALUES ('Nextjs', 0);
    INSERT INTO tasks (title, done) VALUES ('LMS', 0);
    INSERT INTO tasks (title, done) VALUES ('React', 1);
`);
}

console.log("Database count:", db.prepare("SELECT COUNT(*) AS count FROM tasks").get());
console.log("Database path:", require("path").resolve("tasks.db"));


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
    try {
         const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const newtTask = db.prepare(`INSERT INTO tasks (title, done) VALUES (?, 0)`).run(title);

    const newTaskId = newtTask.lastInsertRowid;

    const task = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(newTaskId)
     

    res.status(201).json({
        task
    })
    } catch (error) {
        res.status(405).json({message: error.message})
    }
   
});


app.delete("/tasks/:id", (req, res) => {
    try {
        const id = parseInt(req.params.id);

       const taskToBeDeleted = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id);

       if(!taskToBeDeleted){
        res.status(404).json({
            "message" : "Task does not exist"
        })
       }

    db.prepare(`DELETE FROM tasks WHERE id = ? `).run(id)  

        res.status(204).send();
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

    const taskToBeUpdated = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id);

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
           db.prepare(`UPDATE tasks SET title = ? WHERE id = ? `).run(task.title,  id );
    }

    if (task.done !== undefined) {
          db.prepare(`UPDATE tasks SET done = ? WHERE id = ? `).run(task.done,  id );
    }

    const updatedTask = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id);

    res.status(200).json(updatedTask);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
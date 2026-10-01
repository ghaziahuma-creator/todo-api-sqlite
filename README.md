# Task API

A simple CRUD REST API built with **Node.js** and **Express.js** for managing tasks.

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

## Run the Server

Start the development server:

```bash
npm run dev
```

The server runs at:

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| GET    | `/`          | Get API information |
| GET    | `/health`    | Check API health    |
| GET    | `/tasks`     | Get all tasks       |
| GET    | `/tasks/:id` | Get a task by ID    |
| POST   | `/tasks`     | Create a new task   |
| PUT    | `/tasks/:id` | Update a task       |
| DELETE | `/tasks/:id` | Delete a task       |

## Swagger UI

Interactive API documentation is available at:

```text
http://localhost:3000/docs
```

Swagger UI can be used to test the API endpoints with **Try it out**.

## Example Requests

### Get all tasks

```bash
curl -i http://localhost:3000/tasks
```

Example response:

```text
HTTP/1.1 200 OK
```

```json
[
  {
    "id": 1,
    "title": "JS",
    "done": false
  },
  {
    "id": 2,
    "title": "React",
    "done": true
  },
  {
    "id": 3,
    "title": "Node",
    "done": false
  }
]
```

### Create a task

```bash
curl -i -X POST http://localhost:3000/tasks ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Buy milk\"}"
```

### Get a task

```bash
curl -i http://localhost:3000/tasks/1
```

### Update a task

```bash
curl -i -X PUT http://localhost:3000/tasks/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Learn Node\",\"done\":true}"
```

### Delete a task

```bash
curl -i -X DELETE http://localhost:3000/tasks/1
```

## Technologies

* Node.js
* Express.js
* Swagger UI
* OpenAPI
* YAML

## Project Structure

```text
Week 1/
├── server.js
├── openapi.yaml
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

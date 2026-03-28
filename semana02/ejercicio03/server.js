const http = require("http");
const repo = require("./repository/studentsRepository");

const PORT = 4000;

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    const { method, url } = req;

    // RUTA: GET /students (Listar todos)
    if (url === "/students" && method === "GET") {
        res.statusCode = 200;
        res.end(JSON.stringify(repo.getAll()));
    }

    // RUTA: GET /students/:id
    else if (url.startsWith("/students/") && method === "GET") {
        const id = parseInt(url.split("/")[2]);
        const student = repo.getById(id);
        if (student) {
            res.statusCode = 200;
            res.end(JSON.stringify(student));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
        }
    }

    // RUTA: POST /students (Crear con VALIDACIÓN)
    else if (url === "/students" && method === "POST") {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => {
            try {
                const data = JSON.parse(body);
                
                // Validación de campos obligatorios según la tarea
                if (!data.name || !data.email || !data.course || !data.phone) {
                    res.statusCode = 400;
                    return res.end(JSON.stringify({ 
                        error: "Validación fallida: nombre, email, course y phone son obligatorios" 
                    }));
                }

                const newStudent = repo.create(data);
                res.statusCode = 201;
                res.end(JSON.stringify(newStudent));
            } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "JSON inválido" }));
            }
        });
    }

    // RUTA: POST /ListByStatus (Listar por estado)
    else if (url === "/ListByStatus" && method === "POST") {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => {
            const { status } = JSON.parse(body);
            const filtered = repo.getByStatus(status || "");
            res.statusCode = 200;
            res.end(JSON.stringify(filtered));
        });
    }

    // RUTA: POST /ListByGrade (Listar por promedio/nota)
    else if (url === "/ListByGrade" && method === "POST") {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => {
            const { grade } = JSON.parse(body);
            const filtered = repo.getByGrade(grade);
            res.statusCode = 200;
            res.end(JSON.stringify(filtered));
        });
    }

    // RUTA: PUT /students/:id (Actualizar campos nuevos)
    else if (url.startsWith("/students/") && method === "PUT") {
        const id = parseInt(url.split("/")[2]);
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => {
            const updated = repo.update(id, JSON.parse(body));
            if (updated) {
                res.statusCode = 200;
                res.end(JSON.stringify(updated));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
            }
        });
    }

    // RUTA: DELETE /students/:id
    else if (url.startsWith("/students/") && method === "DELETE") {
        const id = parseInt(url.split("/")[2]);
        const deleted = repo.remove(id);
        if (deleted) {
            res.statusCode = 200;
            res.end(JSON.stringify({ message: "Eliminado con éxito", deleted }));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
        }
    }

    else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Ruta no encontrada" }));
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor de tarea corriendo en http://localhost:${PORT}`);
});
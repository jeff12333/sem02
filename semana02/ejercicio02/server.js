const http = require("http");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const PORT = 3000;

handlebars.registerHelper('isHighGrade', function (grade) {
    return grade > 15;
});

const server = http.createServer((req, res) => {
    // Definir la ruta del archivo según la URL
    let viewName = "";
    let data = {};

    if (req.url === "/") {
        viewName = "home.hbs";
        data = {
            title: "Inicio - Laboratorio",
            welcomeMessage: "Bienvenido al laboratorio de Node.js",
            day: new Date().toLocaleDateString("es-PE"),
            students: ["Ana", "Luis", "Pedro", "María"]
        };
    } else if (req.url === "/about") {
        viewName = "about.hbs";
        data = {
            title: "Sobre la Clase",
            courseName: "Desarrollo de aplicaciones web avanzada",
            instructor: "Arévalo SSermeño, Edwin",
            currentDate: new Date().toLocaleDateString("es-PE")
        };
    } else if (req.url === "/students") {
        viewName = "students.hbs";
        data = {
            title: "Listado de Notas",
            studentsList: [
                { name: "Ana", grade: 18 },
                { name: "Luis", grade: 12 },
                { name: "Pedro", grade: 16 },
                { name: "María", grade: 14 }
            ]
        };
    } else {
        // Manejo de 404
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end("<h1>404 - Página no encontrada</h1>");
        return;
    }

    const filePath = path.join(__dirname, "views", viewName);

    fs.readFile(filePath, "utf8", (err, templateData) => {
        if (err) {
            res.statusCode = 500;
            res.end("Error interno: No se pudo cargar la vista.");
            return;
        }

        const template = handlebars.compile(templateData);
        const html = template(data);

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(html);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
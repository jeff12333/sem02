let students = [
    {
        id: 1,
        name: "Juan Pérez",
        grade: 20,
        age: 23,
        email: "juan.perez@ejemplo.com",
        phone: "+51 987654321",
        enrollmentNumber: "2025001",
        course: "Diseño y Desarrollo de Software C24",
        year: 3,
        subjects: ["Algoritmos", "Bases de Datos", "Redes"],
        gpa: 3.8,
        status: "Activo",
        admissionDate: "2022-03-01"
    }
];

function getAll() {
    return students;
}

function getById(id) {
    return students.find(s => s.id === id);
}

// NUEVO: Filtrar por estado
function getByStatus(status) {
    return students.filter(s => s.status.toLowerCase() === status.toLowerCase());
}

// NUEVO: Filtrar por promedio/nota
function getByGrade(grade) {
    return students.filter(s => s.grade === parseInt(grade));
}

function create(student) {
    student.id = students.length > 0 ? students[students.length - 1].id + 1 : 1;
    students.push(student);
    return student;
}

function update(id, updateData) {
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        students[index] = { ...students[index], ...updateData };
        return students[index];
    }
    return null;
}

function remove(id) {
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        return students.splice(index, 1)[0];
    }
    return null;
}

module.exports = { getAll, getById, create, update, remove, getByStatus, getByGrade };
import * as mongoose from "mongoose";
import { models } from "./schema";
import { v4 as UUID } from "uuid";

const { Student, Ticket, Teacher } = models;

export async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME,
        });
        console.log("Connected to the database");
    } catch (error) {
        console.log("Error connecting to the database: ", error);
    }
}

export async function studentCreate(student) {
    const checkStudentEmail = await Student.findOne({ email: student.email });
    const checkStudentId = await Student.findOne({
        studentID: student.studentID,
    });

    if (student.studentID.length !== 6) {
        return [false, "Student ID must be 6 characters long"];
    }
    //console.log(checkStudentEmail, checkStudentId);
    if (checkStudentEmail || checkStudentId) {
        return [false, "Student with that email or student ID already exists"];
    }

    const hash = await Bun.password.hash(student.password);
    student = {
        id: UUID(),
        email: student.email,
        name: student.name,
        studentID: student.studentID,
        password: hash,
    };

    try {
        const newStudent = new Student(student);
        await newStudent.save();
        return [true, "Student created successfully"];
    } catch (error) {
        console.log("Error creating student: ", error);
        return [false, "Error creating student"];
    }
}

export async function teacherCreate(teacher) {
    try {
        const newTeacher = new Teacher(teacher);
        return await newTeacher.save();
    } catch (error) {
        return error;
    }
}

export async function ticketCreate(ticket) {
    try {
        const newTicket = new Ticket(ticket);
        return await newTicket.save();
    } catch (error) {
        return error;
    }
}

/**
 * Retrieves a student record based on the specified method and value.
 *
 * @param {string} method - The method to use for retrieving the student.
 *                          Possible values are 'id', 'studentName', 'StudentEmail', and 'studentID'.
 * @param {string|number} value - The value to search for based on the specified method.
 * @returns {Promise<Object|null>} - A promise that resolves to the student record if found, otherwise null.
 */
export async function studentGetBY(method, value) {
    switch (method) {
        case "id":
            return await Student.findOne({ id: value });
        case "studentName":
            return await Student.findOne({ studentName: value });
        case "StudentEmail":
            return await Student.findOne({ email: value });
        case "studentID":
            return await Student.findOne({ studentID: value });
    }
}

export async function teacherGetBY(method, value) {
    switch (method) {
        case "id":
            return await Teacher.findOne({ id: value });
        case "teacherName":
            return await Teacher.findOne({ teacherName: value });
        case "teacherEmail":
            return await Teacher.findOne({ email: value });
        case "teacherID":
            return await Teacher.findOne({ teacherID: value });
    }
}

/**
 * Retrieves a ticket from the database based on the specified method and value.
 *
 * @param {string} method - The method to use for finding the ticket.
 *                          Possible values are 'id', 'ticketID', 'studentID', 'teacherID', 'teacherName', 'studentName'.
 * @param {string|number} value - The value to search for based on the specified method.
 * @returns {Promise<Object|null>} - A promise that resolves to the found ticket object or null if no ticket is found.
 */
export async function ticketGetBY(method, value) {
    switch (method) {
        case "id":
            return await Ticket.findOne({ id: value });
        case "ticketID":
            return await Ticket.findOne({ ticketID: value });
        case "studentID":
            return await Ticket.findMany({ studentID: value });
        case "teacherID":
            return await Ticket.findOne({ teacherID: value });
        case "teacherName":
            return await Ticket.findOne({ teacherName: [value] });
        case "studentName":
            return await Ticket.findOne({ studentName: [value] });
    }
}

import * as mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        id: { type: mongoose.Schema.Types.UUID, required: true },
        StudentID: { type: Number, required: true },
        Studentname: { type: [String], required: true },
        TeacherID: { type: Number, required: true },
        Teachername: { type: [String], required: true },
        initialDate: { type: Date, required: true },
        finalDate: { type: Date, required: true },
        type: { type: String, required: true },
        Subject: { type: String, required: false },
    },
    {
        methods: {
            getthis() {
                return this;
            },
        },
    }
);

const TeacherSchema = new mongoose.Schema(
    {
        id: { type: mongoose.Schema.Types.UUID, required: true },
        teacherID: { type: Number, required: true },
        photoUrl: { type: String, required: false },
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
    },
    {
        methods: {
            getthis() {
                return this;
            },
        },
    }
);

const StudentSchema = new mongoose.Schema(
    {
        id: { type: mongoose.Schema.Types.UUID, required: true },
        studentID: { type: Number, required: true },
        photoUrl: { type: String, required: false },
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
    },
    {
        methods: {
            getthis() {
                return this;
            },
        },
    }
);

export const models = {
    Ticket: mongoose.model("ticket", ticketSchema),
    Student: mongoose.model("student", StudentSchema),
    Teacher: mongoose.model("teacher", TeacherSchema),
};

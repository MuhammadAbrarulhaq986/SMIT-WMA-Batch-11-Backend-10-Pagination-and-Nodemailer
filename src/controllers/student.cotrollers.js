import Student from "../models/students.model.js";
import Course from "../models/course.model.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

//* nodemailer config
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: "emmitt.krajcik6@ethereal.email",
        pass: "G8yukXJpkuqwKjXxuj",
    },
});

const addStudent = async (req, res) => {
    const { fullName, email, enrolledCourse } = req.body;

    if (!fullName) return res.status(400).json({
        message: "Fullname is required",
    });
    if (!email) return res.status(400).json({
        message: "Email  is required",
    });

    const student = await Student.create({
        fullName,
        email,
        enrolledCourse,
    });

    const course = await Course.findByIdAndUpdate(enrolledCourse, {
        $push: { enrolledStudents: student._id },
    });
    res.json({ message: "student added successfully" });
};

const getStudent = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Type.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Not Valid Id" });
    }

    const student = await Student.findById(id).populate("enrolledCourse");
    if (!student) {
        res.status(404).json({
            message: "No Student found!",
        });
        return;
    }
    res.status(200).json(student);
}

//* This function gets a list of students with pagination
const getAllStudent = async (req, res) => {
    //* Get the requested page number from URL query, default is page 1
    const page = req.query.page || 1;

    //* Get how many students to show per page from URL query, default is 3 students
    const limit = req.query.limit || 5;

    //* Calculate how many students to skip
    //* Example: On page 2 with limit 3, skip first 3 students (page-1 * limit)
    const skip = (page - 1) * limit;

    //* Find students from database:
    //* 1. skip() - jumps over the calculated number of students
    //* 2. limit() - takes only the specified number of students
    const students = await Student.find({}).skip(skip).limit(limit);

    //* Send back:
    //* - data: the list of students for current page
    //* - length: how many students were found
    res.json({ data: students, length: students.length });
};

//* Function to handle sending emails
const sendEmail = async (req, res) => {
    //* Send email using the transporter configuration
    const info = await transporter.sendMail({
        //* Sender's email and display name
        from: '"Emmitt Krajcik 👻" <emmitt.krajcik6@ethereal.email>',

        //* Recipient's email address
        to: "ulhaqabrar106@gmail.com",

        //* Email subject line
        subject: "Congratulation! Benizar income support (SINDH BANK)✔",

        //* Plain text version of the email body
        text: "Mubarak ho appka benazir income support ma 10 lac cash or 20 tola sona nikla haa. Abhi 2000rs 03221767616 ma bhejain or inaam hasil krain",

        //* HTML version of the email body
        html: "<b>Hello world?</b>",
    });

    //* Log the message ID for tracking
    console.log("Message sent: %s", info.messageId);

    //* Send success response to client
    res.send("email sent");
};
export { addStudent, getStudent, getAllStudent, sendEmail }
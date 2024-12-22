import Course from "../models/course.model.js";

const addCourse = async (req, res) => {
    try {
        const { name, duration } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        // Create a new course
        const course = await Course.create({ name, duration });
        res.status(201).json({
            message: "Course created successfully",
            course, // Include created course in the response
        });
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({
            message: "Error creating course",
            error: error.message, // Provide error details for debugging
        });
    }
};

const getCourse = async (req, res) => {
    try {
        // Fetch all courses and populate enrolled students
        const courses = await Course.find({}).populate("enrolledStudents");

        // Check if no courses are found
        if (courses.length === 0) {
            return res.status(404).json({ message: "No courses found" });
        }

        res.status(200).json(courses);
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({
            message: "Error fetching courses",
            error: error.message, // Provide error details for debugging
        });
    }
};

export { addCourse, getCourse };

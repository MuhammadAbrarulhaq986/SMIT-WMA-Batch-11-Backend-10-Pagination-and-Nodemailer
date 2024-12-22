
import express from "express"

import { addStudent, getAllStudent, getStudent, sendEmail } from "../controllers/student.cotrollers.js"

const router = express.Router();

router.post("/student", addStudent);
router.get("/student/:id", getStudent);
router.get("/students", getAllStudent);
router.get("/sendemail", sendEmail);
export default router;
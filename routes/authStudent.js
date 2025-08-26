import express from "express"
import { addStudent,deleteStudent,updateStudent,getStudentById,getAllStudents } from "../controllers/studentController.js";
import { auth } from "../middleware/auth.js"

const router = express.Router();


//all student routes
router.post('/add',auth,addStudent);
router.get('/all',auth,getAllStudents);
router.get('/:id',auth,getStudentById);
router.put('/:id',auth,updateStudent);
router.delete('/:id',auth,deleteStudent);

export default router;
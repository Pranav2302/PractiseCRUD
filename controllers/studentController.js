import prisma from "../config/db.js";

// Add new student
export const addStudent = async (req, res) => {
    try {
        const { name, email, phone, course, year, rollNumber, address } = req.body;

        // Validation
        if (!name || !email || !phone || !course || !year || !rollNumber || !address) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Phone number must be 10 digits"
            });
        }

        // Year validation
        if (year < 1 || year > 4) {
            return res.status(400).json({
                success: false,
                message: "Year must be between 1 and 4"
            });
        }

        // Check if student already exists
        const existingStudent = await prisma.student.findFirst({
            where: {
                OR: [
                    { email: email },
                    { rollNumber: rollNumber }
                ]
            }
        });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: "Student with this email or roll number already exists"
            });
        }

        // Create student
        const student = await prisma.student.create({
            data: {
                name,
                email,
                phone,
                course,
                year: parseInt(year),
                rollNumber,
                address
            }
        });

        res.status(201).json({
            success: true,
            message: "Student added successfully",
            data: student
        });

    } catch (error) {
        console.log(error);
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: "Student with this email or roll number already exists"
            });
        }
        res.status(500).json({
            success: false,
            message: "Error adding student"
        });
    }
};

// Get all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            message: "Students retrieved successfully",
            data: students
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error retrieving students"
        });
    }
};

// Get student by ID
export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await prisma.student.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student retrieved successfully",
            data: student
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error retrieving student"
        });
    }
};

// Update student
export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, course, year, rollNumber, address } = req.body;

        // Check if student exists
        const existingStudent = await prisma.student.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Validation
        if (!name || !email || !phone || !course || !year || !rollNumber || !address) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Phone number must be 10 digits"
            });
        }

        // Year validation
        if (year < 1 || year > 4) {
            return res.status(400).json({
                success: false,
                message: "Year must be between 1 and 4"
            });
        }

        // Check if email or roll number already exists for other students
        const duplicateStudent = await prisma.student.findFirst({
            where: {
                AND: [
                    { id: { not: parseInt(id) } },
                    {
                        OR: [
                            { email: email },
                            { rollNumber: rollNumber }
                        ]
                    }
                ]
            }
        });

        if (duplicateStudent) {
            return res.status(400).json({
                success: false,
                message: "Another student with this email or roll number already exists"
            });
        }

        // Update student
        const updatedStudent = await prisma.student.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                email,
                phone,
                course,
                year: parseInt(year),
                rollNumber,
                address
            }
        });

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: updatedStudent
        });

    } catch (error) {
        console.log(error);
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: "Student with this email or roll number already exists"
            });
        }
        res.status(500).json({
            success: false,
            message: "Error updating student"
        });
    }
};

// Delete student
export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if student exists
        const existingStudent = await prisma.student.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Delete student
        await prisma.student.delete({
            where: {
                id: parseInt(id)
            }
        });

        res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error deleting student"
        });
    }
};
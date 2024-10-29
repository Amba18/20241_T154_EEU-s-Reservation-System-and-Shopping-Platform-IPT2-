import Student from '../model/student.js'

const getStudents = async (req,res)=>{
    try{
        const students = await Student.find();
        res.status(200).json(students)
    }catch(error){
        console.log(error)
    }
}
const getStudent = async (req,res)=>{
    try{
        const student = await Student.findById(req.params.id)
        res.status(200).json(student)
    }catch(error){
        console.log(error)
    }
}

const postStudent = async (req,res)=>{
    try{
        const newStudent = new Student(req.body)
        const savedStudent = await newStudent.save();
        res.status(200).send(savedStudent)
    }catch(error){
        console.log(error)
    }
}
export {getStudents, getStudent,postStudent}
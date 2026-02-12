import Material from "../models/Material.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, sendType, selectedStudents } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    let studentsList = [];

    if (sendType === "ALL") {
      const faculty = await User.findById(req.user._id);
      studentsList = faculty.students;
    } else if (sendType === "SELECTED" && selectedStudents) {
      studentsList = JSON.parse(selectedStudents);
    }

    const materials = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const fileNameWithoutExt = file.originalname.split(".")[0];

const stream = cloudinary.uploader.upload_stream(
  {
    resource_type: "raw", // IMPORTANT
    folder: "skillify_materials",
    use_filename: true,
    unique_filename: false,
  },

          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(file.buffer);
      });

      const material = await Material.create({
  title,
  description,
  fileName: file.originalname,
  fileType: file.mimetype,
  filePath: result.secure_url,   // keep for preview
  publicId: result.public_id,    // ✅ SAVE STRING ONLY
  faculty: req.user._id,
  students: studentsList,
});

      

      materials.push(material);
    }

    res.json({ success: true, materials });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};


/*
==================================
GET FACULTY STUDENTS
==================================
*/
export const getFacultyStudents = async (req, res) => {
  try {
    const faculty = await User.findById(req.user._id)
      .populate({
  path: "students",
  select: "fullName email phone studentId parents",
  populate: {
    path: "parents",
    select: "fullName email phone parentId",
  },
});


    res.json(faculty.students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

/*
==================================
REMOVE STUDENT CONNECTION
==================================
*/
export const removeStudentConnection = async (req, res) => {
  try {
    const { studentId } = req.params;

    const faculty = await User.findById(req.user._id);
    const student = await User.findById(studentId);

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    // Remove student from faculty
    faculty.students = faculty.students.filter(
      (id) => id.toString() !== student._id.toString()
    );

    // Remove faculty from student
    student.faculties = student.faculties.filter(
      (id) => id.toString() !== faculty._id.toString()
    );

    // Remove student from all parents
    if (student.parents.length > 0) {
      const parents = await User.find({ _id: { $in: student.parents } });

      for (const parent of parents) {
        parent.children = parent.children.filter(
          (id) => id.toString() !== student._id.toString()
        );
        await parent.save();
      }

      student.parents = [];
    }

    await faculty.save();
    await student.save();

    res.json({ message: "Student connection removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove student" });
  }
};

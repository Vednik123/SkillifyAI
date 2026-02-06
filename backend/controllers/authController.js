/**
 * REGISTER
 */
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { generateRoleId } from "../utils/generateUserId.js";

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      role,
      educationLevel,
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Generate Role ID
    const roleId = await generateRoleId(role);

    const userData = {
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
    };

    // 🔹 Attach role-specific fields
    if (role === "student") {
      userData.studentId = roleId;
      userData.educationLevel = educationLevel;
      userData.faceVerified = false;
    }

    if (role === "faculty") {
      userData.facultyId = roleId;
    }

    if (role === "parent") {
      userData.parentId = roleId;
    }

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        role: user.role,
        studentId: user.studentId,
        facultyId: user.facultyId,
        parentId: user.parentId,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * LOGIN
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

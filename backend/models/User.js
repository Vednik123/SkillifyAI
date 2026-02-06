import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "faculty", "parent"],
      required: true,
    },

    // 🔹 ROLE-BASED UNIQUE IDS
    studentId: {
      type: String,
      unique: true,
      sparse: true,
    },

    facultyId: {
      type: String,
      unique: true,
      sparse: true,
    },

    parentId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // 🔹 STUDENT-ONLY FIELDS
    educationLevel: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },

    // 🔐 FACE DATA (STUDENT ONLY)
    faceData: {
      embedding: {
        type: [Number], // Face embedding vector
        default: undefined,
      },
      model: {
        type: String, // e.g. "face-api.js"
      },
      registeredAt: {
        type: Date,
      },
    },

    faceVerified: {
      type: Boolean,
      default: function () {
        return this.role === "student" ? false : undefined;
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    fileName: String,
    fileType: String,
    filePath: String,

    publicId: {              // ✅ ADD THIS
      type: String,
      required: true,
    },

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    scope: {
      type: String,
      enum: ["ALL", "SELECTED", "CLASS"],
      default: "ALL",
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    assignedClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Material", materialSchema);
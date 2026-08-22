const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema(
    {
        problemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        technology: {
            type: String,
            required: true,
            trim: true
        },

        impact: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["Under Review", "Accepted", "Rejected"],
            default: "Under Review"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Solution", solutionSchema);
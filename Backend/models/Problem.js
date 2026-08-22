const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
    {
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

        category: {
            type: String,
            required: true,
            trim: true
        },

        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            required: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        submittedBy: {
            type: String,
            default: "Citizen"
        },

        status: {
            type: String,
            default: "Open for Solutions"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Problem", problemSchema);
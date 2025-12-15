const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        category: String,
        ward: Number,
        address: String,

        status: {
            type: String,
            default: "Pending"
        },
        image: String,
        votes: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);

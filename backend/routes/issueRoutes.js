const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");
const multer = require("multer");
const path = require("path");


/* Multer */
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

/* Create Issue */
router.post("/", upload.single("image"), async (req, res) => {
    const issue = new Issue({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        ward: req.body.ward,
        address: req.body.address,
        image: req.file ? req.file.filename : null
    });
    await issue.save();
    res.json(issue);
});

// GET – Issues with filters & sorting
// GET – Issues with filters, sorting & search
router.get("/", async (req, res) => {
    try {
        const { ward, status, category, sort, search } = req.query;

        let filter = {};

        if (ward) filter.ward = ward;
        if (status) filter.status = status;
        if (category) filter.category = category;

        // 🔍 Universal Search (Admin)
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { status: { $regex: search, $options: "i" } },
                { ward: isNaN(search) ? undefined : Number(search) }
            ].filter(Boolean);
        }

        let query = Issue.find(filter);

        // Sort
        if (sort === "votes") {
            query = query.sort({ votes: -1 });
        } else {
            query = query.sort({ createdAt: -1 });
        }

        const issues = await query;
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* Vote / Unvote */
router.put("/:id/vote", async (req, res) => {
    const { action } = req.body; // "up" or "down"

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });

    if (action === "up") issue.votes += 1;
    if (action === "down" && issue.votes > 0) issue.votes -= 1;

    await issue.save();
    res.json(issue);
});

/* Update Status */
router.put("/:id", async (req, res) => {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
    res.json(issue);
});

/* Delete */
router.delete("/:id", async (req, res) => {
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});
// LIVE SEARCH – Duplicate check (Title + Ward + Category)
router.get("/search/live", async (req, res) => {
    try {
        const { q, ward, category } = req.query;

        if (!q || !ward || !category) return res.json([]);

        const issues = await Issue.find({
            ward: Number(ward),
            category: category,
            title: { $regex: q, $options: "i" }
        })
            .limit(5)
            .select("title category ward status createdAt");

        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

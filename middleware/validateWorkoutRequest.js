module.exports = (req, res, next) => {
    const { title, category, load, sets, reps } = req.body;

    let emptyFields = [];

    if (!title) {
        emptyFields.push("title");
    }
    if (!category) {
        emptyFields.push("category");
    }
    if (load === '') {
        emptyFields.push("load");
    }
    if (!sets) {
        emptyFields.push("sets");
    }
    if (!reps) {
        emptyFields.push("reps");
    }

    if (emptyFields.length > 0) {
        res.status(400).json({ error: `Please fill all the fields.`, emptyFields })
    } else {
        next();
    }
}

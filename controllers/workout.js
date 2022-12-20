const WorkoutModel = require("../models/Workout");
const mongoose = require("mongoose");
const moment = require('moment');

exports.createWorkout = async (req, res) => {
    const { title, category, load, sets, reps, unit, userId } = req.body;
    const loadsChart = [
        {
            date: moment().format('L'),
            load: load
        }
    ];
    try {
        const workout = await WorkoutModel.create({ title, category, sets, reps, load, loadsChart, unit, userId });
        res.status(200).json(workout);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message })
    }
}

exports.getAllWorkouts = async (req, res) => {
    await WorkoutModel.find({ userId: req.auth.userId })
        .then((workouts) => {
            const sortedWorkouts = workouts.sort((a, b) => b.updatedAt - a.updatedAt);
            res.status(200).json(sortedWorkouts);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: err.message });
        })
}

exports.getWokroutsWithCategory = async (req, res) => {
    await WorkoutModel.find({ userId: req.auth.userId, category: req.params.category })
        .then((workouts) => {
            const sortedWorkouts = workouts.sort((a, b) => b.updatedAt - a.updatedAt);
            res.status(200).json(sortedWorkouts);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: err.message });
        })
}

exports.getOneWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: "Workout doesn't exist." })
    } else {
        try {
            const workout = await WorkoutModel.findById(id);
            if (!workout) {
                res.status(404).json({ error: "Workout doesn't exist." })
            } else {
                res.status(200).json(workout);
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: err.message })
        }
    }
}

exports.deleteWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: "Workout doesn't exist." })
    } else {
        const workout = await WorkoutModel.findOneAndDelete({ _id: id });

        if (!workout) {
            res.status(404).json({ error: "Workout doesn't exist." })
        } else {
            res.status(200).json({ message: "Workout deleted successfully." })
        }
    }
}

exports.updateWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: "Workout doesn't exist." })
    } else {
        const workout = await WorkoutModel.findOneAndUpdate({ _id: id }, {
            ...req.body
        }, { new: true });

        if (!workout) {
            res.status(404).json({ error: "Workout doesn't exist." })
        } else {
            res.status(200).json(workout);
        }
    }
}

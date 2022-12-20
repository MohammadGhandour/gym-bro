const express = require("express");
const workoutCtrl = require("../controllers/workout");
const auth = require("../middleware/auth");
const validateWorkoutRequest = require("../middleware/validateWorkoutRequest");
const router = express.Router();

router.post('/', auth, validateWorkoutRequest, workoutCtrl.createWorkout);
router.get('/', auth, workoutCtrl.getAllWorkouts);
router.get('/categories/:category', auth, workoutCtrl.getWokroutsWithCategory);
router.get('/:id', workoutCtrl.getOneWorkout);
router.delete('/:id', auth, workoutCtrl.deleteWorkout);
router.patch('/:id', validateWorkoutRequest, workoutCtrl.updateWorkout);

module.exports = router;
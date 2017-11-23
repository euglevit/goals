const mongoose = require('mongoose');

const shortGoalsSchema = mongoose.Schema({
	shortGoal: String,
	date : {type: Date, default: Date.now},
	complete: false
})

const updateSchema = mongoose.Schema({
	update: String,
	date : {type: Date, default: Date.now}
})

const goalsSchema = mongoose.Schema({
		userId : {type: String, required: true},
		goal: {type: String, required: true},
		date: {type: Date, default: Date.now},
		complete: false,
		shortTermGoals: [shortGoalsSchema],
		updates: [updateSchema]
	})


// goalsSchema.virtual('shortGoals').get(function() {
// 	this.shortTermGoals.forEach(goal => [this.shortTermGoals[goal].shortGoal]);
// })

goalsSchema.methods.apiRepr = function() {
  	return {
  	id : this._id,
    userId : this.userId,
	goal: this.goal,
	date: this.date,
	complete: this.complete,
	shortTermGoals: this.shortTermGoals,
	updates: this.updates
	}
}

const GoalPost = mongoose.model('GoalPost', goalsSchema, 'goals');

module.exports = {GoalPost};
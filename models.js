const mongoose = require('mongoose');

const goalsSchema = mongoose.Schema({
		userId : {type: String, required: true},
		goal: {type: String, required: true},
		date: {type: Date, default: Date.now},
		complete: false,
		shortTermGoals: [
			{ 
				shortGoal: String,
				date: {type: Date, default: Date.now},
				complete: false
			},
		],
		updates: [
			{
				update: String,
				date: Date.now(),
			}

		]
	})

goalsSchema.methods.apiRepr = function() {
  return {
    userId : this._id,
	goal: this.goal,
	date: this.date,
	complete: this.complete,
	shortTermGoals: [
		{ 
			shortGoal: this.shortGoal,
			date: this.date,
			complete: this.complete
		},
	],
	updates: [
		{
			update: this.update,
			date: this.date,
		}

	]
}
}

const GoalPost = mongoose.model('GoalPost', goalsSchema, 'goals');

module.exports = {GoalPost};
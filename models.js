const mongoose = require('mongoose');

const goalsSchema = mongoose.Schema({
		userId : {type: String, required: true},
		goal: {type: String, required: true},
		date: {type: Date, default: Date.now},
		complete: false,
		// shortTermGoals: [
		// 	{ 
		// 		shortGoal: String,
		// 		date: {type: Date, default: Date.now},
		// 		complete: false
		// 	}
		// ],
		// updates: [
		// 	{
		// 		update: String,
		// 		date: Date.now(),
		// 	}

		// ]
	})
// goalsSchema.virtual('shortGoals').get(function() {
//   return [`${this.shortTermGoals.shortGoal}`, `${this.shortTermGoals.date}`, `${this.shortTermGoals.complete}`];
// });

goalsSchema.methods.apiRepr = function() {
  return {
  	id : this._id,
    userId : this.userId,
	goal: this.goal,
	date: this.date,
	complete: this.complete,
// 	shortTermGoals: this.shortGoals,
// 	updates: [
// 		{
// 			update: this.update,
// 			date: this.date,
// 		}

// 	]
// }
}
}

const GoalPost = mongoose.model('GoalPost', goalsSchema, 'goals');

module.exports = {GoalPost};
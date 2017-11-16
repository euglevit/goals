let MOCK_GOALS = {
	"long_term_goals" : [
	{
		"id": "1111111",
		"goal": "Weight 180 pounds",
		"date": Date.now(),
		"complete": "False",
		"shortTermGoals": [
			{ 
				"short_goal": "Weight 230 pounds",
				"date": Date.now(),
				"complete": "False"
			},
			{
				"short_goal": "Weight 205 punds",
				"date": Date.now(),
				"complete": "False"
			}
		],
		"updates": [
			{
				"update": "Today I excersized for 3 hours",
				"date": Date.now(),


			}


		]
	},
	{
		"id": "1111112",
		"goal": "Weight 100 pounds",
		"date": Date.now(),
		"complete": "False",
		"shortTermGoals": [
			{ 
				"short_goal": "Weight 150 pounds",
				"date": Date.now(),
				"complete": "False"
			},
			{
				"short_goal": "Weight 120 pounds",
				"date": Date.now(),
				"complete": "False"
			}
		],
		"updates": [
			{
				"update": "Today I excersized for 3 hours",
				"date": Date.now(),


			}


		]
	}

]}

function getGoals(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_GOALS)}, 100);
}

function displayGoals(data) {
    for (index in data.long_term_goals) {
       $('body').append(
        '<p>' + data.long_term_goals[index].goal + '</p>');
    }
}

function getAndDisplay() {
    getGoals(displayGoals);
}

$(function() {
    getAndDisplay();
})
$('p').append('hello');

console.log(MOCK_GOALS);
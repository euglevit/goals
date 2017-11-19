let MOCK_GOALS = {
	"long_term_goals" : [
	{
		"id": "1111111",
		"userId" : "joeshmo",
		"goal": "Weight 180 pounds",
		"date": Date.now(),
		"complete": false,
		"shortTermGoals": [
			{ 
				"shortGoal": "Weight 230 pounds",
				"date": Date.now(),
				"complete": false
			},
			{
				"shortGoal": "Weight 205 punds",
				"date": Date.now(),
				"complete": false
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
		"userId": "jane",
		"goal": "Weight 100 pounds",
		"date": Date.now(),
		"complete": false,
		"shortTermGoals": [
			{ 
				"shortGoal": "Weight 150 pounds",
				"date": Date.now(),
				"complete": false
			},
			{
				"shortGoal": "Weight 120 pounds",
				"date": Date.now(),
				"complete": false
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
		"id": "1111113",
		"userId": "jane",
		"goal": "Get a tech job",
		"date": Date.now(),
		"complete": "false",
		"shortTermGoals": [
			{ 
				"shortGoal": "Learn Javascript",
				"date": Date.now(),
				"complete": "false"
			},
			{ 
				"shortGoal": "Learn something",
				"date": Date.now(),
				"complete": "false"
			},
			{ 
				"shortGoal": "Learn something else",
				"date": Date.now(),
				"complete": "false"
			},
			  
		],
		"updates": [
			{
				"update": "Today I programmed for 3 hours",
				"date": Date.now(),


			}


		]
	}

]}


function getGoals(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_GOALS)}, 100);
}

// function displayGoals(data) {
//     for (index in data.long_term_goals) {
//        $('body').append(
//         '<p>' + data.long_term_goals[index].goal + '</p>');
//     }
// }

function getAndDisplay() {
    getGoals(displayGoals);
}

function getUser() {
	let user = 'jane';
}

function displayGoalsByUser(data) {
	let user = 'jane';
	for(let i = 0; i < data.long_term_goals.length; i++){
		if(data.long_term_goals[i].userId === user){
			$('.main-container').append(
				`
				<div class='goal-container'>
					<div class='goal-name'>
						<div>
							<h2>Add An Update</h2>
							<h2>View Previous Updates</h2>	
							<div class="panel-group">
							    <div class="panel panel-default">
							      <div class="panel-heading">
							        <h4 class="panel-title">
							          <a data-toggle="collapse" href="#collapse${i}">Collapsible list group</a>
							        </h4>
							      </div>
									<div id="collapse${i}" class="panel-collapse collapse">
		        						<ul class="updates${i} list-group">
		        						</ul>
		        						
		        					</div>
		        				</div>
		        			</div>

						</div>

					<h2>${data.long_term_goals[i].goal}</h2>
						<div class='short-goals${i}'>
							

						</div>
					</div>
				</div>
				`
				);
				data.long_term_goals[i].shortTermGoals.map( shortGoal =>$(`.short-goals${i}`).append(`<p>${shortGoal.shortGoal}</p>`));
				data.long_term_goals[i].updates.map( update =>$(`.updates${i}`).append(`<li class='list-group-item'>${update.update}</li>`));	
		};
	};
}



function getAndDisplayUser() {
	getGoals(displayGoalsByUser);
	// getGoals(displayShortTermGoals);
}

function addUpdate() {
	 
}

$(function() {
    // getAndDisplay();
    getAndDisplayUser();
})

console.log(MOCK_GOALS);
$(document).ready(function() {
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
			$('.main-container').prepend(
				`
				<div class='goal-container'>
					<div class='goal-name'>
						<h2>${data.long_term_goals[i].goal}</h2>
						<div>
								<div class="panel-group">
								  <div class="panel panel-default">
								    <div class="panel-heading">
								      <h4 class="panel-title">
								        <h2 data-toggle="collapse" href="#text${i}">Add An Update</h2>
								      </h4>
								    </div>
								    <div id="text${i}" class="panel-collapse collapse">
								      <div class="panel-body"><textarea class='submit-data' rows="4" cols="50" value=${i}>Tell us about your progress today!</textarea><button class='submit-update' value=${i}>Submit</button></div>
								    </div>
								  </div>
								</div>
								<div class="panel-group">
								    <div class="panel panel-default">
								      <div class="panel-heading">
								        <h4 class="panel-title">
								          <h2 data-toggle="collapse" href="#collapse${i}">View Previous Updates</h2>
								        </h4>
								      </div>
										<div id="collapse${i}" class="panel-collapse collapse">
			        						<ul class="updates${i} list-group">
			        						</ul>
			        						
			        					</div>
			        				</div>
			        			</div>
						</div>
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

function submitData(data){
	$(document).on('click', '.submit-update', function(event) {
		event.preventDefault();
		let updateIndex = parseInt($(this).val());
		let submitData = $(`.submit-data[value=${updateIndex}]`).val();
		console.log(submitData);
		let newUpdate = data.long_term_goals[updateIndex].updates.push({'update': submitData, Date: Date.now()});

		$(`.updates${updateIndex}`).prepend(`<li class='list-group-item'>${data.long_term_goals[updateIndex].updates[data.long_term_goals[updateIndex].updates.length-1].update}</li>`);
	})
}

function newGoal() {

	$(document).on('click', '.new-goal-button', function(event) {
		event.preventDefault();
		$('.new-goal').show();
		$('.new-goal').append(
			`
			<div class='new-goal-container'>
				<div class='new-long-term-goal-header'>
					<h3>Enter in a New Long Term Goal</h3>
					<textarea class='new-long-term-goal' rows="4" cols="50">Type Your Goal Here</textarea>
				</div>
				<div class='new-short-term-goals-header'>
					<h3>Enter in up to 3 Short Term Goals</h3>
					<textarea class='new-short-term-goals1' rows="4" cols="50">Type Your Short Term Goals Here</textarea>
					<textarea class='new-short-term-goals2' rows="4" cols="50">Type Your Short Term Goals Here</textarea>
					<textarea class='new-short-term-goals3' rows="4" cols="50">Type Your Short Term Goals Here</textarea>
				</div>
				<button class='submit-new-goals'>Submit</button>
			</div>
			`)
	})
}

function submitNewGoals(data) {
	$(document).on('click','.submit-new-goals', function(event) {
		event.preventDefault();
		let longTermGoal = $('.new-long-term-goal').val();
		let shortTermGoal1 = $('.new-short-term-goals1').val();
		let shortTermGoal2 = $('.new-short-term-goals2').val();
		let shortTermGoal3 = $('.new-short-term-goals3').val();
		let newObject = { "long_term_goals" : [{"id": "1111114","userId" : "jane","goal": longTermGoal,
			"date": Date.now(),"complete": false,
			"shortTermGoals": [ { "shortGoal": shortTermGoal1, "date": Date.now(), "complete": "false" },
			{ "shortGoal": shortTermGoal2, "date": Date.now(), "complete": "false" }, 
			{  "shortGoal": shortTermGoal3, "date": Date.now(), "complete": "false" }], 
			 "updates":[]}]};
		data.long_term_goals.push(newObject);
		displayGoalsByUser(newObject);
		console.log(data.long_term_goals);
		$('.new-goal').html('');
		
	})
	// getGoals(displayGoalsByUser);
}

function refreshUpdates() {}


function getAndDisplayUser() {
	getGoals(displayGoalsByUser);
	// getGoals(displayShortTermGoals);
}

function getData(){
	getGoals(submitData);
}

function newGoalData() {
	getGoals(newGoal);
	getGoals(submitNewGoals);
}

function addUpdate() {
	 
}

$(function() {
    // getAndDisplay();
    getAndDisplayUser();
    getData();
    newGoalData();



})

console.log(MOCK_GOALS);
})
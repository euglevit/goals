$(document).ready(function() {
let goalData;



let myGoals = [];
function getGoals() {
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/goals'
	}).done(displayGoalsByUser)
}

function postUpdate(id,dataInfo) {
	$.ajax({
		type: 'POST',
		url: `http://localhost:/goals/:${id}/updates`,
		data: dataInfo
	}).done(displayGoalsByUser)
}
	
    // setTimeout(function(){ callbackFn(MOCK_GOALS)}, 100);


// function displayGoals(data) {
//     for (index in data) {
//        $('body').append(
//         '<p>' + data[index].goal + '</p>');
//     }
// }

function getAndDisplay() {
    getGoals(displayGoals);
}

function getUser() {
	let user = 'jane';
}

function displayGoalsByUser(data) {
	goalData = data;
	console.log('goal data', goalData);
	console.log(data, 'hello');
	let user = 'jane';

	for(let i = 0; i < data.length; i++){
		console.log(i);
		if(data[i].userId === user){
			$('.secondary-container').append(
				`
				<div class='goal-container'>

					<div class='goal-name'>
						<h2>${data[i].goal}</h2>
						
								<div class="panel-group">
								  <div class="panel panel-default">
								    <div class="panel-heading">
								      <h4 class="panel-title">
								        <h2 data-toggle="collapse" href="#text${i}">Add An Update</h2>
								      </h4>
								    </div>
								    <div id="text${i}" class="panel-collapse collapse">
								      <div class="panel-body"><textarea class='submit-data' value=${i}>Tell us about your progress today!</textarea><button class='submit-update' value=${i}>Submit</button></div>
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
						<h2>Short Term Goals</h2>
						</div>
					</div>
				</div>
				`
				);
				data[i].shortTermGoals.map( shortGoal =>$(`.short-goals${i}`).append(`<p>${shortGoal.shortGoal}</p>`));
				data[i].updates.map( update =>$(`.updates${i}`).append(`<li class='list-group-item'>${update.update}</li>`));
				checkDate(data);
				console.log(i);
				if(i + 1 === data.length){
					break;
				}
		};
	};
}



function submitData(updateIndex,submitDataInfo){
	console.log('other stuff');
		// let newUpdate = goalData[updateIndex].updates.push({'update': submitDataInfo, date: Date.now()});
		let pushUpdate = {'update': submitDataInfo, Date: Date.now()};
		console.log(goalData);
		let goalId = goalData[updateIndex]._id
		console.log(goalId);
    	$.ajax({
        	type: `POST`,
        	url: `http://localhost:8080/goals/${goalId}/updates`,
        	data: { 
            	update: submitDataInfo // < note use of 'this' here
        },
        success: function(result) {
            alert('ok');
        },
        error: function(result) {
            alert('error');
        },
        dataType: "json",
        contentType: "application/json"
    });
    	// let notZero = goalData[updateIndex].updates[goalData[updateIndex].updates.length].update;
    	

		$(`.updates${updateIndex}`).prepend(`<li class='list-group-item'>${submitDataInfo}</li>`);
	}

$(document).on('click','.submit-update', function(event) {
	console.log('goalData', goalData);
	console.log('stuff');
	let updateIndex = parseInt($(this).val());
	console.log(updateIndex);
	let submitDataInfo = $(`.submit-data[value=${updateIndex}]`).val();
	submitData(updateIndex, submitDataInfo);
})


function newGoal() {

	$(document).on('click', '.new-goal-button', function(event) {
		event.preventDefault();
		$('.new-goal').show();
		$('.new-goal').prepend(
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

function checkDate(data) {
	let inputDate = new Date("11/25/2017");
	let todaysDate = new Date();
	todaysDate = todaysDate.setHours(0,0,0,0);
	for(let i=0; i<data.length;i++){
		try{
			if(data[i].updates[data[i].updates.length-1].date !== undefined){
				let updateDate = data[i].updates[data[i].updates.length-1].date;
				console.log(updateDate);
			}
		}
		catch(e){
			console.log('error');
		}
	}
		// let updateDateInt = parseInt(updateDate);
		try{
			if(todaysDate === updateDate.setHours(0,0,0,0) && updateDate != undefined){
			$('.goal-container').css('border-left','20px solid #32CD32');
			}
		}catch(e){
			console.log('error');
		}
	}
	


function submitNewGoals(data) {
	$(document).on('click','.submit-new-goals', function(event) {
		event.preventDefault();
		let longTermGoal = $('.new-long-term-goal').val();
		let shortTermGoal1 = $('.new-short-term-goals1').val();
		let shortTermGoal2 = $('.new-short-term-goals2').val();
		let shortTermGoal3 = $('.new-short-term-goals3').val();
		let newObject = {"id": "1111114","userId" : "jane","goal": longTermGoal,
			"date": Date.now(),"complete": false,
			"shortTermGoals": [ { "shortGoal": shortTermGoal1, "date": Date.now(), "complete": "false" },
			{ "shortGoal": shortTermGoal2, "date": Date.now(), "complete": "false" }, 
			{  "shortGoal": shortTermGoal3, "date": Date.now(), "complete": "false" }], 
			 "updates":[]};
		data.push(newObject);
		$('.secondary-container').html('');
		$('.new-goal').html('');
		
		displayGoalsByUser(data);
		console.log(data);
		
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
	// getGoals(newGoal);
	// getGoals(submitNewGoals);
}

function addUpdate() {
	 
}

$(function() {
    // getAndDisplay();
    getAndDisplayUser();
    getData();
    newGoalData();



})

console.log('start');
})


$(document).ready(function() {
	let state = {
		loggedIn: false,
		//Keeps track of the user's token (logged in/not logged in)
		token:"",
		goalsArray: []
	}
let goalData;

//url: 'ewgnwiegun'
// headers: { authorization: yourjwt }
// method: 'POST'



let myGoals = [];
function getGoals() {
	const token = localStorage.getItem('authToken');
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/goals',
		headers: {
			"Authorization": `Bearer ${token}`
		}
	}).done(function(data){
		goalData = data;

		// console.log(data.user);
		displayGoalsByUser(data);
	})
}

//handles the sign up FUNCTION
function signUp(username, password) {
	
		let userData = {
			username: username,
			password: password
		};
	
		//api/auth/login
		return new Promise ((resolve, reject) => {
			$.ajax({
					method: 'POST',
					url: '/api/users',
					data: JSON.stringify(userData),
					contentType: 'application/json; charset=utf-8',
					dataType: 'text json',
					success: function(data){ 
						resolve(data);
						console.log(data);
					 },
					error: function(data){ 
						reject(data.responseJSON); 
						console.log(data);
					}
				}).done(function(data){
					console.log(data);
				})
			})
}
  
	//handles the sign up
$('#sign-up-form-js').submit(function(event) {
	event.preventDefault();
	let username = $('#username-js-signup').val();
	let password = $('#password-js-signup').val();
	signUp(username, password);
});

//handles the Log in
$('#login-form-js').submit(function(event) {
	event.preventDefault();
	let username = $('#username-js-login').val();
	let password = $('#password-js-login').val();
	logIn(username, password);
});

function logIn(username, password) {
	
	let userData = {
		username: username,
		password: password
	};
	console.log(JSON.stringify(userData));
	return new Promise((resolve, reject) => {
		$.ajax({
			method: 'POST',
			url: `api/auth/login`,
			data: JSON.stringify(userData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			username: username,
			password: password,
			// headers: {
			// 		"Authorization" : `Basic ${state.token}`
			// 	},
			success: function(data){ 
				console.log('data', data);
				localStorage.setItem('authToken', data.authToken);
				
				
				resolve();
			},
			error: function(data){ 
				console.log('login error', data)
				console.log(state);
				reject(data); }
		}).done(function(data){
			console.log("login error", data);
		});
	});
}


function getAndDisplay() {
    getGoals(displayGoals);
}




function displayGoalsByUser(data) {
	console.log('goal data', goalData);
	console.log(data, 'hello');
	// $('.username').replaceWith(`<li class=username>Hello ${data[i].userId}</li>`);
	// $('.username').replaceWith(`<h2></h2>`);


	for(let i = 0; i < data.length; i++){
		console.log(i);
		if(data[i].userId !== undefined && data[i].updates[data[i].updates.length-1] !== undefined ){
			
			$('.secondary-container').prepend(
				`
				<div class='goal-container' val=${data[i]._id}>

					<div class='goal-name'>
						<h2>${data[i].goal}<p class='last-updated' value=${data[i]._id}> Last update on ${new Date([data[i].updates[data[i].updates.length-1].date]).toLocaleDateString()}</p></h2>
						
						<textarea class='submit-data form-control' value=${data[i]._id}>Tell us about your progress today!</textarea>
						<button class='btn submit-update' value=${data[i]._id}>Go!</button>
						
								<div class="panel-group update-class">
								  <div class="panel panel-default">
								    <div class="panel-heading">
								      <h4 class="panel-title">
								        <h2 data-toggle="collapse" href="#text${data[i]._id}">Add An Update</h2>
								      </h4>
								    </div>
								    <div id="text${data[i]._id}" class="panel-collapse collapse">
								      <div class="panel-body"><textarea class='submit-data' value=${data[i]._id}>Tell us about your progress today!</textarea><button class='submit-update' value=${data[i]._id}>Submit</button></div>
								    </div>
								  </div>
								</div>
								<div class="panel-group view-updates-class">
								    <div class="panel panel-default">
								      <div class="panel-heading">
								        <h4 class="panel-title">
								          <h2 data-toggle="collapse" href="#collapse${data[i]._id}">View Previous Updates</h2>
								        </h4>
								      </div>
										<div id="collapse${data[i]._id}" class="panel-collapse collapse">
			        						<ul class="updates${data[i]._id} list-group">
			        						</ul>
			        						
			        					</div>
			        				</div>
			        			</div>
						</div>
						<div class='show-updates' data-toggle='collapse' data-target='#updates-collapse'></div>

						<div class='short-goal-class short-goals${data[i]._id}'>
						<h2>Short Term Goals</h2>
						</div>
						<button type="button" class="delete-button btn btn-default btn-sm" val=${data[i]._id}>
          					<span class="glyphicon glyphicon-trash"></span> <span class='trash'>Trash</span> </button>
          				<button aria-expanded="false" type="button" data-toggle='collapse' data-target='#updates-collapse${data[i]._id}' class="collapse.in show-updates-button btn btn-default btn-sm" val=${data[i]._id}>
				          <span class="glyphicon glyphicon-list-alt"></span> <span class='view-updates'>View Updates</span>
				        </button>
				        <div class='show-updates collapse' id='updates-collapse${data[i]._id}' value=${data[i]._id}'>
							<ul class='updates-list' val=${data[i]._id} ></ul>
						</div>
        				
					</div>
				</div>
				`
				);
				data[i].shortTermGoals.map( shortGoal =>$(`.short-goals${i}`).append(`<p>${shortGoal.shortGoal}</p>`));
				data[i].updates.map( update =>{
					console.log(update);
					$(`.updates-list[val=${data[i]._id}]`).prepend(`<li class='updates-list-li list-group-item'>${update.update} <cite><p class='updates-date'>-${new Date(update.date).toLocaleDateString()}</p></cite></li>`)
				});
				checkDate(data);
				console.log(i);
				if(i + 1 === data.length){
					break;
				}
			}else{
					$('.secondary-container').prepend(
				`
				<div class='goal-container' val=${data[i]._id}>

					<div class='goal-name'>
						<h2>${data[i].goal}<p class='last-updated' value=${data[i]._id}> No updates! Post an update!</p></h2>
						
						<textarea class='submit-data form-control' value=${data[i]._id}>Tell us about your progress today!</textarea>
						<button class='btn submit-update' value=${data[i]._id}>Go!</button>
						
								<div class="panel-group update-class">
								  <div class="panel panel-default">
								    <div class="panel-heading">
								      <h4 class="panel-title">
								        <h2 data-toggle="collapse" href="#text${data[i]._id}">Add An Update</h2>
								      </h4>
								    </div>
								    <div id="text${data[i]._id}" class="panel-collapse collapse">
								      <div class="panel-body"><textarea class='submit-data' value=${data[i]._id}>Tell us about your progress today!</textarea><button class='submit-update' value=${data[i]._id}>Submit</button></div>
								    </div>
								  </div>
								</div>
								<div class="panel-group view-updates-class">
								    <div class="panel panel-default">
								      <div class="panel-heading">
								        <h4 class="panel-title">
								          <h2 data-toggle="collapse" href="#collapse${data[i]._id}">View Previous Updates</h2>
								        </h4>
								      </div>
										<div id="collapse${data[i]._id}" class="panel-collapse collapse">
			        						<ul class="updates${data[i]._id} list-group">
			        						</ul>
			        						
			        					</div>
			        				</div>
			        			</div>
						</div>
						<div class='short-goal-class short-goals${data[i]._id}'>
						<h2>Short Term Goals</h2>
						</div>
						<button type="button" class="delete-button btn btn-default btn-sm" val=${data[i]._id}>
          					<span class="glyphicon glyphicon-trash"></span> <span class='trash'>Trash</span> 
        				</button>
        				<button aria-expanded="false" type="button" data-toggle='collapse' data-target='#updates-collapse${data[i]._id}' class="collapse.in show-updates-button btn btn-default btn-sm" val=${data[i]._id}>
				          <span class="glyphicon glyphicon-list-alt"></span> <span class='view-updates'>View Updates</span>
				        </button>
				        <div class='show-updates collapse' id='updates-collapse${data[i]._id}' value=${data[i]._id}'>
							<ul class='updates-list' val=${data[i]._id} ></ul>
						</div>
					</div>
				</div>
				`
				);
				data[i].shortTermGoals.map( shortGoal =>$(`.short-goals${i}`).append(`<p>${shortGoal.shortGoal}</p>`));
				data[i].updates.map( update =>{
					console.log(update);
					$(`.updates-list[val=${data[i]._id}]`).append(`<li class='list-group-item'>${update.update}</li>`)
				});
				checkDate(data);
				console.log(i);
				if(i + 1 === data.length){
					break;
				}	
				};
		
	};
}

$(document).on('click','.show-updates-button',function(event) {
	event.preventDefault();
	let goalId = $(this).attr('val');
	showUpdatesFunction(goalId);	
})

function showUpdatesFunction(goalId){
	const token = localStorage.getItem('authToken');
	$.ajax({
		type: 'GET',
		url: `http://localhost:8080/goals/` ,
		headers: {
			"Authorization": `Bearer ${token}`
		} 
	}).done(function(data){
		let dataIndex;
		for(let i=0;i<data.length;i++){
			if(data[i]._id === goalId){
				dataIndex = i;
			}
		}
		for(let i=0;i<data[dataIndex].updates.length;i++){
			console.log(data[dataIndex].updates);
		}
	})
}

$(document).on('click','.submit-update', function(event) {
	event.preventDefault();
	let updateIndex = $(this)[0].value;
	
	let submitDataInfo = $(`.submit-data[value=${updateIndex}]`).val();
	submitData(updateIndex, submitDataInfo);
})


function submitData(updateIndex,submitDataInfo){
	console.log('other stuff');
		let pushUpdate = {'update': submitDataInfo, Date: Date.now()};
		let goalId = updateIndex;
		data2 = JSON.stringify({update : submitDataInfo});
		console.log(data2);
		const token = localStorage.getItem('authToken');
    	$.ajax({
        	type: `POST`,
        	url: `http://localhost:8080/goals/${goalId}/updates`,
					data: data2,
					headers : {
						"Authorization" : `Bearer ${token}`
					},
        success: function(result) {
            console.log('update ok');
        },
        error: function(result) {
            console.log('update error');
        },
        // dataType: "json",
        contentType: "application/json"
    }).done(function(data) {
		console.log('check here',data);
		$(`.goal-container[val=${goalId}]`).css('border-left','20px solid #32CD32');
		$(`.last-updated[value=${goalId}]`).html(`<p class='last=updated' value=${goalId}}>Last update on ${new Date([data.updates[data.updates.length-1].date]).toLocaleDateString()}</p>`)
		$(`.updates-list[val=${goalId}]`).prepend(`<li class='updates-list-li list-group-item'>${data.updates[data.updates.length-1].update} <cite><p class='updates-date'>- ${new Date(data.updates[data.updates.length-1].date).toLocaleDateString()}</p></cite></li>`)
	})

    	// let notZero = goalData[updateIndex].updates[goalData[updateIndex].updates.length].update;
		// $(`.updates-list[val=${updateIndex}]`).prepend(`<li class='list-group-item'>${submitDataInfo}</li>`);
}

//Delete Goal ON CLICK
$(document).on('click','.delete-button', function(event) {
	console.log('yoyo', $(this).attr('val'));
	event.preventDefault();
	let deleteIndex = $(this).attr('val');
	deleteGoal(deleteIndex);
})

//Delete Goal FUNCTION
function deleteGoal(deleteIndex){
	let goalId = deleteIndex;
	console.log(goalId);
	$.ajax({
        	type: `DELETE`,
        	url: `http://localhost:8080/goals/${goalId}`,
        	// data: data2,
        success: function(result) {
            console.log('delete ok');
        },
        error: function(result) {
            console.log('delete error');
        },
        // dataType: "json",
        // contentType: "application/json"
    }).done(function(data){
    	console.log(data);
    	$(`.goal-container[val=${goalId}]`).animate({
                left: '-100%',
            }, 1000);
    	setTimeout(function(){
    		$(`.goal-container[val=${goalId}]`).remove();
    	},1100);
    });
}




//New Goal ON CLICK
$(document).on('click', '.new-goal-button', function(event) {
	event.preventDefault();
	$('.new-goal').show();
	$('.new-goal').prepend(
		`
		<div class='new-goal-container'>
			<div class='new-long-term-goal-header'>
				<h3>Enter in a New Long Term Goal</h3>
				<textarea class='new-long-term-goal form-control' rows="4" cols="50">Type Your Goal Here</textarea>
			</div>
		
			<button class='submit-new-goals'>Submit</button>
		</div>
		`)
})





//Sets the left border color to green if the goal has been updated today
function checkDate(goals) {
	if(goals.length === undefined){
		goals = [goals];
	}
	let inputDate = new Date("11/25/2017");
	let todaysDate = new Date();
	todaysDate = todaysDate.setHours(0,0,0,0);
	for(let i=0; i<goals.length;i++){
		// let updateDate = data[i].updates[data[i].updates.length-1].date;
		try{
			if(goals[i].updates[goals[i].updates.length-1].date !== undefined){
				let updateDate = new Date(goals[i].updates[goals[i].updates.length-1].date);
				if(todaysDate === updateDate.setHours(0,0,0,0) && updateDate != undefined){
					console.log(updateDate);
					$(`.goal-container[val=${goals[i]._id}]`).css('border-left','20px solid #32CD32');
					}
			}
		}
		catch(e){
			console.log('error');
		}
	}		// let updateDateInt = parseInt(updateDate);
}
	
//Submit New Goals ON CLICK
$(document).on('click','.submit-new-goals', function(event) {
	event.preventDefault();
	let longTermGoal = $('.new-long-term-goal').val();
	submitNewGoal(longTermGoal);

		
	// displayGoalsByUser(goalData);
	// console.log(goalData);
		
})

//Submit new Goal FUNCTION
function submitNewGoal(longTermGoal) {
	let data2 = JSON.stringify({goal : longTermGoal});
	const token = localStorage.getItem('authToken');
	$.ajax({
        	type: `POST`,
        	url: `http://localhost:8080/goals/`,
					data: data2,
					headers : {
						"Authorization": `Bearer ${token}`
					},
        success: function(result) {
            console.log('Submit new goal ok');
        },
        error: function(result) {
            alert('submit new goal error');
        },
        // dataType: "json",
        contentType: "application/json"
    }).done(function(data){
    	goalData[length] = data;
    	data = [data];
    	displayGoalsByUser(data);
    })

    
    	// let notZero = goalData[updateIndex].updates[goalData[updateIndex].updates.length].update;		// $(`.updates${updateIndex}`).prepend(`<li class='list-group-item'>${submitDataInfo}</li>`);
	
}

function refreshUpdates() {}


function getAndDisplayUser() {
	getGoals(displayGoalsByUser);
	// getGoals(displayShortTermGoals);
}



$(function() {
    // getAndDisplay();
    getAndDisplayUser();



})

console.log('start');
})
$(document).ready(function () {


	let goalData;
	let minUsername = 1;
	let minPassword = 8;
	let myGoals = [];


	// Get's all the goals from the database and then displays them in the DOM
	function getGoals() {
		const token = localStorage.getItem('authToken');
		$.ajax({
			type: 'GET',
			url: '/goals',
			headers: {
				"Authorization": `Bearer ${token}`
			}
		}).done(function (data) {
			goalData = data;
			displayGoalsByUser(data);
		})
	}

	//handles the sign up FUNCTION
	function signUp(username, password) {

		let userData = {
			username: username,
			password: password
		};

		return new Promise((resolve, reject) => {
			$.ajax({
				method: 'POST',
				url: '/api/users',
				data: JSON.stringify(userData),
				contentType: 'application/json; charset=utf-8',
				dataType: 'text json',
				success: function (data) {
					resolve(data);
				},
				error: function (data) {
					reject(data.responseJSON);
				}
			}).done(function (data) {
				logIn(username, password);
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
				$('.new-goal').attr('val', 'true');
			})
		})
	}

	//handles the login Function
	function logIn(username, password) {

		let userData = {
			username: username,
			password: password
		};
		return new Promise((resolve, reject) => {
			$.ajax({
				method: 'POST',
				url: `api/auth/login`,
				data: JSON.stringify(userData),
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				username: username,
				password: password,
				success: function (data) {
					localStorage.setItem('authToken', data.authToken);
					resolve();
				},
				error: function (data) {
					handleLoginErrors();
					reject(data);
				}
			}).done(function (data) {
				$('.username').replaceWith(`<li class=username>Hello ${username}</li>`);
				$('.login-username').val('');
				$('.login-password').val('');
				$('.logged-in-nav').css('display', '');
				$('.startup-nav').css('display', 'none');
				$('.start-page').html('');
				$('.start-page').css('display', 'none');
				getGoals(displayGoalsByUser);
			})
		});
	}

	//Shows all updates in a collapsible menu
	function showUpdatesFunction(goalId) {

		const token = localStorage.getItem('authToken');

		$.ajax({
			type: 'GET',
			url: `/goals/`,
			headers: {
				"Authorization": `Bearer ${token}`
			}
		}).done(function (data) {
			let dataIndex;
			for (let i = 0; i < data.length; i++) {
				if (data[i]._id === goalId) {
					dataIndex = i;
				}
			}
			for (let i = 0; i < data[dataIndex].updates.length; i++) {}
		})
	}

	//Submits updates into DB and shows in the DOM
	function submitData(updateIndex, submitDataInfo) {
		let pushUpdate = {
			'update': submitDataInfo,
			Date: Date.now()
		};
		let goalId = updateIndex;
		data2 = JSON.stringify({
			update: submitDataInfo
		});
		const token = localStorage.getItem('authToken');
		$.ajax({
			type: `POST`,
			url: `/goals/${goalId}/updates`,
			data: data2,
			headers: {
				"Authorization": `Bearer ${token}`
			},
			success: function (result) {},
			error: function (result) {},
			// dataType: "json",
			contentType: "application/json"
		}).done(function (data) {
			$(`.goal-container[val=${goalId}]`).css('border-left', '20px solid #32CD32');
			$(`.last-updated[value=${goalId}]`).html(`<p class='last=updated' value=${goalId}}>Last update on ${new Date([data.updates[data.updates.length-1].date]).toLocaleDateString()}</p>`)
			$(`.updates-list[val=${goalId}]`).prepend(`<li class='updates-list-li list-group-item'>${data.updates[data.updates.length-1].update} <cite><p class='updates-date'>- ${new Date(data.updates[data.updates.length-1].date).toLocaleDateString()}</p></cite></li>`)
		})
	}

	//Deletes the Long Term Goal from the DB. 
	function deleteGoal(deleteIndex) {
		let goalId = deleteIndex;
		$.ajax({
			type: `DELETE`,
			url: `/goals/${goalId}`,
			// data: data2,
			success: function (result) {},
			error: function (result) {},
		}).done(function (data) {
			$(`.goal-container[val=${goalId}]`).animate({
				left: '-100%',
			}, 1000);
			setTimeout(function () {
				$(`.goal-container[val=${goalId}]`).remove();
			}, 1100);
		});
	}

	//Submit new Goal FUNCTION
	function submitNewGoal(longTermGoal) {
		let data2 = JSON.stringify({
			goal: longTermGoal
		});
		const token = localStorage.getItem('authToken');
		$.ajax({
			type: `POST`,
			url: `/goals/`,
			data: data2,
			headers: {
				"Authorization": `Bearer ${token}`
			},
			success: function (result) {},
			error: function (result) {
				alert('submit new goal error');
			},
			contentType: "application/json"
		}).done(function (data) {
			goalData[length] = data;
			data = [data];
			displayGoalsByUser(data);
		})
	}

	//handles the sign out
	$(document).on('click', '.sign-out', function (event) {
		event.preventDefault();
		$('.logged-in-nav').css('display', 'none');
		$('.startup-nav').css('display', '');
		$('.start-page').css('display', '');
		$('.start-page').append(
			`
		<div class='start-content'> 
		<div class='left-start'>
			<h1>Meet HitGoal, the surefire way to make your dreams come true</h1>
			<p>Create long term goals and post updates everyday. Our easy design will make you want to update as often as possible.</p>
		</div>
		<div class='right-start'>
			<h1>Sign Up For Free!</h1>
			<button class="loginBtn loginBtn--facebook">Sign Up With Facebook</button>
		</br>
			<h2>Or</h2>
			<form id="sign-up-form-js">
				<input id="username-js-signup" class="username-form user-info" type="text" autocomplete="off" name="username" placeholder="Username">
				<input id="password-js-signup" class="password-form user-info password-js" type="password" autocomplete="off" name="password" placeholder="Password"> </br>			
				<button class="sign-up-button button">Sign Up</button>
			</form>
		</div>
	</div>
		`
		)
		$('.secondary-container').html('');
	})

	//handles the sign up
	$('#sign-up-form-js').submit(function (event) {
		event.preventDefault();
		let username = $('#username-js-signup').val();
		let password = $('#password-js-signup').val();
		if (username === "" || password === "") {
			alert("Username and Password required.");
		} else {
			signUp(username, password);
		}
	});

	//click to login to app
	$('#login-form-js').submit(function (event) {
		event.preventDefault();
		let username = $('#username-js-login').val();
		let password = $('#password-js-login').val();
		if (username === "" || password === "") {
			alert("Username and Password required.");
		} else {
			logIn(username, password);
		};
	});

	//click button to show all the updates
	$(document).on('click', '.show-updates-button', function (event) {
		event.preventDefault();
		let goalId = $(this).attr('val');
		showUpdatesFunction(goalId);
	})

	//click to submit an update
	$(document).on('click', '.submit-update', function (event) {
		event.preventDefault();
		let updateIndex = $(this)[0].value;
		let submitDataInfo = $(`.submit-data[value=${updateIndex}]`).val();
		if ($(`.submit-data[value=${updateIndex}]`).val() === "") {
			alert('Please tell us what you did today!');
		} else(submitData(updateIndex, submitDataInfo));
	})

	//click to delete a goal
	$(document).on('click', '.delete-button', function (event) {
		event.preventDefault();
		let deleteIndex = $(this).attr('val');
		deleteGoal(deleteIndex);
	})

	//click to create a textbox to enter a new goal
	$(document).on('click', '.new-goal-button', function (event) {
		event.preventDefault();
		if ($('.new-goal').attr('val') === 'false') {
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
			$('.new-goal').attr('val', 'true');
		} else {
			$('.new-goal').attr('val', 'false');
			$('.new-goal').html('');
		}
	})

	//Submit New Goals ON CLICK
	$(document).on('click', '.submit-new-goals', function (event) {
		event.preventDefault();
		let longTermGoal = $('.new-long-term-goal').val();
		$('.new-goal').html('');
		$('.new-goal').attr('val', 'false');
		submitNewGoal(longTermGoal);

	})

	//handles errors during login
	function handleLoginErrors() {
		alert('Username and Password does not exist. Please try again.');
	}

	//displays all goals in the DOM. More comments in code.
	function displayGoalsByUser(data) {

		for (let i = 0; i < data.length; i++) {
			//I statement to separate goals without any updates and goals with updates.
			if (data[i].userId !== undefined && data[i].updates[data[i].updates.length - 1] !== undefined) {

				$('.secondary-container').prepend(
					`
				<div class='goal-container' val=${data[i]._id}>

					<div class='goal-name'>
						<h2>${data[i].goal}<p class='last-updated' value=${data[i]._id}> Last update on ${new Date([data[i].updates[data[i].updates.length-1].date]).toLocaleDateString()}</p></h2>	
						<textarea class='submit-data form-control' value=${data[i]._id} placeholder='Tell us about your progress today!'></textarea>
						</div>
						<div class='box-buttons'>
						<button class='btn submit-update' value=${data[i]._id}>Go!</button>
						<button type="button" class="delete-button btn btn-default btn-sm" val=${data[i]._id}>
          					<span class="glyphicon glyphicon-trash"></span> <span class='trash'>Delete Goal</span> </button>
          				<button aria-expanded="false" type="button" data-toggle='collapse' data-target='#updates-collapse${data[i]._id}' class="collapse.in show-updates-button btn btn-default btn-sm" val=${data[i]._id}>
				          <span class="glyphicon glyphicon-list-alt"></span> <span class='view-updates'>View Updates</span>
								</button>
								</div>
				        <div class='show-updates collapse' id='updates-collapse${data[i]._id}' value=${data[i]._id}'>
							<ul class='updates-list' val=${data[i]._id} ></ul>				
					</div>
				</div>
				`
				);
				//adds all updates to the goal
				data[i].updates.map(update => {
					$(`.updates-list[val=${data[i]._id}]`).prepend(`<li class='updates-list-li list-group-item'>${update.update} <cite><p class='updates-date'>-${new Date(update.date).toLocaleDateString()}</p></cite></li>`)
				});
				checkDate(data);
				if (i + 1 === data.length) {
					break;
				}
			} else {
				$('.secondary-container').prepend(
					`
				<div class='goal-container' val=${data[i]._id}>
					<div class='goal-name'>
						<h2>${data[i].goal}<p class='last-updated' value=${data[i]._id}> No updates! Post an update!</p></h2>
						<textarea class='submit-data form-control' value=${data[i]._id} placeholder='Tell us about your progress today!'></textarea>
						</div>
						<div class='box-buttons'>
						<button class='btn submit-update' value=${data[i]._id}>Go!</button>
						<button type="button" class="delete-button btn btn-default btn-sm" val=${data[i]._id}>
          					<span class="glyphicon glyphicon-trash"></span> <span class='trash'>Trash</span> 
        				</button>
        				<button aria-expanded="false" type="button" data-toggle='collapse' data-target='#updates-collapse${data[i]._id}' class="collapse.in show-updates-button btn btn-default btn-sm" val=${data[i]._id}>
				          <span class="glyphicon glyphicon-list-alt"></span> <span class='view-updates'>View Updates</span>
								</button>
								</div>
								<div class='show-updates collapse' id='updates-collapse${data[i]._id}' value=${data[i]._id}'>
								
							<ul class='updates-list' val=${data[i]._id} ></ul>
					</div>
				</div>
				`
				);
				data[i].updates.map(update => {
					$(`.updates-list[val=${data[i]._id}]`).append(`<li class='list-group-item'>${update.update}</li>`)
				});
				checkDate(data);
				if (i + 1 === data.length) {
					break;
				}
			};

		}
	}

	//Sets the left border color to green if the goal has been updated on the current day.
	function checkDate(goals) {
		if (goals.length === undefined) {
			goals = [goals];
		}
		let inputDate = new Date("11/25/2017");
		let todaysDate = new Date();
		todaysDate = todaysDate.setHours(0, 0, 0, 0);
		for (let i = 0; i < goals.length; i++) {
			// let updateDate = data[i].updates[data[i].updates.length-1].date;
			try {
				if (goals[i].updates[goals[i].updates.length - 1].date !== undefined) {
					let updateDate = new Date(goals[i].updates[goals[i].updates.length - 1].date);
					if (todaysDate === updateDate.setHours(0, 0, 0, 0) && updateDate != undefined) {
						$(`.goal-container[val=${goals[i]._id}]`).css('border-left', '20px solid #32CD32');
					}
				}
			} catch (e) {}
		} // let updateDateInt = parseInt(updateDate);
	}
})
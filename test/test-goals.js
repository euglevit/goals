const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const should = chai.should();

const {GoalPost} = require('../models');
const {User} = require('../users/models');
const {app,runServer,closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

let test_token = "";
let userId=""
let goalData = [];

chai.use(chaiHttp);

function generateData() {
    return {
        goal: faker.lorem.words(),
        userId: "test",
        updates: {
        },
        shortTermGoals: {
        },
        __v: 1,
        complete: false,
        date: faker.date.past()
    };
}

function generateUpdate() {
    console.log('generating update');
    return {
        'update' : faker.lorem.words()
    }
}
function generateUserData() {
	return {
		"username": faker.lorem.word(),
        "password": faker.lorem.sentence()
    	}
}

function seedData() {
    console.info('seeding goal data');
	const data = [];

	for(let i=1; i<=10; i++){
        data.push(generateData());
        // console.log('data 1', data.push(generateData()));
    }
   
    return GoalPost.insertMany(data);
}

function tearDownDb() {
	console.warn('Deleting Database');
	return new Promise((resolve, reject) => {
		console.warn('Deleting Database');
		mongoose.connection.dropDatabase()
		.then(result => resolve(result))
		.catch(err => reject(err));
	});
}

describe('goal API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function() {
		return chai.request(app)
        .post('/api/users')
        .send({username:"test", password:"test1234"})
        .then(function(res) {
            test_token = res.body.authToken;
            userId = res.body.id;
        }).then(function(res){
            return seedData();
        });
        
	});
	afterEach(function() {
		return tearDownDb();
	});
	after(function() {
		return closeServer();
	})

	describe('GET endpoint', function() {
		
        it('should return all goals', function() {
            let res;
            return chai.request(app)
                .get('/goals')
                .set('Authorization', `Bearer ${test_token}`)           
                .then(function(_res) { 
                    res = _res;
                    res.should.have.status(200);                    
                    return GoalPost.count();
                })
                .then(function(count) {
                    res.body.should.have.lengthOf(count);

                });
        });
        it('should add a new user', function() {
            const newUser = generateUserData();
            console.log('newest user', newUser);
			return chai.request(app)
			.post('/api/users')
			.send(newUser)
			.then(function(res) {
                console.log('res5', res);
                let user = res.body;
                
				user.username.should.equal(newUser.username);
			});
		});

        // it('should add a new post', function() {
        //     const newUpdate = generateUpdate();
        //     console.log('goalDatazero', goalData[0]);
        //     // console.log('new update',newUpdate);
        //     // console.log('this is goaldata0', goalData[0]._id);
        //     return chai.request(app)
        //     .post(`/goals/${goalData[0]._id}/updates`)
        //     .set('Authorization', `Bearer ${test_token}`)
        //     .send(newUpdate)
        //     .then(function(res) {
        //         console.log('res1');
        //         let updates = res.body;
        //         updates.update.should.equal(newUpdate.username);
        //     });
        // }); 
    })

});


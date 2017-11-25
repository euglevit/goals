const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
// const cors = require('cors');

const {DATABASE_URL, PORT} = require('./config');
const {GoalPost} = require('./models');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'))
// app.use(cors);

mongoose.Promise = global.Promise;


app.get('/goals', (req, res) => {
  GoalPost
    .find()
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

app.get('/goals/:userId', (req, res) => {
  GoalPost
    .find({userId: req.params.userId})
    .then(console.log('hey'))
    .then(posts => {
      res.json(posts.map(post => post.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    });
});

app.post('/goals', (req, res) => {
  const requiredFields = ['goal'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  GoalPost
    .create({
      goal: req.body.goal,
      userId: "jane",
      complete: false,
      shortTermGoals: [
	],
	updates: []
    })
    .then(goalPost => res.status(201).json(goalPost.apiRepr()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });

});

app.post('/goals/:id/shortTermGoals', (req,res) => {
	const requiredFields = ['shortGoal'];
	for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  GoalPost
  	.findById(req.params.id)
    .then(goalPost => {
    	console.log(goalPost);
    	goalPost.shortTermGoals = (goalPost.shortTermGoals || []).concat({
	      	shortGoal: req.body.shortGoal,
			date : req.body.date,
			complete: false
		})
  		goalPost.save()
    	res.status(201).json(goalPost.apiRepr())
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });
});

app.post('/goals/:id/updates', (req,res) => {
	const requiredFields = ['update'];
	for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  GoalPost
  	.findById(req.params.id)
    .then(updatePost => {
    	console.log(req.body.update);
    		updatePost.updates = (updatePost.updates || []).concat({
    		date : req.body.date,
	      	update: req.body.update

			
		})
  		updatePost.save()
    	res.status(201).json(updatePost.apiRepr())
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });
});

app.delete('/goals/:id', (req, res) => {
  GoalPost
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

//UPDATES GOAL
app.put('/goals/:_id', (req, res) => {

  if (!(req.params._id && req.body._id && req.params._id === req.body._id)) {
  	console.log(req.params._id);
  	console.log(req.body);
  	console.log(req.body._id);

    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['goal'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });


  GoalPost
    .findByIdAndUpdate(req.params._id, {$set: {"shortTermGoals.shortGoal" : "hello hello"}}, {new: true})
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});


//UPDATES SHORT TERM GOAL
app.put('/goals/:id/shortTermGoals/:_id', (req, res) => {
  if (!(req.params._id && req.body._id && req.params._id === req.body._id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  const updated = req.body.shortGoal;

  console.log(updated);

console.log(req.params._id);
  GoalPost
  	// .find({'shortTermGoals': {$elemMatch : {'_id' : req.params._id}}})
  	.findById(req.params.id)
  	.then(longTermGoal => {
  		const shortGoals = longTermGoal.shortTermGoals;
  		shortGoals.forEach(shortTermGoal => {
  			console.log('checking', shortTermGoal._id);
  			if(shortTermGoal._id.toString() === req.params._id){

  				console.log(typeof req.params._id, typeof shortTermGoal._id, shortTermGoal._id);

  				console.log('found it!');
  				shortTermGoal.shortGoal = updated;
  			};
  		});
  		console.log(longTermGoal);
  		longTermGoal.save()
  		res.status(204).end();
  	})
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
})

//UPDATE Updates
app.put('/goals/:id/updates/:_id', (req, res) => {

	if (!(req.params._id && req.body._id && req.params._id === req.body._id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
}
  const updated = req.body.update;

  console.log(updated);

console.log(req.params._id);

	GoalPost
    .findById(req.params.id)
  	.then(longTermGoal => {
  		const updatesToGoals = longTermGoal.updates;
  		updatesToGoals.forEach(updatedGoal => {
  			console.log('checking', updatedGoal._id);
  			if(updatedGoal._id == req.params._id){

  				// console.log(typeof req.params._id, typeof shortTermGoal._id, shortTermGoal._id);

  				console.log('found it!');
  				updatedGoal.update = updated;
  			};
  		});
  		console.log(longTermGoal);
  		longTermGoal.save()
  		res.status(204).end();
  	})
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});



// app.delete('/:id', (req, res) => {
//   BlogPosts
//     .findByIdAndRemove(req.params.id)
//     .then(() => {
//       console.log(`Deleted blog post with id \`${req.params.ID}\``);
//       res.status(204).end();
//     });
// });


app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};

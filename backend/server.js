const express = require('express');
const cors = require('cors');
const { promisify } = require('util'); 

const app = express();
// mongodb connection setup
const { MongoClient } = require('mongodb');
const db_client = new MongoClient('mongodb://database:27017');

// redis connection setup
const redis = require('redis');
const cache_client = redis.createClient(6379, "cache");
const lrange_cache = promisify(cache_client.lrange).bind(cache_client);
const rpush_cache = promisify(cache_client.rpush).bind(cache_client);

async function get_users(req, res)
{
	try
	{
		console.log('get users api accessed');
		// getting user information from redis cache
		const users = await lrange_cache('users', 0, -1);
		for(let i = 0; i < users.length; i++)
		{
			users[i] = JSON.parse(users[i]);			
		}
		res.send(users);
	}
	catch(e)
	{
		console.log(e);
		res.send({message: 'error in getting users'});
	}
}

async function create_user(req, res)
{
	try
	{
		console.log('create user api accessed');
		const user = req.body;
		const db = db_client.db('test');
		// setting user information to database
		await db.collection('user').insertOne(user);
		// setting user information to redis cache
		await rpush_cache('users', JSON.stringify(user));
		res.send({message: 'new user created'});	
	}
	catch(e)
	{
		console.log(e);
		res.send({message: 'error in user creation'});
	}
}

async function main()
{
	app.use(cors());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

	await db_client.connect();
	
	// mapping url for api
	app.get('/api/user', get_users);
	app.post('/api/user', create_user);
	
	// app server is running in port 3000
	app.listen(3000, function()
	{
		console.log("App is running");
	});
}


if(require.main == module)
{
	main();
}

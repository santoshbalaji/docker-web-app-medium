const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');

const app = express();
const { MongoClient } = require('mongodb');
const db_client = new MongoClient('mongodb://localhost:27017');

const redis = require('redis');
const cache_client = redis.createClient(6379);


async function get_users(req, res)
{
	console.log('get users api accessed');
	const db = await db_client.db('test');
	let users = await db.collection('user').find({}).toArray();
	res.send(users);
}

async function create_user(req, res)
{
	console.log('create user api accessed');
	const user = req.body;
	const db = db_client.db('test');
	await db.collection('user').insertOne(user);
	res.send({message: 'new user created'});
}

async function main()
{
	app.use(cors());
	app.use(body_parser.urlencoded({extended: false}));
	app.use(body_parser.json());

	await client.connect();
	app.get('/user', get_users);
	app.post('/user', create_user);

	app.listen(3000, function()
	{
		console.log("App is running");
	});
}


if(require.main == module)
{
	main();
}

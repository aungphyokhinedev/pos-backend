"use strict";


const client1 = require("redis").createClient(process.env.REDISPORT || 6379,process.env.REDISHOST ||  "localhost");
const Redlock = require("redlock");

module.exports = new Redlock(
	// you should have one client for each independent redis node
	// or cluster
	[client1],
	{
		// the expected clock drift; for more details
		// see http://redis.io/topics/distlock
		driftFactor: 0.01, // time in ms
 
		// the max number of times Redlock will attempt
		// to lock a resource before erroring
		retryCount:  0,
 
		// the time in ms between attempts
		retryDelay:  200, // time in ms
 
		// the max time in ms randomly added to retries
		// to improve performance under high contention
		// see https://www.awsarchitectureblog.com/2015/03/backoff.html
		retryJitter:  200 // time in ms
	}
);
# hapi-workshop - Bookmark API Example

This is the main example code for the [Async Special - Hapi.js Workshop](http://asyncjs.com/building-apis-workshop/). 

PLEASE NOTE: I am still updating and adding to this example.

## Features of example

* Bookmark API with &dash; Get, Add, Update and Remove
* User API for admins with &dash;  Get, Add, Update and Remove
* Web form logon and cookie authentication for users
* Bearer token API access
* Web page templating
* Swagger auto documentation of API endpoints
* Mongodb database storage
* bcrypt to protect passwords
* Tests in mocha - unit and server.inject 


## Run
1. Download this project
2. Open console and start mongodb `$ mongod`
2. Open another console and cd into the project directory `$ cd hapi-workshop\code\bookmark-api`
3. Run `$ npm install`
4. Run `$ node app`
5. Connect to the server using `http://localhost:3005`


## Using the example
If you wish to logon and try the authentication in the example you need to create a user account in the mongod database.

## Step 1. Creating a database
Use [robomongo](http://www.robomongo.org/) to log onto your Monogodb instance. Right click the instanace name and use the `Create database` menu item to create a `bookmarks` database.

## Step 2. Creating a user account
Then use [robomongo](http://www.robomongo.org/) to create a collection called `users` in your `bookmarks` database. Copy the JSON from below into a new entry in the users collection.

    {
        "name" : "Jane Doe",
        "email" : "janedoe@gmail.com",
        "username" : "jane",
        "password" : "$2a$10$f0qEHx9LG.eDDO//MjmZlO9GCf0pwPaQ2EOPL5Vyuoyr4ESLTPsaq",
        "created" : ISODate("2014-12-05T20:15:08.804Z"),
        "modified" : ISODate("2014-12-05T20:15:08.804Z"),
        "revokeToken" : "X1wF9S4W",
        "groups" : [ 
            "user", 
            "admin"
        ]
    }
    
Once you have the above in place you should be able to log onto the system at http://localhost:3005 with the account information created. Try the admin URL
http://localhost:3005/admin
    



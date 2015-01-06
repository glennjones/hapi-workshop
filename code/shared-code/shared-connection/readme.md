# Shared connection &dash; module based singletons

During the workshop a number of people ask about patterns of database connection for Hapi. The original code I used passed a reference which was not the best design pattern. 

This example demostrates the use of nodes modules as a singleton pattern. Modules in node are not ture singletons in the purist understanding, becuase the same file referenecd from different paths you will create more than one object. Also if you use the [cluster](http://nodejs.org/api/cluster.html) feature of node then you will create more than one object. All that said you can practically use modules as singletons if your careful.

This is an example showing the use of a singleton to share a MongoDB connection across a HAPI server. It also use the singleton for the config.

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
    
Once you have the above in place you should be able to log onto the system at http://localhost:3005 with the account information created.



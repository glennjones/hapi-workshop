# hapi-workshop

This project contains the material created for [Async Special - Hapi.js Workshop &ndash; Async](http://asyncjs.com/building-apis-workshop/) on 6th Dec 2014. The examples are still been updated, but should be of use to anyone learning about [hapi](http://hapijs.com/).


## Code
### API Examples
This is a example bookmark API built with hapi. I am still updating and adding to this example.
* [bookmarks-api (full)](code/bookmarks-api)

There are also the staged builds from the workshop:
1. [bookmarks-api (routes, static assets)](code/workshop-stages/stage1)
2. [bookmarks-api (templates, handlers, database)](code/workshop-stages/stage2)
3. [bookmarks-api (plug-ins, documentation)](code/workshop-stages/stage3)


### Authentication Examples
There are 4 simple examples of the use of different authentication strategies.
* [basic](code/auth/auth-basic)
* [bearer](code/auth/auth-bearer)
* [cookie (form)](code/auth/auth-cookie)
* [mixed (bearer and basic)](code/auth/auth-mixed)


### Datebase connections
During the workshop a number of people ask about patterns of database connection for [hapi](http://hapijs.com/). So I have created two examples projects to show approaches. The shared-connection is my favoured approch, but maybe built using promises.
* [hapi-mongodb](code/shared-code/hapi-mongodb)
* [shared-connection](code/shared-code/shared-connection)


## Prerequisites for running code
I wrote a [prerequisites document](https://rawgit.com/glennjones/hapi-workshop/master/docs/prerequisites.html) on the software need to run the code and some tools that would help you build and debug the projects. If you wish to run these examples please read this first.


## Workshop notes
I started writing some workshop notes, but did not finnsh them in time for the workshop. I have kept them in the project for reference. If your looking for good tutorials try (hapi site)[http://hapijs.com/tutorials], rather than these notes.

1. [Setup Node.js server with HAPI.js](https://rawgit.com/glennjones/hapi-workshop/master/notes/section1/instructions.html)
2. [Serving static files and templates](https://rawgit.com/glennjones/hapi-workshop/master/notes/section2/instructions.html)


## TODO list
Expand on these subjects:
* ~~Share-code or singleton pattern in modules~~
* Middleware and [hapi](http://hapijs.com/)
* Export vs module.exports
* The importants of HTTPS
* Deploying app

Build examples of:
* Update to v0.8.x of hapi
* ~~Share-code or singleton pattern in modules~~
* Shared schema's across application layers
* Using events for middleware
* Locking endpoints and routes to HTTPS or HTTP
* Update whole project with promises


## This is a work in progress
If you find any issue please file here on github and I will try and fix them.

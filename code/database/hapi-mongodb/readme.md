# hapi-mongodb example

This is an example showing the use of the [hapi-mongodb](https://github.com/Marsup/hapi-mongodb) plugin to share a MongoDB connection across a HAPI server. 


## Direct use of hapi-mongodb plug-in within handler function
This pattern works well if the ```handler``` function also calls the for data from hapi-mongodb directly rather than passing that functionilty to another layer of the application. 

    // examples of direct use of hapi-mongodb plug-in
    // within the handler function
    // ------------------------------------------------------

    function addBookmark (request, reply) { 
    	var item = createBookmarkItem(request),
    	    db = request.server.plugins['hapi-mongodb'].db,
    	    collection = options.db.collection('bookmarks');
    
    	collection.insert(item, { safe: true }, function (err, doc) {
    	    renderJSON( request, reply, err, Utils.cleanDoc(doc) );
    	}); 
    }

To demostrate this, take a look at the code for **GET bookmarks** API endpoint. The MongoDB db connection is created in the ```app.js``` file using ```server.pack.register```. The reference to the db called in the ```handler.js``` file using ```request.server.plugins['hapi-mongodb'].db```.

## Indirect use of hapi-mongodb plug-in where connection is passed into model/data access layer
Within the example I also built the ```bookmark.js``` and ```user.js``` as a abstracted data access layers. When you separte out your larger applications this way ```hapi-mongodb``` may not be your best choice of proving shared connection. 

    // examples of indirect use of hapi-mongodb plug-in
    // where connection is passed into data access layer
    // ------------------------------------------------------

    function addBookmark (request, reply) { 
    	var options = {item: {}};
    
    	// pass db connect in options
    	options.db = request.server.plugins['hapi-mongodb'].db
    	options.item = createBookmarkItem(request);
    
    	Bookmarks.add( options, function( err, result ){
    		renderJSON( request, reply, err, result );
    	}); 
    }



You can see in the example that the code for **POST bookmark** and **POST user**  forwards a refrence onto the next application layer as this part of the app cannot access the ```request``` object of HAPI. This passing of the ```options.db``` reference may not be consider a clean design pattern by some people.

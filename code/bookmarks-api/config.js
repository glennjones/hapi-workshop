

module.exports = {
    'site': {
        'name': 'Bookmarks',
    },
    'environments': {
        'test': {
            'server': {
                'url': 'http://localhost:3005',
                'host': 'localhost',
                'port': 3005
            },          
            'database': {
                'url': 'mongodb://localhost:27017/bookmarks-test'
            }
        },
        'development': {
            'server': {
                'url': 'http://localhost:3005',
                'host': 'localhost',
                'port': 3005
            },          
            'database': {
                'url': 'mongodb://localhost:27017/bookmarks'
            }
        },
        'production': {
            'server': {
              'host': 'localhost',
              'port': 3005
            },
            'database': {}
        }
    }
}
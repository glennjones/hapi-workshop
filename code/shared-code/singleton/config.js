

module.exports = {
    'site': {
        'name': 'Bookmarks',
    },
    'environments': {
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
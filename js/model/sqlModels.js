module.exports = function (db, models) {
    models.user = db.define('USER', {
        id: {type: 'serial', key: true},
        name: {type: 'text', mapsTo: 'NAME'},
        email: {type:'text', mapsTo: 'EMAIL'},
        phone: {type:'text', mapsTo: 'PHONE'}
    });

    models.db = db;
};
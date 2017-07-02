module.exports = function (db, models) {
    models.user = db.define('USER', {
        id: {type: 'serial', key: true},
        name: {type: 'text', mapsTo: 'NAME'}
    });

    models.db = db;
};
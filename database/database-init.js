const RxDB = require( 'rxdb' );
RxDB.plugin( require( 'pouchdb-adapter-node-websql' ) );

const db = RxDB.create( {
    name: 'appdb',
    adapter: 'websql',
    //password: 'appdb',
    multiInstance: true
} );

module.exports = db;
/*
 **  Nuxt.js part
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

let win = null // Current window

const http = require( 'http' )
const { Nuxt, Builder } = require('nuxt')

// Import and Set Nuxt.js options
let config = require( './nuxt.config.js' )
config.dev = !(process.env.NODE_ENV === 'production')
config.rootDir = __dirname // for electron-packager

// Init Nuxt.js
const nuxt = new Nuxt( config )
const server = http.createServer( nuxt.render )

// Build only in dev mode
if ( config.dev ) {
    new Builder(nuxt).build()
        .catch( ( error ) => {
            console.error( error ) // eslint-disable-line no-console
            process.exit( 1 )
        } )
}

// Listen the server
server.listen()
const _NUXT_URL_ = `http://localhost:${server.address().port}`
console.log( `Nuxt working on ${_NUXT_URL_}` )

/*
 ** Electron app
 */
const electron = require( 'electron' )
const path = require( 'path' )
const url = require( 'url' )

const POLL_INTERVAL = 300
const pollServer = () => {
    http.get( _NUXT_URL_, ( res ) => {
        const SERVER_DOWN = res.statusCode !== 200
        SERVER_DOWN ? setTimeout( pollServer, POLL_INTERVAL ) : win.loadURL( _NUXT_URL_ )
    } )
        .on( 'error', pollServer )
}

const app = electron.app
const bw = electron.BrowserWindow

const newWin = () => {
    win = new bw( {
        width: config.electron.width || 800,
        height: config.electron.height || 600,

        webPreferences: {
            webSecurity: false
        }

    } )
    if ( !config.dev ) {
        return win.loadURL( _NUXT_URL_ )
    }
    win.loadURL( url.format( {
        pathname: path.join( __dirname, 'index.html' ),
        protocol: 'file:',
        slashes: true
    } ) )
    win.on( 'closed', () => win = null )
    pollServer()
}

app.on( 'ready', ()=>{
    /**
     * Install and activate Vue Dev Tools extension if in developer mode
     */
    if ( 'development' === process.env.NODE_ENV ) {
        const { default: installExtension, VUEJS_DEVTOOLS } = require( 'electron-devtools-installer' );
        installExtension( VUEJS_DEVTOOLS )
            .then( ( name ) => console.log( `Added Extension:  ${name}` ) )
            .catch( ( err ) => console.log( 'An error occurred: ', err ) );
    }
})

app.on( 'ready', newWin )
app.on( 'window-all-closed', () => app.quit() )
app.on( 'activate', () => win === null && newWin() )

/**
 * Starter example of how to connect to a sqlite3 database with rxdb from the main rather than a renderer process
 */
const db = require( './database/database-init' );

db.then( function ( database ) {
    console.log( 'Database ready' );
} ).catch( function ( err ) {
    console.log( 'Something went wrong trying to connect a database' );
} );

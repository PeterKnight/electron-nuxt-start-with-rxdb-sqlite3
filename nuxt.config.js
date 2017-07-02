const path = require( 'path' );

module.exports = {
    /*
     ** Electron Settings
     */
    electron: {
        width: 1024,
        height: 768
    },
    head: {
        script: [
            {
                src: path.join( __dirname, 'assets/js/database.js' )
            }
        ]
    },
    build: {
        extend ( config, { isClient } ) {
            // Extend only webpack config for client-bundle
            if ( isClient ) {
                config.target = 'electron-renderer'
            }

            config.node = {
                __filename: true,
                __dirname: true
            };

        }
    }
}

import EventModule from './structures/EventModule.js'
import mongoose from 'mongoose'

export default class MongoDB extends EventModule {
    /**
     * @param {Main} main
     */
    constructor(main) {
        super(main);

        this.register(MongoDB, {
            name: 'mongodb',
            scope: 'global'
        });
    }

    /**
     * @returns {Mongoose:NativeConnection}
     */
    get connection() {
        return mongoose.connection;
    }

    setup() {
        const config = this.config.development ? this.auth.credentials.mongodb.dev : this.auth.credentials.mongodb.prod;

        try {
            mongoose.connect(
                `mongodb://${config.auth.user}:${config.auth.password}@${config.auth.host}:${config.auth.port}/${config.auth.database}`, 
                config.options);
        } catch(e) {
            this.log.critical('MongoDB', `Could not establish connection to MongoDB: ${e}`);

            return false;
        }

        if (this.config.development) {
            mongoose.set("debug", (collectionName, method, query, doc) => {
                console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
            });
        }
        
        this.log.info('MongoDB', 'Established connection to MongoDB successfully.');

        this.emit('ready');

        return true;
    }
}

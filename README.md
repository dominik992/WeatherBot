# Weather bot service

## Run service

*Development:*
```
npm install
npm run build:watch
npm run start:dev (in new tab)
```

*Production:*
```
npm install
npm run build
npm test
npm start
```

## Commands

```
npm run build
```

Transpile source to `./build` folder
 
```
npm run build:watch
```

Transpile source to `./build` folder and `watch` for changes made to source files.

```
npm start 
```

Start the server on production

```
npm run start:dev 
```

Start the server on development with nodemon watching for file change to `./build` folder, `port 3000`.

```
npm test
```

Run tests for project.
 
 
## Environment variables

Set these environment variables prior to starting server: 

- `PORT`: Port of the server, defaults to `3000`
- `NODE_ENV` : Environment in which server is executed, ('dev'|'production').
- `DEBUG`: Name of debugging logger
- `WEATHER_API_KEY`: Open weather map api key
- `WEATHER_API_ENDPOINT`: Open weather map api endpoint
- `WEATHER_API_KEY`: Open weather api key (appId)
- `FACEBOOK_TOKEN`: Facebook page token
- `FACEBOOK_VERIFY`: Secret used for verification of facebook webhook
- `FACEBOOK_SECRET`: Facebook secret
- `LOG_LEVEL`: Logging level to use, defaults to info if not set
- `LOG_DIR`: Logging directory to use, defaults to logs/ directory (this should be set to a logging dir for production)

On _Windows_, environment variable is set with `set NODE_ENV=dev`, while on Linux and OSX it's set with  `NODE_ENV=dev`. To address this problem, we're using `cross-env` library in package.json, where environment
variables are set.


## Editor configuration and linting

Editor configuration is contained in .editorconfig file which helps developers define and maintain consistent coding styles between different editors and IDEs. See more information on [EditorConfig website](http://editorconfig.org/).

Linting is done via [eslint](http://eslint.org/) using Five's [JavaScript style guide](https://github.com/5minutes/javascript).

## Installing packages

Installing packages (either with --save or --save-dev) is locked to exact version with `.npmrc` file. Use `ncu` command to check which packages need to be updated and to update them. Run `npm test` to make sure everything is working after updating packages as it should.


## Connecting local server to Facebook messenger

To connect your local server with Facebook messenger use we recommend using `ngrok` tool.
Download and install it to your machine and then run `ngrok http <NODE_PORT>`.
Copy the https link from console and paste it as to a Facebook messenger webhook section.

## Connecting production server to Facebook messenger

Setup ssl certificate for https connections on your server. Then setup facebook webhook pointing to your server.


## Learn more

- [ECMAScript 6 features](https://github.com/lukehoban/es6features) ([pretty print](https://babeljs.io/docs/learn-es2015/))
- [Babel handbook](https://github.com/thejameskyle/babel-handbook)

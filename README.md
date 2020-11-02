# About the technologies and tools
## What is API and how it works?
An API (Application Programming Interface) is something like a messenger. It acts as an intermediate between two or more apps that need to talk to each other. In other words, it delivers your requests to the provider ( what you are requesting from them) and there Response (the things you request) to you. So it is a mechanism that allows the interaction between two applications using a set of rules.
Imagine you are in a restaurant to enjoy some meals. You have a menu on your table with a lot of choices to order and in the kitchen, there is a chef who is ready to prepare your meal. But the chef can’t come and take your order because he/she is busy with cooking in the kitchen. So the waiter will take order from you and deliver it to the kitchen, telling the chef what you order (request). And when the food (response) is ready it is delivered to you by the waiter. In here, the waiter act as an API. This example will give you a basic idea of what is an API and how it will work.

## Types of APIs?
SOAP
XML-RPC
JSON-RPC
REST

## What is Rest API and why we use it?
A REST (REpresentational State Transfer) API is an application program interface that uses HTTP requests to GET, PUT, POST and DELETE data. It is not a protocol like the other web services, instead, it is a set of architectural principles. REST suggests to create an object of the data requested by the client and send the state of the object in response to the user. REST APIs are speed and agile than other types and developers like REST because the learning curve is less steep.

## Node.js
Node.js is an open source, cross-platform runtime environment for developing server-side and networking applications. Node.js applications are written in JavaScript, and can be run within the Node.js runtime on OS X, Microsoft Windows, and Linux.

## Express
Express is a fast, assertive, essential and moderate web framework of Node.js. You can assume express as a layer built on the top of the Node.js that helps manage a server and routes. It provides a robust set of features to develop web and mobile applications.

## MongoDB
MongoDB is a document-oriented NoSQL database used for high volume data storage. MongoDB uses JSON-like documents with a schema.

## TypeScript
TypeScript is an open-source programming language developed and maintained by Microsoft. It is a superset of the JavaScript language, and adds optional static typing to the language. The goal of TypeScript is to help catch mistakes early through a type system and to make JavaScript development more efficient.

## MEAN?
In MEAN stack, the M stands for MongoDB, E for Express, A for AngularJS, and ultimately N stands for Node.js. Angular is a front-end development framework and since we are focusing on back-end I’m not going to talk about it here. MEAN stack is famous than other competitors because it covers the full web development cycle from front-end to back-end development using javascript, helps to keep the web application development much organized, resist unnecessary grunt work and have good community supports because they are open source.

# Installed
## NodeJS
https://nodejs.org/en/

## MongoDB
https://docs.mongodb.com/manual/administration/install-community/

## MongoDB locally for GUI interface
https://docs.mongodb.com/compass/master/install
or 
https://robomongo.org/

##  Use Postman to test HTTP requests
https://www.postman.com/downloads/

# Start our project
## Step 1: Install TypeScript globally 
```bash
$ npm install -g typescript ts-node
```

## Step 2: Initiate a Node project
```bash
$ mkdir api
$ cd api
$ npm init -y
```

## Step 3: Install all the dependencies
After finish this you can see ‘package-lock.json’ file created and ‘node_modules’ has been imported.
```bash
$ npm install --save @types/express express body-parser mongoose nodemon
```

## Step 4: Configure the TypeScript configuration file
We do development using typescript but since we run it on Node.js we need to convert it to javascript. So here we put our all typescript files inside a folder name api and java script files inside a folder name dist. Lets talk about this file format in the next article. Now create a file inside your project and name it as ‘tsconfig.json’ and copy and paste following.

Whenever we run typescript compiler ‘tsc’ all the typescript files inside ‘api’ folder will convert into javascript and save inside ‘dist’ folder
```bash
$ tsc
```

## Step 5: Set the scripts to run API
Inside ‘package.json’ file update main file as follow.
```bash
$ "main": "./dist/server.js"
```
Inside ‘package.json’ file under the scripts add the following scripts.
```bash
"scripts": {
    "test": "ts-node ./api/server.ts",
    "dev": "tsc && nodemon ./dist/server.js",
    "prod": "tsc && nodemon ./dist/server.js"
 },
```

So, for the development, we can run a test server by running following on your terminal
```bash
$ npm run test / npm run dev
```
For the production
```bash
$ npm run prod
```

## Step 6: Configure base configurations on app.ts
Just for now lets create another folder named ‘config’ inside the ‘api’ folder. In the next article we’ll discus more about the file format. And inside this ‘config’ folder create a file named ‘app.ts’ and copy and paste following in it. Parse incoming request bodies in a middleware before your handlers, available under the req.body property. For now we are not going to integrate mongo on this.

Then create server.ts file
And from now you can test the project by running ‘npm run dev’ and following will print in your terminal.

## License
[MIT](https://choosealicense.com/licenses/mit/)
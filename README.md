# Ford-IMS

## Description

The Inventory Management Software is a project developed for the Mobile Application Development Capstone Project 2023, sponsored by Ford Motor Company. The goal of this software is to help Ford Motor Company track their current inventory counts and forecast future production using the collected data. With this software, Ford can manage their inventory and make informed decisions about their production.

![Project Status](https://img.shields.io/badge/status-completed-brightgreen.svg)
![version](https://img.shields.io/badge/version-1.0.0--first%20release-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)


## Prerequistes

To run this project, you will need a few dependencies installed. First, you will need Node Package Manager (npm) to manage your project's dependencies. Additionally, you will need Redis, an in-memory data structure store, to handle session management. Finally, you will need Mongoose, an Object Data Modeling (ODM) library for MongoDB and Node.js.

## Run the Project on WindowsOS

1. Install Node.js and npm by downloading and running the installer from the official website: https://nodejs.org/en/download/
2. Install Redis by downloading the MSI installer from the official website: https://github.com/tporadowski/redis/releases/tag/v3.2.100
3. Add Redis to the system PATH variable:
4. Right-click on "Computer" or "This PC" in the file explorer and select "Properties"
5. Click on "Advanced system settings"
6. Click on the "Environment Variables" button
7. Under "System variables", find the "Path" variable and click on "Edit"
8. Click on "New" and add the path to the Redis executable, for example: C:\Program Files\Redis\
9. Click "OK" to close all windows
10. Open a terminal window and navigate to the project's root directory
11. Run the command "npm install" to install all the required dependencies mentioned in the package.json file
12. After the dependencies have been installed, cd into the api folder and run the command "npm run watch" to start the Nodemon server
13. Now open a second terminal and cd into the frontend folder and run the command "npm run start" to start the Angular application

## Run the Project on MacOS

1. Install Homebrew by running the following command in the terminal: 
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
2. Install Node.js and npm by running the command: brew install node
3. Install Redis by running the command: brew install redis
4. Start the Redis server by running the command: redis-server
5. Open a new terminal window and navigate to the project's root directory
6. Run the command "npm install" to install all the required dependencies mentioned in the package.json file
7. After the dependencies have been installed, cd into the api folder and run the command "npm run watch" to start the Nodemon server
8. Now open a second terminal and cd into the frontend folder and run the command "npm run start" to start the Angular application

## Run the Project on LinuxOS

1. Install Node.js and npm by running the following commands in the terminal:
2. Run the following commands
```
sudo apt-get update
```
```
sudo apt-get install nodejs
```
```
sudo apt-get install npm
```
5. Install Redis by running the command: sudo apt-get install redis-server
6. Start the Redis server by running the command: redis-server
7. Open a new terminal window and navigate to the project's root directory
8. Run the command "npm install" to install all the required dependencies mentioned in the package.json file
9. After the dependencies have been installed, cd into the api folder and run the command "npm run watch" to start the Nodemon server
10. Now open a second terminal and cd into the frontend folder and run the command "npm run start" to start the Angular application

## Credits

https://nodejs.org/en/docs/ <br/>
https://expressjs.com/en/api.html <br/>
https://docs.mongodb.com/ <br/>
https://redis.io/docs/ <br />
https://learning.postman.com/docs <br />
https://git-scm.com/doc <br />

## License

Copyright <2023>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

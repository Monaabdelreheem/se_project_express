# WTWR (What to Wear React)

**Live Website:**  
https://mona-wtwr.artitech.com/

**Backend API:**  
https://api.mona-wtwr.artitech.com/

---

## Deployment

- Frontend: https://mona-wtwr.artitech.com/
- Frontend (www): https://www.mona-wtwr.artitech.com/
- Backend API: https://api.mona-wtwr.artitech.com/
- Frontend repo: https://github.com/Monaabdelreheem/se_project_react
- Backend repo: https://github.com/Monaabdelreheem/se_project_express

## Project Pitch Video
Check out [this video](https://drive.google.com/file/d/1X0Jr1Tb7wt5OXSugp5YywhJzyz6p2m4d/view?usp=drive_link)

### 👗 WTWR (What to Wear?) Back End

This back end project focuses on building a server for the WTWR (What to Wear?) application 🌦️👕. The goal is to strengthen server side development skills, work with databases, and build a scalable API.
The server handles data storage and client requests and sets the foundation for secure user authentication and authorization in later stages 🔐.

### ⚙️ Functionality

* 🚀 Provides a RESTful API for the WTWR application

* 👤 Handles requests for users and clothing items

* 🗄️ Connects to a MongoDB database for persistent data storage

* 🛑 Implements centralized error handling and status codes

* ❓ Includes fallback handling for unknown routes

* 🔒 Prepares the server structure for future authentication and authorization

### 🛠️ Technologies and Techniques Used

* 🟢 Node.js for the server runtime environment

* ⚡ Express.js for routing and middleware

* 🍃 MongoDB for database management

* 🧩 Mongoose for schema definition and data modeling

* 🔁 REST API principles for structured endpoints

* 🚨 Centralized error handling using constants

* 🌍 Git and GitHub for version control

* ✏️ EditorConfig for consistent code formatting

### ▶️ Running the Project

`npm run start` , launches the server

`npm run dev` , launches the server with hot reload enabled 🔥

By default, the server runs on **port 3001**.
Once running, the terminal will display a message confirming that the server is up and listening for requests 🟢.




### 🔌 Sample API Endpoints

* GET /users , returns a list of users

* POST /users , creates a new user

* GET /items , returns a list of clothing items

* POST /items , adds a new clothing item

These endpoints allow the front end to interact with the database and retrieve or create data as needed.

### 🧪 Testing

Before committing your code, edit the sprint.txt file in the root folder.
The file should contain the number of the sprint you are currently working on, for example 12.

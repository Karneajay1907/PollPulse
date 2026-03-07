🗳️ PollPulse – Real-Time Polling Application
PollPulse is a full-stack MERN application that allows users to create polls, vote on polls, and view real-time results with charts.
It provides a smooth polling experience with authentication, live vote updates, poll expiration, and analytics.


🚀 Live Features
✔ User Authentication (JWT Login & Register)
✔ Create Multiple Choice Polls
✔ Real-Time Voting Results
✔ Poll Expiration Timer
✔ Duplicate Vote Prevention
✔ Poll Categories & Search
✔ Interactive Charts for Results
✔ Shareable Poll Links
✔ Responsive UI (React Bootstrap)


🛠️ Tech Stack

Frontend

React.js
React Router
React Bootstrap
Axios
Chart.js

Backend

Node.js
Express.js


Database

MongoDB

Authentication

JWT (JSON Web Token)

Real-Time Updates

Socket.io

📂 Project Structure
PollPulse
│
├── client
│ ├── public
│ └── src
│ ├── components
│ │ └── Navbar.js
│ │
│ ├── pages
│ │ ├── Login.js
│ │ ├── Register.js
│ │ ├── PollList.js
│ │ ├── PollDetails.js
│ │ ├── PollResults.js
│ │ └── CreatePoll.js
│ │
│ ├── services
│ │ └── api.js
│ │
│ ├── socket.js
│ ├── App.js
│ └── index.js
│
├── server
│ ├── controllers
│ ├── routes
│ ├── models
│ ├── middleware
│ └── server.js
│
└── README.md


⚙️ Installation & Setup
Clone the repository

git clone https://github.com/Karneajay1907/PollPulse.git

Go into the project folder

cd PollPulse


Backend Setup
cd server
npm install

Create .env

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Run backend

npm start

Server will start on

http://localhost:5000


Frontend Setup
cd client
npm install
npm start

React app will run on

http://localhost:3000


🔐 Authentication API
Register

POST /api/auth/register

Login

POST /api/auth/login


📊 Poll API
Create Poll

POST /api/polls/create

Get All Polls

GET /api/polls

Get Poll By ID

GET /api/polls/:id

Vote Poll

POST /api/polls/vote/:id


🧠 Key Functionalities
Poll Creation
Users can create polls with multiple options and expiration date.

Voting System
Users can vote once per poll (duplicate votes prevented).

Real-Time Updates
Votes update instantly using Socket.io.

Poll Expiration
Poll automatically closes after expiration time.

Poll Analytics
Results displayed with interactive charts using Chart.js.

## Application Screenshots

### Home Page
![Home](screenshots/home.png)

### Poll Page
![Poll](screenshots/poll.png)

### Voting Page
![Vote](screenshots/vote.png)



🌟 Future Improvements
User Profile Page
Poll Comments System
Dark Mode
Admin Dashboard
Advanced Poll Analytics


👨‍💻 Author
Karne Ajay Kumar

GitHub
https://github.com/Karneajay1907

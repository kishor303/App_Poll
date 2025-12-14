# Real-time Live Polling Web Application

A complete real-time polling system for classroom use with teacher and student roles, built with React, Node.js, and Socket.io.

## Features

### Teacher Features
- Create polls with custom questions and multiple options
- Start polls only when conditions are met (no active poll or all students answered)
- View live polling results with real-time charts
- Set configurable poll timer (default 60 seconds)
- Remove students from polls
- View past poll results
- Chat with students

### Student Features
- Enter unique name on first visit
- View poll questions when teacher starts a poll
- Submit answer only once per poll
- View live results after submission
- Auto-disabled submission after timer expires
- Chat with teacher and other students

### Real-time Features
- WebSocket-based real-time communication
- Synchronized timer countdown for all users
- Live results updates
- Instant poll notifications
- Chat functionality

## Technology Stack

### Frontend
- React 18
- Redux Toolkit
- Socket.io-client
- Recharts (for charts)
- Vite
- CSS Grid & Flexbox

### Backend
- Node.js
- Express.js
- Socket.io
- In-memory data store (MongoDB ready)

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── store/         # Redux store
│   │   ├── services/      # API & Socket services
│   │   └── styles/        # CSS files
│   ├── package.json
│   └── vercel.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/        # Express routes
│   │   ├── sockets/       # Socket.io handlers
│   │   ├── models/        # Data models (MongoDB ready)
│   │   └── store/         # In-memory store
│   ├── package.json
│   ├── .env.example
│   └── render.yaml
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=  # Add MongoDB URI when ready
```

5. Start the server:
```bash
npm start
# or for development
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Usage

### Teacher Access
Navigate to `http://localhost:3000/teacher`

### Student Access
Navigate to `http://localhost:3000/student`

## Socket Events

### Client to Server

- `join-room` - Join as teacher or student
- `create-poll` - Create a new poll (teacher)
- `start-poll` - Start the active poll (teacher)
- `submit-answer` - Submit answer (student)
- `end-poll` - End active poll (teacher)
- `chat-message` - Send chat message

### Server to Client

- `joined-room` - Confirmation of room join
- `poll-created` - Poll created notification
- `poll-started` - Poll started notification
- `poll-updated` - Poll results updated
- `poll-ended` - Poll ended notification
- `timer-update` - Timer countdown update
- `answer-submitted` - Answer submission confirmation
- `all-students-answered` - All students answered notification
- `student-joined` - New student joined
- `student-left` - Student left
- `chat-message-received` - Chat message received
- `error` - Error notification

## API Endpoints

### Polls
- `GET /api/polls/active` - Get active poll
- `GET /api/polls/past` - Get past polls
- `POST /api/polls` - Create poll
- `PUT /api/polls/timer` - Update timer

### Students
- `GET /api/students` - Get all students
- `DELETE /api/students/:socketId` - Remove student

### Health
- `GET /api/health` - Health check

## Deployment

### Backend (Render)

1. Push code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Environment Variables:
     - `NODE_ENV=production`
     - `PORT=5000` (or use Render's PORT)
     - `CLIENT_URL=https://your-frontend-url.vercel.app`
     - `MONGODB_URI=your-mongodb-uri` (when ready)

Alternatively, use the provided `render.yaml` for configuration.

### Frontend (Vercel)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd client
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL=https://your-backend-url.onrender.com`

Or connect your GitHub repository to Vercel for automatic deployments.

## MongoDB Integration (Future)

The codebase is prepared for MongoDB integration. To add MongoDB:

1. Install mongoose:
```bash
cd server
npm install mongoose
```

2. Update `server/src/models/Poll.js` and `server/src/models/Student.js` with Mongoose schemas
3. Replace memoryStore methods with MongoDB queries
4. Add MongoDB connection in `server/src/server.js`

## Theme

The application uses the "Modern Classroom" theme with CSS variables defined in `client/src/styles/theme.css`:

- Primary: #2563EB (Blue)
- Secondary: #22C55E (Green)
- Accent: #F59E0B (Amber)
- Danger: #EF4444 (Red)

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues and questions, please open an issue on GitHub.

"# App_Poll" 

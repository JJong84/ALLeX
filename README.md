

# ALLeX 
###     Web-based XR labs for <strong>ALL</strong> types of <strong>eX</strong>periments

**AllEx** is a web-based immersive virtual lab platform that allows users to perform various experiments in an XR environment. It is developed as part of the [**SPARCS Science Hackathon 2024**](https://event.sparcs.org/dsf24).

<p align="center">
  <a href="https://github.com/JJong84/ALLeX">
  </a>
    <a href="https://namu.wiki/w/Hello%2C%20world!">Live Demo</a>
    <a>&emsp;&emsp;</a>
    <a href="https://namu.wiki/w/Hello%2C%20world!">Video</a>
  </p>
</p>

---

## Table of Contents
1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Project Structure](#project-structure)
6. [Contributing](#contributing)
7. [License](#license)

---

## Features
- Web-based platform for performing interactive experiments.
- Real-time hand tracking and gesture recognition using `@vladmandic/human`.
- Backend powered by MySQL for managing lab setups, experiment data, and inventory.
- REST API for communication between the frontend and backend.
---

## Technology Stack

- **Frontend**: React (TypeScript)
- **Backend**: Node.js and Express for handling server-side logic, with a MySQL database for storing experiments, substances, and lab configurations.
- **Interaction**: `@vladmandic/human` for real-time hand detection and gesture recognition
- **REST API**: For communication between the frontend and backend

---

## Installation

### Prerequisites
- Node.js (version 14 or above)
- MySQL

### Clone the Repository

```bash
git clone https://github.com/JJong84/ALLeX.git
cd ALLeX
```

### Install Dependencies

#### 1. Backend (API server)
```bash
cd server
npm install
```

#### 2. Frontend (React App)
```bash
cd web
npm install
```

### Database Setup

1. Set up your MySQL server and create a database for the platform.
2. Import the provided SQL dump file (if applicable) or manually create the necessary tables:
   - **labs**: Contains lab setup details.
   - **experiments**: Stores details of experiments performed.
   - **substances**: Stores different substances used in the experiments.
   - **lab_inventory**: Manages inventory for each lab.

```sql
CREATE DATABASE alex;
USE alex;
-- Import the provided SQL file or use the following table schema examples in the project.
```

3. Update your MySQL credentials in the backend's `.env` file:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=alex
```

### Start the Backend Server

```bash
cd server
npm start
```

### Start the Frontend

```bash
cd web
npm run dev
```

---

## Usage

1. Ensure your webcam is connected, as the platform uses real-time hand tracking and interaction.
2. Open the app in your browser (usually http://localhost:3000 if running locally).
3. Teachers can create virtual labs and set up experiments, while students can join the lab, perform experiments, and interact with the system via hand gestures.
4. The system allows hand detection, substance movement, and experiment simulation in real time.

---

## Project Structure

```
AllEx/
│
├── server/                # Backend (Node.js, Express, MySQL)
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── app.js             # Main backend entry point
│
├── web/                   # Frontend (React, TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point for React app
│   ├── vite.config.ts      # Vite configuration
│   └── index.html          # Main HTML template
│
├── README.md               # Project documentation
└── package.json            # Project metadata and dependencies
```

---

## Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Open a pull request.

Please follow our coding standards and ensure your code passes all linting and testing requirements.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---


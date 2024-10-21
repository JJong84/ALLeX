![image](https://github.com/user-attachments/assets/653b251b-c991-4fe0-afe3-f0ec93d166ad)
---

<p align="center">
  <a href="https://github.com/JJong84/ALLeX">
  </a>
    <a href="https://al-le-x-fhxo.vercel.app/">Web</a>
    <a>&emsp;&emsp;</a>
    <a href="https://al-le-x-fhxo.vercel.app/">Live Demo</a>
    <a>&emsp;&emsp;</a>
    <a href="https://al-le-x-fhxo.vercel.app/">Video</a>
  
  </p>
  


</p>


###     Web-based XR labs for <strong>ALL</strong> types of <strong>eX</strong>periments

**AllEx** is a web-based immersive virtual lab platform that allows users to perform various experiments in an XR environment. It is developed as part of the [**SPARCS Science Hackathon 2024**](https://event.sparcs.org/dsf24).

![image](https://github.com/user-attachments/assets/dd872090-b090-4cae-89c8-6e19a6781bbf)


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
![그림3 (1) (1) (2) (1)](https://github.com/user-attachments/assets/3f34c5c3-002d-4e5e-b1e6-da6cbca4c68b)
![그림4](https://github.com/user-attachments/assets/d9dc0eeb-ab82-4613-9e7a-5fe214e1edce)
- Web-based platform for performing interactive experiments.
- Real-time hand tracking and gesture recognition using `@vladmandic/human`.
- Backend powered by MySQL for managing lab setups, experiment data, and inventory.
- REST API for communication between the frontend and backend.
---

## Technology Stack

- **Frontend**: React (TypeScript)
- **Backend**: Python and FastAPI for handling server-side logic, with a MySQL database for storing experiments, substances, and lab configurations.
- **Interaction**: `@vladmandic/human` for real-time hand detection and gesture recognition
- **REST API**: For communication between the frontend and backend

---

## Installation

### Prerequisites
- Python3
- MySQL

### Clone the Repository

```bash
git clone https://github.com/JJong84/ALLeX.git
cd ALLeX
```

### Install Dependencies

#### 1. Backend (API server)

```
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy pymysql
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
CREATE DATABASE allex;
USE allex;
-- Create the `labs` table
CREATE TABLE labs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lab_name VARCHAR(255) NOT NULL,
    goal VARCHAR(255) NULL
);

-- Create the `substances` table
CREATE TABLE substances (
    substance_id INT AUTO_INCREMENT PRIMARY KEY,
    substance_name VARCHAR(255) NOT NULL
);

-- Create the `lab_inventory` table
CREATE TABLE lab_inventory (
    entity_id INT AUTO_INCREMENT PRIMARY KEY,
    lab_id INT,
    substance_id INT,
    x INT,
    y INT,
    case_type VARCHAR(255),
    FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE,
    FOREIGN KEY (substance_id) REFERENCES substances(substance_id) ON DELETE CASCADE
);

-- Create the `experiments` table
CREATE TABLE experiments (
    substance_id1 INT,
    substance_id2 INT,
    color_change VARCHAR(255),
    explosion TINYINT,
    FOREIGN KEY (substance_id1) REFERENCES substances(substance_id) ON DELETE CASCADE,
    FOREIGN KEY (substance_id2) REFERENCES substances(substance_id) ON DELETE CASCADE
);
```

3. Update your MySQL credentials in the backend's `config.py` file:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=alex
```

### Start the Backend Server

```bash
cd server
uvicorn main:app --reload
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
├── server/                # Backend (python, fastapi, MySQL)
│   ├── .gitignore
│   ├── .gitkeep
│   ├── config.py
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   └── routers
│       ├── experiments.py
│       ├── inventory.py
│       ├── labs.py
│       ├── substances.py
│       └── __init__.py
└── __pycache__
    └── *.pyc        
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


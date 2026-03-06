<div align="center">

# 🧠 NLP Studio

### *Experiment. Preprocess. Predict.*

[![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Maven](https://img.shields.io/badge/Maven-3.x-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)](https://maven.apache.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

<br/>

> **NLP Studio** is a full-stack web application for experimenting with Natural Language Processing pipelines — from raw dataset upload to model training and prediction analysis, all through an intuitive, interactive UI.

<br/>

[🚀 Live Demo](https://nlp-lab-sy.vercel.app/) · [📡 API Reference](./All_Api_In_nlpLAB.txt) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

</div>

---

## 📖 Project Overview

NLP Studio provides a modular, end-to-end NLP experimentation environment. Whether you're a researcher prototyping a text classifier or a developer exploring NLP pipelines, NLP Studio gives you the tools to upload data, preprocess text, extract features, train models, and analyze predictions — all in one place.

The application follows a clean **client-server architecture**: a React + TypeScript + Vite frontend delivers a fast, interactive UI, while a Spring Boot backend handles the heavy NLP processing. The entire stack is containerized via a root-level **Dockerfile** for consistent local and production deployments.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📂 **Dataset Upload & Parsing** | Upload datasets and parse them instantly via `UploadData.tsx` |
| 🧹 **Text Preprocessing** | Clean and normalize raw text through the `preprocessing.tsx` pipeline stage |
| 🔢 **Feature Extraction & Vectorization** | Transform text into vectors via `featureExtraction.tsx` and `vectorization.tsx` |
| 🤖 **Model Selection & Prediction** | Choose and configure models through `modelSelection.tsx` |
| 📊 **Evaluation Dashboard** | Assess model performance through `evaluation.tsx` |
| 🔍 **NLP Pipeline Visualizer** | Visualize the entire pipeline flow with `nlpPipelineVisual.tsx` |
| 📖 **About NLP** | Built-in educational page explaining NLP concepts via `aboutNlp.tsx` |
| 📡 **REST API** | Well-documented API endpoints — see [`All_Api_In_nlpLAB.txt`](./All_Api_In_nlpLAB.txt) |

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React 18** — Component-based UI
- 🟦 **TypeScript** — Type-safe frontend (64% of the codebase)
- ⚡ **Vite** — Lightning-fast dev server and bundler

### Backend
- ☕ **Java 17+** — Core backend language (35% of the codebase)
- 🌱 **Spring Boot 3.x** — REST API and NLP pipeline orchestration
- 🔧 **Maven** (`pom.xml`) — Dependency management and build automation

### Infrastructure
- 🐳 **Docker** — Root-level `Dockerfile` for full-stack containerization
- 🔼 **Vercel** — Frontend hosting → [nlp-lab-sy.vercel.app](https://nlp-lab-sy.vercel.app/)
- 🖥️ **Render** — Backend hosting

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                          CLIENT                             │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │        React + TypeScript + Vite  (Vercel)          │  │
│   │                                                     │  │
│   │  Home → UploadData → Preprocessing → Vectorization  │  │
│   │       → FeatureExtraction → ModelSelection          │  │
│   │       → Evaluation → NlpPipelineVisual              │  │
│   └──────────────────────┬──────────────────────────────┘  │
└─────────────────────────-┼──────────────────────────────────┘
                           │  HTTP / REST API
                           │  (docs: All_Api_In_nlpLAB.txt)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                          SERVER                             │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │      Spring Boot / Java  (Render / Docker)          │  │
│   │                                                     │  │
│   │  config/      → CORS, app configuration             │  │
│   │  controller/  → REST endpoint handlers              │  │
│   │  dto/         → Data Transfer Objects               │  │
│   │  exception/   → Global exception handling           │  │
│   │  model/       → Domain models                       │  │
│   │  service/     → NLP business logic                  │  │
│   └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
nlp-studio/
│
├── 📁 nlpfrontend/                        # React + TypeScript + Vite frontend
│   ├── public/
│   └── src/
│       ├── api/                           # Axios/fetch API call logic
│       ├── assets/                        # Static assets (images, icons)
│       ├── App.tsx                        # Root app component & routing
│       ├── App.css                        # Global app styles
│       ├── main.tsx                       # Vite entry point
│       ├── index.css                      # Base CSS reset/styles
│       ├── Home.tsx                       # Landing/home page
│       ├── UploadData.tsx                 # Dataset upload & parsing
│       ├── preprocessing.tsx              # Text preprocessing stage
│       ├── featureExtraction.tsx          # Feature extraction stage
│       ├── vectorization.tsx              # Vectorization stage
│       ├── modelSelection.tsx             # Model selection & training
│       ├── evaluation.tsx                 # Model evaluation dashboard
│       ├── nlpPipelineVisual.tsx          # Full pipeline visualizer
│       ├── aboutNlp.tsx                   # NLP concepts explainer
│       └── aboutMe.tsx                    # Author/about page
│
├── 📁 nlpBackend/                         # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/nplbackend/
│   │   │   │   ├── config/               # CORS & app configuration
│   │   │   │   ├── controller/           # REST API controllers
│   │   │   │   ├── dto/                  # Request/response DTOs
│   │   │   │   ├── exception/            # Global exception handling
│   │   │   │   ├── model/                # Domain/entity models
│   │   │   │   ├── service/              # NLP business logic
│   │   │   │   └── NplBackendApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/java/com/example/nplbackend/
│   │       └── controller/               # Controller unit tests
│   ├── pom.xml                           # Maven dependencies
│   └── tmp_preprocess.jsh                # JShell preprocessing script
│
├── Dockerfile                            # Root-level Docker build
├── .gitignore
├── All_Api_In_nlpLAB.txt                # Complete REST API reference
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have the following installed:

- [Java 17+](https://adoptium.net/)
- [Maven 3.x](https://maven.apache.org/download.cgi)
- [Node.js 18+ & npm](https://nodejs.org/)
- [Docker](https://docs.docker.com/get-docker/) *(recommended)*

### Clone the Repository

```bash
git clone https://github.com/brutalsachin/nlp-studio.git
cd nlp-studio
```

---

## 🐳 Running with Docker *(Recommended)*

The project ships with a root-level `Dockerfile`. This is the fastest way to get up and running.

```bash
# Build the Docker image
docker build -t nlp-studio .

# Run the container
docker run -p 8080:8080 nlp-studio
```

The backend API will be available at `http://localhost:8080`.

If a `docker-compose.yml` is configured for the full stack:

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| 🖥️ Frontend | `http://localhost:5173` |
| ⚙️ Backend API | `http://localhost:8080` |

To stop:

```bash
docker-compose down
# or for a single container:
docker stop $(docker ps -q --filter ancestor=nlp-studio)
```

---

## ☕ Running Backend (Spring Boot)

> Skip this section if you are using Docker.

```bash
cd nlpBackend

# Install dependencies and build
mvn clean install

# Run the application
mvn spring-boot:run
```

The API will be available at:

```
http://localhost:8080
```

To build a standalone JAR:

```bash
mvn clean package -DskipTests
java -jar target/nlpBackend-*.jar
```

### Backend Configuration

Edit `src/main/resources/application.properties`:

```properties
server.port=8080
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
```

> 📡 See [`All_Api_In_nlpLAB.txt`](./All_Api_In_nlpLAB.txt) for the full list of REST API endpoints.

---

## ⚛️ Running Frontend (React + TypeScript + Vite)

> Skip this section if you are using Docker.

```bash
cd nlpfrontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

App available at:

```
http://localhost:5173
```

Build for production:

```bash
npm run build
```

### Frontend Environment Variables

Create a `.env` file inside `nlpfrontend/`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## 🚀 Deployment

### 🔼 Frontend → Vercel

**Live:** [https://nlp-lab-sy.vercel.app/](https://nlp-lab-sy.vercel.app/)

1. Import the repo in [Vercel](https://vercel.com/).
2. Set **Root Directory** → `nlpfrontend`.
3. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```
4. Deploy. ✅

### 🖥️ Backend → Render

1. Create a **Web Service** on [Render](https://render.com/).
2. Set **Root Directory** → `nlpBackend`.
3. **Build Command:**
   ```bash
   mvn clean package -DskipTests
   ```
4. **Start Command:**
   ```bash
   java -jar target/nlpBackend-*.jar
   ```
5. Deploy. ✅

### 🐳 Docker-based Server Deployment

```bash
# Build from the root Dockerfile
docker build -t nlp-studio .

# Run in detached mode
docker run -d -p 8080:8080 --name nlp-studio nlp-studio
```

---

## 🔮 Future Improvements

- [ ] 🧬 Support for transformer-based models (BERT, RoBERTa)
- [ ] 📊 Drag-and-drop visual pipeline builder
- [ ] 💾 Persistent project saving and session management
- [ ] 🔐 User authentication and project workspaces
- [ ] 📈 Confusion matrix and ROC curve in the evaluation dashboard
- [ ] 🌍 Multi-language NLP support
- [ ] 🔌 Plugin system for custom pipeline stages
- [ ] 📖 Swagger / OpenAPI interactive docs auto-generated from `All_Api_In_nlpLAB.txt`

---

## 👤 Author

**Sachin** · [@brutalsachin](https://github.com/brutalsachin)

[![GitHub](https://img.shields.io/badge/GitHub-@brutalsachin-181717?style=for-the-badge&logo=github)](https://github.com/brutalsachin)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Made with ❤️ and ☕ &nbsp;|&nbsp; If you found this useful, please ⭐ the repo!

</div>

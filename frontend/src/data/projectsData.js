// Project catalog grounded in the reviewed repositories.
export const PROJECTS_DATA = [
  {
    "id": "clansure",
    "title": "ClanSure",
    "tagline": "One Family. Complete Protection.",
    "category": "Full-Stack & Enterprise AI",
    "badge": "Enterprise Flagship",
    "accentColor": "#38bdf8",
    "overview": "A centralized family insurance management platform bringing existing family policies into one secure, organized hub. Manages Health, Life, Motor, Home, and Travel insurance records with automated renewals, document vaults, claims history, nominee details, and proactive alerts.",
    "challenge": "Indian families frequently miss policy renewals and struggle during claim emergencies due to scattered paper documents, lost policy numbers, and fragmented insurer portals.",
    "solution": "Engineered a centralized family protection portal connecting family members with active policies, secure document vaults, nominee distribution, claims history, and automated 30-day renewal lead tracking.",
    "technologies": [
      "ASP.NET Core 8",
      "C#",
      "React",
      "TypeScript",
      "Python FastAPI",
      "LangChain",
      "Google Gemini",
      "PostgreSQL (pgvector)",
      "Redis",
      "Docker",
      "GitHub Actions",
      "Railway"
    ],
    "highlights": [
      "Architected backend REST APIs, JWT authentication, rate limiting, and Entity Framework Core migrations.",
      "Engineered policy coverage across 5 insurance domains: Health, Life, Motor, Home, and Travel.",
      "Developed secure document vault for policy certificates, insurance e-cards, premium receipts, and ID proofs.",
      "Implemented policy score, document expiry reminders, and renewal comparison engine.",
      "Built AI RAG policy analyzer using FastAPI + LangChain to extract coverage rules and claim clauses.",
      "Automated CI/CD workflows and containerized deployments via Docker and Railway."
    ],
    "metrics": {
      "policiesTracked": "5 Categories",
      "renewalNotice": "30-Day Lead",
      "searchLatency": "< 50ms",
      "deployment": "Docker / Railway"
    },
    "liveUrl": "https://family-portal.up.railway.app/dashboard",
    "githubUrl": null
  },
  {
    "id": "gt-companion",
    "title": "GT Companion",
    "tagline": "Built by the GTs, for the GTs.",
    "category": "Full-Stack & Knowledge Sharing",
    "badge": "Enterprise Learning Hub",
    "accentColor": "#a855f7",
    "overview": "A centralized learning and knowledge-sharing platform created by Graduate Trainees for Graduate Trainees. It preserves training materials, project roadmaps, practical session insights, assignments, quizzes, and organizational learning for upcoming trainee batches.",
    "challenge": "Training curriculum and architectural lessons were scattered across chat channels and local drives, causing repeated onboarding overhead for every new engineer batch.",
    "solution": "Designed an interactive knowledge repository featuring curated tracks, session trackers with Excel export, user role management, assignments, quizzes, and an AI tutor grounded in cohort documentation.",
    "technologies": [
      "React",
      "TypeScript",
      "ASP.NET Core",
      "Python FastAPI",
      "LangChain",
      "Gemini 3.6 Flash",
      "PostgreSQL (pgvector)",
      "Redis",
      "Docker",
      "Railway"
    ],
    "highlights": [
      "Built GT Dashboard with learning tracks, session roadmap, materials, assignments, and personal notes.",
      "Created Admin Overview with draft/published session management and curriculum control.",
      "Engineered Session Tracker supporting filtering, search, record editing, and one-click Excel export.",
      "Developed User Management module with directory search, role assignment, and credential tracking.",
      "Integrated LangChain RAG pipeline with Gemini 3.6 Flash and pgvector for instant knowledge retrieval from docs."
    ],
    "metrics": {
      "modulesPreserved": "100%",
      "onboardingSpeed": "2.5x Faster",
      "exportSupport": "Excel / CSV",
      "activeTrainees": "Enterprise Wide"
    },
    "liveUrl": "https://gt-companion.up.railway.app/",
    "githubUrl": null
  },
  {
    "id": "sattam-ai",
    "title": "Sattam AI",
    "tagline": "Tamil Nadu legal knowledge, across web and mobile.",
    "category": "Academic Project · AI & Mobile",
    "badge": "Postgraduate Major Project",
    "accentColor": "#c6b8f0",
    "overview": "A full-stack legal knowledge assistant focused on Tamil Nadu acts, rules, and regulations. Built as a postgraduate final-year project at N.G.P. Arts and Science College in 2026, it combines document retrieval with chat interfaces for web and mobile.",
    "challenge": "Make a collection of Tamil Nadu legal PDFs searchable through natural-language questions across web and mobile.",
    "solution": "A FastAPI and LangChain retrieval pipeline processes legal documents into ChromaDB, using sentence-transformer embeddings and Gemini or OpenAI-compatible models. Next.js and Flutter provide the interfaces, with Clerk authentication.",
    "technologies": [
      "Next.js",
      "React",
      "TypeScript",
      "Flutter",
      "Dart",
      "Python",
      "FastAPI",
      "LangChain",
      "ChromaDB",
      "Google Gemini",
      "OpenAI",
      "Tailwind CSS",
      "Clerk",
      "Cloudflare"
    ],
    "highlights": [
      "Built web and mobile interfaces with Next.js, React, Tailwind CSS, Flutter, and Dart.",
      "Implemented legal PDF ingestion and retrieval using sentence-transformer embeddings and ChromaDB.",
      "Added document upload, processing, and web-scraping support.",
      "Integrated Clerk authentication and context-aware chat.",
      "Documented a preloaded collection of more than 50 Tamil Nadu acts and rules in the project README.",
      "Supported Gemini and OpenAI-compatible models through Cloudflare AI Gateway."
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/Pavithran26/Major-Project-SATTAM-AI-2026",
    "sourceUrl": "https://github.com/Pavithran26/Pavithran26/blob/main/README.md"
  },
  {
    "id": "srk-erp",
    "title": "SRK ERP",
    "tagline": "From coconut groves to goods receipts.",
    "category": "Business Application · Mobile ERP",
    "badge": "Coconut Business Operations",
    "accentColor": "#a6d8b9",
    "overview": "A mobile-first ERP application designed for coconut farming and trading operations. The interface brings land and lease records, employees, harvest worklogs, vehicles, storage hubs, sales, and goods received notes into one place.",
    "challenge": "Organize field work, harvest quantities, transport details, and trading records in a connected application.",
    "solution": "Built React Native and Expo screens with reusable forms and API integration, backed by Express routes that read Cloud Firestore collections and verify Firebase ID tokens.",
    "technologies": [
      "React Native",
      "TypeScript",
      "Expo",
      "Node.js",
      "Express",
      "Firebase",
      "Cloud Firestore",
      "Axios",
      "Vercel"
    ],
    "highlights": [
      "Created land and lease forms covering owners, villages, acreage, tree counts, lease dates, and amounts.",
      "Built employee and fleet screens for worker details, daily wages, vehicle capacity, and driver information.",
      "Designed harvest worklog forms with land selection, coconut and bag counts, workers, and supervisors.",
      "Created store, sales, and GRN interfaces covering locations, quantities, unit prices, transport costs, and receipt dates.",
      "Integrated Firebase email/password sign-in and bearer-token API requests, with Expo SecureStore on mobile.",
      "Implemented authenticated list APIs for seven Firestore-backed modules."
    ],
    "implementationNote": "The reviewed repository includes the app screens and authenticated read APIs. Save actions and dashboard/report endpoints are not present in the reviewed backend version.",
    "liveUrl": "https://ranjithkumars.vercel.app/",
    "githubUrl": "https://github.com/Pavithran26/SRK-ERP-app-Frontend"
  },
  {
    "id": "my-cow",
    "title": "My COW / ZyberCow",
    "tagline": "A clearer picture of every cow, calf, and milestone.",
    "category": "Mobile & Agriculture",
    "badge": "Mobile Application",
    "accentColor": "#9acdd3",
    "overview": "A dairy-herd management project with cow and calf records, pregnancy history, and monthly milestone reminders. The repositories include React Native and Flutter interfaces and a Django backend variant.",
    "challenge": "Keep animal records and pregnancy milestones organized without relying on scattered notes.",
    "solution": "Built herd screens and Firestore services for creating, updating, and deleting records, alongside date-based reminder calculations.",
    "technologies": [
      "React Native",
      "Expo",
      "Firebase",
      "Cloud Firestore",
      "Flutter",
      "Django",
      "Python"
    ],
    "highlights": [
      "Manage cow records and view a searchable herd directory.",
      "Record calving events and maintain calf records.",
      "Track injection history and calculate monthly pregnancy milestones.",
      "Use Firestore subscriptions to update the React Native herd list."
    ],
    "liveUrl": null,
    "githubUrl": null,
    "implementationNote": "The React Native app integrates directly with Firestore; a separate Django backend variant also exists. Vaccination scheduling, feeding inventory, and reporting are listed as planned in the reviewed README. Source repositories are private."
  },
  {
    "id": "product-demand-forecast",
    "title": "Product Demand Forecast",
    "tagline": "Turn order history into a view of future demand.",
    "category": "Data Science & Forecasting",
    "badge": "Forecasting Prototype",
    "accentColor": "#9acdd3",
    "overview": "A Flask application that reads historical product-demand data, prepares yearly totals, and presents ARIMA forecasts and historical charts for a selected product.",
    "challenge": "Explore how past ordering patterns can support product-demand planning.",
    "solution": "Cleaned CSV demand values, aggregated orders by year, fitted an ARIMA model, and generated plots for the web interface.",
    "technologies": [
      "Python",
      "Flask",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Statsmodels"
    ],
    "highlights": [
      "Select a product from historical order records.",
      "Clean numeric demand fields and aggregate dated observations.",
      "Fit an ARIMA model and forecast future periods.",
      "Display historical demand and forecast charts."
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/Pavithran26/ProductDemandForecast",
    "implementationNote": "An exploratory forecasting prototype. Forecast accuracy and production performance have not been validated in this portfolio review."
  },
  {
    "id": "rf-detector",
    "title": "RF Detector using IoT",
    "tagline": "From a radio signal to a remote alert.",
    "category": "IoT & Embedded Systems",
    "badge": "Hardware Project",
    "accentColor": "#9acdd3",
    "overview": "An ESP8266-based project connecting an RF receiver with Telegram alerts and remote commands. The repository includes firmware, a circuit image, and hardware documentation.",
    "challenge": "Monitor RF device events and make them visible away from the hardware.",
    "solution": "Used RCSwitch to receive device codes and a Telegram bot to report events and control alarm state.",
    "technologies": [
      "Arduino",
      "C++",
      "ESP8266",
      "Telegram"
    ],
    "highlights": [
      "Receive and match RF device codes.",
      "Send event notifications through Telegram.",
      "Support arm, disarm, status, and device-list commands.",
      "Document the circuit and required hardware."
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/Pavithran26/RF_Detector_Using_IoT",
    "implementationNote": "The firmware contains placeholder device codes and configuration. A configured hardware demonstration is needed to verify end-to-end operation."
  },
  {
    "id": "road-accident-analysis",
    "title": "Road Accident Analysis",
    "tagline": "Make patterns in road-safety data easier to see.",
    "category": "Data Analytics & BI",
    "badge": "Power BI Dashboard",
    "accentColor": "#9acdd3",
    "overview": "A Power BI dashboard exploring UK road-accident data through casualty totals, severity, vehicle types, locations, and year-on-year comparisons.",
    "challenge": "Turn a large accident dataset into a readable view of trends and contributing categories.",
    "solution": "Created dashboard views and DAX measures for current-year totals, previous-year comparisons, and year-on-year change.",
    "technologies": [
      "Power BI",
      "DAX"
    ],
    "highlights": [
      "Compare casualty and accident totals across years.",
      "Explore accident severity and vehicle categories.",
      "View monthly trends and road-type breakdowns.",
      "Explore location and day/night patterns."
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/Pavithran26/Road-Accident-Analysis_PowerBI"
  },
  {
    "id": "screen-drawing",
    "title": "ScreenDrawing",
    "tagline": "Draw in the air with your fingertip.",
    "category": "Computer Vision & Interaction",
    "badge": "Camera Demo",
    "accentColor": "#9acdd3",
    "overview": "A webcam drawing experiment that tracks hand landmarks and translates fingertip movement into strokes on a digital canvas.",
    "challenge": "Explore a touch-free drawing interface using a standard webcam.",
    "solution": "Combined MediaPipe hand tracking with OpenCV rendering, colour selection, and erase controls.",
    "technologies": [
      "Python",
      "OpenCV",
      "MediaPipe",
      "NumPy"
    ],
    "highlights": [
      "Track hand landmarks from a webcam feed.",
      "Translate index-finger movement into drawing coordinates.",
      "Select drawing colours with on-screen controls.",
      "Clear the canvas through the erase control."
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/Pavithran26/ScreenDrawing"
  },
  {
    "id": "upi-fraud-detection",
    "title": "UPI Fraud Detection",
    "tagline": "Explore the signals behind transaction risk.",
    "category": "Machine Learning & Web",
    "badge": "ML Prototype",
    "accentColor": "#9acdd3",
    "overview": "A transaction-risk prototype using a Random Forest classifier, transaction features, and a web interface for exploring risk predictions.",
    "challenge": "Present transaction-risk signals in a form that is easier to inspect.",
    "solution": "Prepared amount, time, transaction-type, and merchant-category features, then returned a risk probability and category with explanatory rules.",
    "technologies": [
      "Python",
      "Flask",
      "Scikit-learn",
      "Pandas",
      "NumPy"
    ],
    "highlights": [
      "Prepare numeric and categorical transaction features.",
      "Load a saved classifier or bootstrap a model.",
      "Return risk probabilities and HIGH, MEDIUM, or LOW categories.",
      "Provide rule-based explanations for selected risk signals."
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/Pavithran26/UPI_Fraud_Detection",
    "implementationNote": "The fallback training pipeline generates synthetic transactions and rule-based labels. This is an educational prototype, not a validated fraud-prevention service."
  },
  {
    "id": "heart-disease-prediction",
    "title": "Heart Disease Prediction",
    "tagline": "An experiment in presenting health-data predictions.",
    "category": "Academic ML & Web",
    "badge": "Academic Prototype",
    "accentColor": "#9acdd3",
    "overview": "A React and Flask prototype that accepts structured health inputs and presents predictions from a Random Forest model.",
    "challenge": "Explore an end-to-end machine-learning workflow from a web form to a model response.",
    "solution": "Built the input interface, API integration, feature-scaling workflow, and classifier training script.",
    "technologies": [
      "React",
      "Python",
      "Flask",
      "Scikit-learn",
      "Pandas"
    ],
    "highlights": [
      "Collect structured health inputs in a React form.",
      "Prepare and scale features for classification.",
      "Train a Random Forest model and serialize model artifacts.",
      "Present model output through the web interface."
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/Pavithran26/heart-disease-prediction",
    "implementationNote": "The reviewed training script generates synthetic data and rule-based targets. This is an academic demonstration and is not clinically validated."
  },
  {
    "id": "pneumonia-detection",
    "title": "Pneumonia Detection",
    "tagline": "Explore chest-image classification with transfer learning.",
    "category": "Deep Learning & Imaging",
    "badge": "Research Prototype",
    "accentColor": "#9acdd3",
    "overview": "A chest X-ray classification experiment with a DenseNet121 transfer-learning pipeline and a Streamlit image-upload interface.",
    "challenge": "Explore how image preprocessing and transfer learning fit into a classification workflow.",
    "solution": "Implemented data preparation, augmentation, classifier training callbacks, evaluation code, and image preprocessing for inference.",
    "technologies": [
      "Python",
      "TensorFlow",
      "Keras",
      "OpenCV",
      "Streamlit"
    ],
    "highlights": [
      "Prepare NORMAL and PNEUMONIA image categories.",
      "Build a DenseNet121-based binary classifier.",
      "Configure checkpoints, early stopping, and learning-rate adjustment.",
      "Provide evaluation plots and a Streamlit upload flow."
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/Pavithran26/pneumonia",
    "implementationNote": "The reviewed repository contains the script but not the required dataset or trained model. It is a research prototype, not a clinically validated tool."
  },
  {
    "id": "speech-recognition",
    "title": "Speech Recognition",
    "tagline": "From an audio file to readable text.",
    "category": "Speech & AI",
    "badge": "Model Integration Demo",
    "accentColor": "#9acdd3",
    "overview": "A speech-to-text script that processes an audio file and produces a transcription using a pretrained Wav2Vec2 model.",
    "challenge": "Connect audio loading, model inference, and text decoding in a compact workflow.",
    "solution": "Resampled audio to 16 kHz, prepared model inputs, ran Wav2Vec2 inference, and decoded the predicted tokens.",
    "technologies": [
      "Python",
      "PyTorch",
      "Hugging Face",
      "Librosa"
    ],
    "highlights": [
      "Load an audio file with Librosa.",
      "Resample audio to the model input rate.",
      "Run pretrained Wav2Vec2 inference with PyTorch.",
      "Decode model outputs into a transcript."
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/Pavithran26/Automatic-speech-recognition-ASR-",
    "implementationNote": "Uses the pretrained facebook/wav2vec2-base-960h model. The repository does not demonstrate training a speech model from scratch."
  },
  {
    "id": "save-water-game",
    "title": "Save Water Game",
    "tagline": "Catch the drops. Keep the water flowing.",
    "category": "Games & Creative Coding",
    "badge": "Pygame Mini-game",
    "accentColor": "#9acdd3",
    "overview": "A water-conservation-themed mini-game with a movable tank, falling water drops, scoring, health, and sound effects.",
    "challenge": "Build a simple interactive game around collecting water and avoiding waste.",
    "solution": "Used a Pygame loop to handle keyboard movement, falling objects, collisions, scoring, and audio feedback.",
    "technologies": [
      "Python",
      "Pygame"
    ],
    "highlights": [
      "Move the tank with keyboard controls.",
      "Catch falling water and increase the score.",
      "Lose health when drops are missed.",
      "Play background audio and collision feedback."
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/Pavithran26/SaveWaterGame"
  },
  {
    "id": "web-scraper",
    "title": "Web Scraper App",
    "tagline": "Explore the information inside a webpage.",
    "category": "Python & Data Tools",
    "badge": "Utility Application",
    "accentColor": "#9acdd3",
    "overview": "A Streamlit utility for inspecting webpage content, including paragraphs, headings, links, tables, and images.",
    "challenge": "Make common webpage-extraction tasks accessible through a simple interface.",
    "solution": "Fetched page HTML, parsed it with Beautiful Soup, and displayed results through Streamlit tables and content views.",
    "technologies": [
      "Python",
      "Streamlit",
      "Beautiful Soup",
      "Pandas"
    ],
    "highlights": [
      "Extract paragraphs and heading structure.",
      "Separate internal and external links.",
      "Parse HTML tables into data frames.",
      "Preview discovered images and raw HTML."
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/Pavithran26/web_Scrapper_App"
  },
  {
    "id": "healthsurance",
    "title": "HealthSurance",
    "tagline": "An insurance experience, from plans to claims.",
    "category": "Frontend & Insurance UX",
    "badge": "Frontend Prototype",
    "accentColor": "#9acdd3",
    "overview": "A healthcare-insurance frontend with plan pages, authentication screens, claims forms, and dashboards for different user roles.",
    "challenge": "Organize a multi-page insurance experience with consistent navigation and forms.",
    "solution": "Built responsive HTML, CSS, and JavaScript pages with shared styles and demo interaction flows.",
    "technologies": [
      "HTML5",
      "CSS3",
      "JavaScript"
    ],
    "highlights": [
      "Explore insurance plans, doctors, and hospital pages.",
      "Navigate login, registration, OTP, and password-reset screens.",
      "Use claims forms with multi-file selection.",
      "View user, admin, and agent dashboard interfaces."
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/Pavithran26/HealthSurance",
    "implementationNote": "Authentication and role-based access use frontend demo/mock logic. This is a UI prototype, not a production insurance backend."
  }
];

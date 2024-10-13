# Port Downtime and Freight Data Prediction

This project is designed to predict the downtime of ports and forecast freight data using AI-driven models. The solution leverages TensorFlow with a Django backend to analyze data from global ports, aimed at enhancing port resilience and efficiency. It is built for PSA Code Sprint 2024, in response to the theme of "Resilient Port Operations Globally," to address real-world challenges in global trade by predicting port downtime and freight patterns.

## Features
- **AI Model**: Utilizes TensorFlow to predict port downtime and freight delays based on historical data.
- **React Frontend**: Interactive dashboard for visualizing predictions and data insights.
- **Django Backend**: Manages data processing and communicates with the AI model.
- **API Integration**: Supports real-time data inputs for dynamic prediction updates.

## Problem Context

PSA aims to create more resilient port operations globally. Given the challenges of uncertainty in global trade, this project helps PSA optimize port operations by predicting downtime, allowing for strategic planning in global supply chains. This project contributes to PSA's broader sustainability goals, helping improve efficiency while reducing carbon emissions.

## Installation and Setup

### Prerequisites
Before running the project, ensure the following are installed on your system:
- **Python 3.9+**
- **Node.js and npm**
- **TensorFlow**
- **Django**
- **React**

### Backend (Django + TensorFlow)
1. **Clone the repository**:
```bash
git clone <repository_url>
cd <repository_folder>
```
2. Set up a virtual environment:

```bash
python -m venv env
source env/bin/activate  # For Windows: env\Scripts\activate
```
3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Apply migrations:
```bash
python manage.py migrate
```

5. Start the Django server:
```bash
python manage.py runserver
```

6. Navigate to the frontend directory:
```bash
cd "react src"
```

7. Install dependencies:
```bash
npm install
```

8. Start the React app:
```bash
npm start
```

### Running the TensorFlow Model
Ensure the TensorFlow model is set up in the backend.
To run the AI model predictions:
```bash
python manage.py runserver
```

## Accessing the App
Once both servers are running, you can access the project at http://localhost:3000 (for the frontend). The backend API will be available at http://localhost:8000.

## Usage
1. On the home page, you have the option to view the different ports and choose the country's port and freight you would like to analyze.
2. Load port and freight data into the system through the Django admin interface or via API.
3. The AI model will predict downtime based on the sample input data that we produced.
4. Results will be visualized in the React dashboard, allowing you to monitor port performance and anticipate disruptions.

## Contributions
Feel free to contribute by creating pull requests or submitting issues on GitHub.

Contact
For further information or queries, contact the project team at:
1. Esvaran Arun Selvakumaran - esvar2004@gmail.com
2. Kalaiselvan Shanmugapriyan - priyanmartian@gmail.com
3. Rudra Prasadh Ganesh - grudraprasadh@gmail.com
4. Tejeswara Nehru - tejeswara.rajani@gmail.com

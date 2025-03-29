# CareerGuideAI - Career Path Recommendation System

![CareerGuideAI Logo](https://img.shields.io/badge/CareerGuideAI-Professional%20Career%20Guidance-4361ee)

CareerGuideAI is a modern, AI-powered career recommendation system that helps users navigate the complex landscape of career choices by analyzing their skills, education, and interests to suggest suitable career options. The system provides real-time industry insights, skill gap analysis, and learning resources to guide users toward fulfilling careers with competitive compensation in Indian Rupees (INR).

## ✨ Features

- **🔮 Personalized Career Recommendations**: Get tailored career suggestions based on your unique profile
- **💬 AI Chatbot Assistant**: Engage with an AI-powered chatbot for real-time career guidance
- **📊 Skill Gap Analysis**: Identify the skills you need to develop for your desired career path
- **📈 Industry Insights**: Access up-to-date information about job trends and market demands
- **📚 Learning Resources**: Discover curated resources to help you acquire necessary skills
- **💰 INR Compensation**: View salary information in Indian Rupees for accurate financial planning
- **🔄 Career Comparison**: Compare different career paths to make informed decisions

## 🛠️ Technologies Used

- **HTML5**: For structuring the web application
- **CSS3**: For modern styling and responsive design
- **JavaScript**: For client-side functionality and animations
- **Gemini API**: For AI-powered recommendations and chatbot capabilities
- **Font Awesome**: For professional iconography
- **Local Storage API**: For saving user preferences

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A Gemini API key (for AI functionality)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd carrier-path-webdev
   ```

2. Open the `index.html` file in a web browser to view the application.

3. Get a Gemini API key:

   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create or sign in to your Google account
   - Generate an API key
   - Copy the API key

4. Configure the API key:

   - Open the `js/script.js` file
   - Replace `'YOUR_GEMINI_API_KEY'` with your actual Gemini API key:
     ```javascript
     const GEMINI_API_KEY = "your-actual-api-key";
     ```

5. Refresh the page in your browser to start using the application with the Gemini API.

## 💡 Usage

1. Click on the "Start Assessment" button on the homepage.
2. Fill out the career assessment form with your education, skills, interests, and experience.
3. Submit the form to receive personalized career recommendations with salary information in INR.
4. View detailed information about each recommended career, including required skills, growth potential, and learning resources.
5. Click on "Learn More" for any career to get additional information through the AI chatbot.
6. Use the "Compare" feature to compare different career options.
7. Access the AI chatbot directly by clicking the chat icon in the bottom right corner for personalized guidance.

## 📁 Project Structure

```
carrier-path-webdev/
│
├── index.html                # Main HTML file with user interface
├── css/
│   └── styles.css            # Comprehensive stylesheet for modern UI
├── js/
│   └── script.js             # JavaScript functionality with Gemini API integration
├── images/
│   ├── career-path.svg       # Career path illustration
│   └── about-us.svg          # About us illustration
└── README.md                 # Project documentation
```

## 📝 Notes for Developers

- The application uses client-side storage (localStorage) to save user profile data and preferences.
- Salary information is displayed in Indian Rupees (INR) using a conversion rate from USD.
- Mock data is provided as a fallback when the API fails or for testing purposes.
- The website is fully responsive and works on mobile, tablet, and desktop devices.
- Modern UI features include animations, glassmorphism effects, and intuitive interactions.
- For production deployment, consider implementing server-side storage for user data.

## 🧠 AI Features

- **Career Recommendations**: The Gemini API analyzes user profiles to suggest personalized career paths.
- **Skill Analysis**: Identifies key skills required for each career and highlights skill gaps.
- **Salary Predictions**: Provides realistic salary ranges in INR based on current market data.
- **Conversational AI**: The chatbot provides natural language responses to career-related questions.
- **Learning Pathway**: Suggests customized learning resources based on user's current skills and career goals.

## 📱 Responsive Design

The application is designed to work seamlessly across different devices:

- **Desktop**: Full-featured experience with advanced visualizations
- **Tablet**: Optimized layout for medium-sized screens
- **Mobile**: Streamlined interface for on-the-go career exploration

## 🔮 Future Enhancements

- **Career Path Visualization**: Interactive career progression maps
- **Industry-Specific Insights**: Detailed information about specific industry sectors
- **Networking Suggestions**: AI-powered recommendations for professional networking
- **Interview Preparation**: Practice questions and tips for specific career paths
- **Resume Builder**: AI-assisted resume creation tailored to specific career paths

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgements

- [Google's Gemini API](https://ai.google.dev/docs/gemini_api_overview) for AI capabilities
- [Font Awesome](https://fontawesome.com/) for icons
- [Poppins Font](https://fonts.google.com/specimen/Poppins) for typography

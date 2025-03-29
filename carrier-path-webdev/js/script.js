// Gemini API Key - Replace with your actual API key
const GEMINI_API_KEY = 'AIzaSyAQYqDoLrOFOmQwSkndVD7EFOPftGNMhqU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Constants
const USD_TO_INR_RATE = 83.5; // Approximate conversion rate from USD to INR

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Assessment
    const startAssessmentBtn = document.getElementById('startAssessment');
    const assessmentSection = document.getElementById('assessment');
    const userProfileForm = document.getElementById('userProfileForm');
    const recommendationsSection = document.getElementById('recommendations');
    const recommendationsContainer = document.getElementById('recommendationsContainer');
    
    // Chatbot
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const closeBtn = document.querySelector('.close-btn');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const userInput = document.getElementById('userInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    
    // Contact form
    const contactForm = document.getElementById('contactForm');

    // Initialize
    init();

    function init() {
        // Add event listeners
        addEventListeners();
        
        // Load any saved data if exists
        loadSavedData();
        
        // Add scroll animations
        addScrollAnimations();
        
        // Initialize the typing effect for the hero section
        initTypingEffect();
    }

    function addEventListeners() {
        // Navigation active link
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Start Assessment button
        if (startAssessmentBtn) {
            startAssessmentBtn.addEventListener('click', showAssessment);
        }
        
        // User Profile Form
        if (userProfileForm) {
            userProfileForm.addEventListener('submit', handleProfileSubmit);
        }
        
        // Chatbot toggle
        if (chatbotToggle) {
            chatbotToggle.addEventListener('click', toggleChatbot);
        }
        
        // Close chatbot
        if (closeBtn) {
            closeBtn.addEventListener('click', toggleChatbot);
        }
        
        // Send message
        if (sendMessageBtn) {
            sendMessageBtn.addEventListener('click', sendMessage);
        }
        
        // Send message on Enter
        if (userInput) {
            userInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
        
        // Contact form
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactSubmit);
        }
        
        // Add sticky header effect
        window.addEventListener('scroll', handleScroll);
    }

    function loadSavedData() {
        // Load any saved user data from localStorage
        const savedUserData = localStorage.getItem('userProfileData');
        if (savedUserData) {
            const userData = JSON.parse(savedUserData);
            // Could pre-fill form or show past recommendations
        }
    }

    function showAssessment() {
        window.scrollTo({
            top: assessmentSection.offsetTop - 100,
            behavior: 'smooth'
        });
        assessmentSection.classList.remove('hidden');
        
        // Add animation effect
        assessmentSection.style.animation = 'fadeIn 0.5s ease forwards';
    }

    function handleScroll() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    function addScrollAnimations() {
        const fadeElements = document.querySelectorAll('.feature-card, .about-text p, .about-image');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-element');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        fadeElements.forEach(element => {
            element.classList.add('fade-element');
            observer.observe(element);
        });
    }

    function initTypingEffect() {
        const heroTitle = document.querySelector('.hero-content h1');
        if (!heroTitle) return;
        
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '3px solid var(--primary-color)';
        
        let i = 0;
        const typingSpeed = 50; // milliseconds
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, typingSpeed);
            } else {
                heroTitle.style.borderRight = 'none';
            }
        }
        
        // Start the typing effect after a short delay
        setTimeout(typeWriter, 500);
    }

    async function handleProfileSubmit(e) {
        e.preventDefault();
        
        // Show loading animation
        showLoadingState(true);
        
        // Get form data
        const formData = new FormData(userProfileForm);
        const userData = {
            education: document.getElementById('education').value,
            field: document.getElementById('field').value,
            skills: Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(el => el.id),
            interests: document.getElementById('interests').value,
            experience: document.getElementById('experience').value,
            preferredCurrency: 'INR' // Set to INR by default
        };
        
        // Save to localStorage
        localStorage.setItem('userProfileData', JSON.stringify(userData));
        
        try {
            // Get career recommendations from Gemini API
            const recommendations = await getCareerRecommendations(userData);
            
            // Display recommendations
            displayRecommendations(recommendations);
            
            // Scroll to recommendations
            window.scrollTo({
                top: recommendationsSection.offsetTop - 100,
                behavior: 'smooth'
            });
        } catch (error) {
            console.error('Error getting recommendations:', error);
            showNotification('error', 'Sorry, there was an error processing your request. Please try again later.');
        } finally {
            // Hide loading animation
            showLoadingState(false);
        }
    }

    function showLoadingState(isLoading) {
        const submitBtn = userProfileForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        
        if (isLoading) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            // Add loading overlay
            const overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-cog fa-spin"></i>
                    <p>Finding your ideal career paths...</p>
                </div>
            `;
            assessmentSection.appendChild(overlay);
        } else {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            
            // Remove loading overlay
            const overlay = document.querySelector('.loading-overlay');
            if (overlay) {
                overlay.classList.add('fade-out');
                setTimeout(() => {
                    overlay.remove();
                }, 500);
            }
        }
    }

    function showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}-notification`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                <p>${message}</p>
            </div>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Close button
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }

    async function getCareerRecommendations(userData) {
        // Construct prompt for Gemini API
        const prompt = `
            You are a career counselor AI. Based on the user's profile below, suggest 3-5 suitable career paths.
            For each career path, provide:
            1. Job title
            2. Brief description of the role
            3. Required skills and qualifications
            4. Growth potential
            5. Estimated salary range in USD (which will be converted to INR)
            6. Learning resources to develop necessary skills
            
            User Profile:
            - Education Level: ${userData.education}
            - Field of Study: ${userData.field}
            - Technical Skills: ${userData.skills.join(', ')}
            - Career Interests: ${userData.interests}
            - Years of Experience: ${userData.experience}
            
            Format the response as JSON with the following structure:
            {
                "careers": [
                    {
                        "title": "Job Title",
                        "description": "Brief description of the role",
                        "requiredSkills": ["Skill 1", "Skill 2", "Skill 3"],
                        "growthPotential": "Description of career growth potential",
                        "salaryRangeUSD": "Estimated salary range in USD",
                        "learningResources": [
                            {"name": "Resource Name", "url": "Resource URL", "type": "Course/Book/Tool"}
                        ]
                    }
                ]
            }
        `;

        // Make request to Gemini API
        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 2048,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            
            // Extract and parse the JSON response
            const rawText = data.candidates[0].content.parts[0].text;
            
            // Find JSON part in the response
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Could not parse JSON response from API');
            }
            
            const parsedData = JSON.parse(jsonMatch[0]);
            
            // Convert salary ranges to INR
            if (parsedData.careers) {
                parsedData.careers.forEach(career => {
                    if (career.salaryRangeUSD) {
                        career.salaryRangeINR = convertSalaryToINR(career.salaryRangeUSD);
                    }
                });
            }
            
            return parsedData;
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            
            // Return mock data for testing or when API fails
            return getMockRecommendations();
        }
    }

    function convertSalaryToINR(salaryRangeUSD) {
        // Extract numbers from string like "$85,000 - $150,000"
        const numbers = salaryRangeUSD.match(/\d[\d,]*/g);
        if (!numbers || numbers.length < 2) {
            return "Salary information unavailable";
        }
        
        // Remove commas and convert to numbers
        const lowerBound = parseInt(numbers[0].replace(/,/g, ''));
        const upperBound = parseInt(numbers[1].replace(/,/g, ''));
        
        // Convert to INR
        const lowerBoundINR = Math.round(lowerBound * USD_TO_INR_RATE);
        const upperBoundINR = Math.round(upperBound * USD_TO_INR_RATE);
        
        // Format with commas for thousands
        return `₹${formatNumberWithCommas(lowerBoundINR)} - ₹${formatNumberWithCommas(upperBoundINR)} per annum`;
    }

    function formatNumberWithCommas(number) {
        // Indian number format (lakhs and crores)
        let str = number.toString();
        let lastThree = str.substring(str.length - 3);
        let otherNumbers = str.substring(0, str.length - 3);
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        
        // Add commas for thousands
        let formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
        return formatted;
    }

    function getMockRecommendations() {
        // Mock data for testing or fallback
        const mockData = {
            "careers": [
                {
                    "title": "Data Scientist",
                    "description": "Analyze complex data sets to identify patterns and insights that drive business decisions.",
                    "requiredSkills": ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
                    "growthPotential": "High demand across industries with opportunities to advance to senior roles or specialize in specific domains.",
                    "salaryRangeUSD": "$85,000 - $150,000",
                    "learningResources": [
                        {"name": "Coursera - Data Science Specialization", "url": "https://www.coursera.org/specializations/data-science", "type": "Course"},
                        {"name": "Python for Data Analysis", "url": "https://www.amazon.com/Python-Data-Analysis-Wrangling-IPython/dp/1491957662", "type": "Book"},
                        {"name": "DataCamp", "url": "https://www.datacamp.com/", "type": "Platform"}
                    ]
                },
                {
                    "title": "UX/UI Designer",
                    "description": "Design user interfaces and experiences for digital products focused on usability and aesthetics.",
                    "requiredSkills": ["Figma", "User Research", "Wireframing", "Prototyping", "Visual Design"],
                    "growthPotential": "Growing field with paths to UX leadership, product management, or specialized design roles.",
                    "salaryRangeUSD": "$70,000 - $120,000",
                    "learningResources": [
                        {"name": "Interaction Design Foundation", "url": "https://www.interaction-design.org/", "type": "Course"},
                        {"name": "Don't Make Me Think", "url": "https://www.amazon.com/Dont-Make-Think-Revisited-Usability/dp/0321965515", "type": "Book"},
                        {"name": "DesignLab", "url": "https://designlab.com/", "type": "Platform"}
                    ]
                },
                {
                    "title": "Software Engineer",
                    "description": "Design, develop, and maintain software applications and systems.",
                    "requiredSkills": ["JavaScript", "Python", "Git", "Data Structures", "Algorithms"],
                    "growthPotential": "Excellent growth opportunities with paths to senior engineer, architect, or engineering management.",
                    "salaryRangeUSD": "$80,000 - $160,000",
                    "learningResources": [
                        {"name": "freeCodeCamp", "url": "https://www.freecodecamp.org/", "type": "Course"},
                        {"name": "Clean Code", "url": "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882", "type": "Book"},
                        {"name": "LeetCode", "url": "https://leetcode.com/", "type": "Practice Platform"}
                    ]
                },
                {
                    "title": "AI/ML Engineer",
                    "description": "Develop and implement artificial intelligence and machine learning models to solve complex problems.",
                    "requiredSkills": ["Python", "TensorFlow/PyTorch", "Deep Learning", "Mathematics", "Natural Language Processing"],
                    "growthPotential": "Rapidly growing field with high demand across industries and opportunities for research and specialized roles.",
                    "salaryRangeUSD": "$100,000 - $180,000",
                    "learningResources": [
                        {"name": "Deep Learning Specialization", "url": "https://www.coursera.org/specializations/deep-learning", "type": "Course"},
                        {"name": "Hands-On Machine Learning", "url": "https://www.amazon.com/Hands-Machine-Learning-Scikit-Learn-TensorFlow/dp/1492032646", "type": "Book"},
                        {"name": "Kaggle", "url": "https://www.kaggle.com/", "type": "Practice Platform"}
                    ]
                }
            ]
        };
        
        // Add INR salary conversions
        mockData.careers.forEach(career => {
            career.salaryRangeINR = convertSalaryToINR(career.salaryRangeUSD);
        });
        
        return mockData;
    }

    function displayRecommendations(data) {
        // Show recommendations section
        recommendationsSection.classList.remove('hidden');
        recommendationsSection.style.animation = 'fadeIn 0.5s ease forwards';
        
        // Clear previous recommendations
        recommendationsContainer.innerHTML = '';
        
        // Add each career recommendation with animation delay
        data.careers.forEach((career, index) => {
            const careerCard = document.createElement('div');
            careerCard.className = 'career-card';
            careerCard.style.animationDelay = `${index * 0.2}s`;
            
            const skillsList = career.requiredSkills.map(skill => `<li>${skill}</li>`).join('');
            const resourcesList = career.learningResources.map(resource => 
                `<li><a href="${resource.url}" target="_blank">${resource.name} <span class="resource-type">${resource.type}</span></a></li>`
            ).join('');
            
            careerCard.innerHTML = `
                <div class="career-card-header">
                    <h3>${career.title}</h3>
                    <p>${career.salaryRangeINR}</p>
                </div>
                <div class="career-card-body">
                    <div class="career-detail">
                        <h4>Description</h4>
                        <p>${career.description}</p>
                    </div>
                    <div class="career-detail">
                        <h4>Required Skills</h4>
                        <ul class="skills-list">
                            ${skillsList}
                        </ul>
                    </div>
                    <div class="career-detail">
                        <h4>Growth Potential</h4>
                        <p>${career.growthPotential}</p>
                    </div>
                    <div class="career-detail">
                        <h4>Learning Resources</h4>
                        <ul class="resources-list">
                            ${resourcesList}
                        </ul>
                    </div>
                </div>
                <div class="career-card-actions">
                    <button class="action-btn" data-career="${career.title}">
                        <i class="fas fa-info-circle"></i> Learn More
                    </button>
                    <button class="compare-btn" data-career="${career.title}">
                        <i class="fas fa-balance-scale"></i> Compare
                    </button>
                </div>
            `;
            
            recommendationsContainer.appendChild(careerCard);
        });
        
        // Add animation class
        const careerCards = document.querySelectorAll('.career-card');
        careerCards.forEach(card => {
            card.classList.add('fade-in-card');
        });
        
        // Add event listeners to action buttons
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const careerTitle = this.getAttribute('data-career');
                // Open chatbot with pre-filled question about this career
                toggleChatbot();
                userInput.value = `Tell me more about becoming a ${careerTitle}`;
                sendMessage();
            });
        });
        
        // Add event listeners to compare buttons (future feature)
        const compareButtons = document.querySelectorAll('.compare-btn');
        compareButtons.forEach(button => {
            button.addEventListener('click', function() {
                const careerTitle = this.getAttribute('data-career');
                showNotification('info', `Career comparison feature for ${careerTitle} coming soon!`);
            });
        });
        
        // Create course recommendations
        data.careers.forEach(career => {
            career.learningResources.forEach((resource, index) => {
                // Create a custom event with course data
                const courseEvent = new CustomEvent('courseRecommended', {
                    detail: {
                        id: `${career.title.toLowerCase().replace(/\s+/g, '-')}-${index}`,
                        title: resource.name,
                        description: `${resource.type} for ${career.title}`,
                        progress: 0,
                        modules: [
                            { title: 'Introduction', duration: '1 hour' },
                            { title: 'Core Concepts', duration: '2 hours' },
                            { title: 'Advanced Topics', duration: '2 hours' },
                            { title: 'Practical Projects', duration: '3 hours' }
                        ],
                        quizzes: [
                            {
                                question: 'What is the main focus of this course?',
                                options: [
                                    'Web Development',
                                    'Data Science',
                                    'Machine Learning',
                                    'Cloud Computing'
                                ],
                                correctAnswer: 0
                            },
                            {
                                question: 'Which skill is most important for this role?',
                                options: career.requiredSkills.map(skill => skill),
                                correctAnswer: 0
                            }
                        ]
                    }
                });
                
                // Dispatch the event
                recommendationsContainer.dispatchEvent(courseEvent);
            });
        });
    }

    function toggleChatbot() {
        chatbotContainer.classList.toggle('hidden');
        
        // Reset typing status when opening
        if (!chatbotContainer.classList.contains('hidden')) {
            userInput.focus();
        }
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        
        if (!message) return;
        
        // Display user message
        addMessage(message, 'user');
        
        // Clear input
        userInput.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot-message typing-indicator';
        typingIndicator.innerHTML = '<p>Typing</p>';
        chatbotMessages.appendChild(typingIndicator);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        try {
            // Get response from Gemini API
            const response = await getChatbotResponse(message);
            
            // Remove typing indicator
            chatbotMessages.removeChild(typingIndicator);
            
            // Display bot response
            addMessage(response, 'bot');
        } catch (error) {
            console.error('Error getting chatbot response:', error);
            
            // Remove typing indicator
            chatbotMessages.removeChild(typingIndicator);
            
            // Display error message
            addMessage('Sorry, I encountered an error. Please try again later.', 'bot');
        }
    }

    async function getChatbotResponse(message) {
        // Construct prompt for Gemini API
        const prompt = `
            You are a career guidance assistant chatbot. Provide helpful, concise advice about careers, job searches, skill development, 
            and professional growth. The user is asking about: "${message}"
            
            Keep your response under 150 words, friendly, and focused on actionable advice. 
            If the user asks about a specific career, include information about required skills, education path, and job prospects.
            If mentioning salary, please provide values in Indian Rupees (INR).
        `;

        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.4,
                        maxOutputTokens: 500,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error calling Gemini API for chatbot:', error);
            return "I'm here to help with career guidance! What specific questions do you have about career paths, skill development, or job searching? If you're looking for salary information, I can provide estimates in INR.";
        }
    }

    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        // Process message to add links and formatting
        const formattedMessage = formatMessage(message);
        messageElement.innerHTML = `<p>${formattedMessage}</p>`;
        
        chatbotMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function formatMessage(message) {
        // Convert URLs to hyperlinks
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        let formattedMessage = message.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`);
        
        // Format INR currency
        const inrRegex = /\b(\d+,?\d*)\s*(?:INR|₹|Rs\.?|Rupees)\b|\b(?:INR|₹|Rs\.?|Rupees)\s*(\d+,?\d*)\b/gi;
        formattedMessage = formattedMessage.replace(inrRegex, (match, p1, p2) => {
            const value = p1 || p2;
            return `<strong>₹${value}</strong>`;
        });
        
        // Convert asterisks to bold text
        formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedMessage = formattedMessage.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        return formattedMessage;
    }

    function handleContactSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send data to a server
        // For now, just show a success message
        showNotification('success', `Thank you, ${name}! Your message has been sent.`);
        
        // Reset form
        contactForm.reset();
    }
});

// Helper functions
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

// Add CSS for dynamic elements
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .loading-spinner {
            text-align: center;
            padding: 2rem;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .loading-spinner i {
            font-size: 3rem;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
        }
        
        .loading-spinner p {
            font-size: 1.2rem;
            color: var(--dark-color);
        }
        
        .fade-out {
            animation: fadeOut 0.3s ease forwards;
        }
        
        .notification {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
            max-width: 400px;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .notification i {
            font-size: 1.5rem;
        }
        
        .success-notification i {
            color: var(--success-color);
        }
        
        .error-notification i {
            color: var(--error-color);
        }
        
        .info-notification i {
            color: var(--primary-color);
        }
        
        .close-notification {
            background: none;
            border: none;
            cursor: pointer;
            color: #aaa;
            transition: var(--transition);
        }
        
        .close-notification:hover {
            color: var(--dark-color);
        }
        
        header.scrolled {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            background-color: rgba(255, 255, 255, 0.98);
        }
        
        .fade-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in-element {
            opacity: 1;
            transform: translateY(0);
        }
        
        .fade-in-card {
            animation: fadeInUp 0.5s ease forwards;
            opacity: 0;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            padding-left: 0;
            list-style: none;
        }
        
        .skills-list li {
            background: linear-gradient(135deg, rgba(67, 97, 238, 0.1), rgba(114, 9, 183, 0.1));
            padding: 0.3rem 0.8rem;
            border-radius: 50px;
            font-size: 0.9rem;
            color: var(--primary-color);
        }
        
        .resources-list li {
            margin-bottom: 0.7rem;
        }
        
        .resource-type {
            background-color: #f0f0f0;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            color: #666;
            margin-left: 0.5rem;
        }
        
        .compare-btn {
            padding: 0.8rem 1.5rem;
            background: transparent;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
            border-radius: var(--border-radius);
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-left: 0.8rem;
        }
        
        .compare-btn:hover {
            background-color: rgba(67, 97, 238, 0.05);
            transform: translateY(-3px);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes fadeInUp {
            from { 
                opacity: 0;
                transform: translateY(30px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// Job Board Functionality
class JobBoard {
    constructor() {
        this.jobListings = document.getElementById('jobListings');
        this.filterBtn = document.getElementById('filterJobs');
        this.locationFilter = document.getElementById('jobLocation');
        this.typeFilter = document.getElementById('jobType');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.filterBtn.addEventListener('click', () => this.filterJobs());
    }

    async fetchJobs(careerPath) {
        // This would typically be an API call to your backend
        // For now, we'll simulate some job listings
        const mockJobs = [
            {
                title: `${careerPath} Developer`,
                company: 'Tech Corp',
                location: 'remote',
                type: 'fulltime',
                description: `Looking for an experienced ${careerPath} developer to join our team.`,
                salary: '$80,000 - $120,000',
                applyLink: 'https://www.linkedin.com/jobs/view/software-developer-at-tech-corp',
                applicationEmail: 'careers@techcorp.com'
            },
            {
                title: `Senior ${careerPath} Engineer`,
                company: 'Innovation Labs',
                location: 'onsite',
                type: 'fulltime',
                description: `Senior ${careerPath} position available for experienced professionals.`,
                salary: '$100,000 - $150,000',
                applyLink: 'https://www.linkedin.com/jobs/view/senior-software-engineer-at-innovation-labs',
                applicationEmail: 'hiring@innovationlabs.com'
            },
            {
                title: `${careerPath} Consultant`,
                company: 'Digital Solutions',
                location: 'hybrid',
                type: 'contract',
                description: `Contract position for ${careerPath} consulting projects.`,
                salary: '$70/hour',
                applyLink: 'https://www.linkedin.com/jobs/view/software-consultant-at-digital-solutions',
                applicationEmail: 'jobs@digitalsolutions.com'
            }
        ];

        return mockJobs;
    }

    filterJobs() {
        const location = this.locationFilter.value;
        const type = this.typeFilter.value;
        
        const jobCards = this.jobListings.getElementsByClassName('job-card');
        Array.from(jobCards).forEach(card => {
            const showLocation = !location || card.dataset.location === location;
            const showType = !type || card.dataset.type === type;
            
            card.style.display = (showLocation && showType) ? 'block' : 'none';
        });
    }

    createJobCard(job) {
        return `
            <div class="job-card" data-location="${job.location}" data-type="${job.type}">
                <h4>${job.title}</h4>
                <div class="job-company">${job.company}</div>
                <div class="job-details">
                    <span class="job-location">
                        <i class="fas fa-map-marker-alt"></i> ${job.location}
                    </span>
                    <span class="job-type">
                        <i class="fas fa-clock"></i> ${job.type}
                    </span>
                </div>
                <p class="job-description">${job.description}</p>
                <div class="job-salary">
                    <i class="fas fa-money-bill-wave"></i> ${job.salary}
                </div>
                <div class="job-actions">
                    <a href="${job.applyLink}" class="apply-btn" target="_blank">Apply on LinkedIn</a>
                    <button class="quick-apply-btn" data-company="${job.company}" data-title="${job.title}" data-email="${job.applicationEmail}">
                        Quick Apply
                    </button>
                </div>
            </div>
        `;
    }

    async displayJobs(careerPath) {
        const jobs = await this.fetchJobs(careerPath);
        this.jobListings.innerHTML = jobs.map(job => this.createJobCard(job)).join('');
        
        // Add event listeners for quick apply buttons
        const quickApplyBtns = this.jobListings.querySelectorAll('.quick-apply-btn');
        quickApplyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.showApplicationForm(e.target.dataset));
        });
    }

    showApplicationForm(jobData) {
        // Create modal for application form
        const modal = document.createElement('div');
        modal.className = 'application-modal';
        modal.innerHTML = `
            <div class="application-form">
                <div class="form-header">
                    <h3>Apply for ${jobData.title} at ${jobData.company}</h3>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <form id="jobApplicationForm">
                    <div class="form-group">
                        <label for="fullName">Full Name</label>
                        <input type="text" id="fullName" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone</label>
                        <input type="tel" id="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="resume">Resume/CV</label>
                        <input type="file" id="resume" accept=".pdf,.doc,.docx" required>
                    </div>
                    <div class="form-group">
                        <label for="coverLetter">Cover Letter</label>
                        <textarea id="coverLetter" rows="4"></textarea>
                    </div>
                    <button type="submit" class="submit-application">Submit Application</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners for modal
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => modal.remove());

        const applicationForm = modal.querySelector('#jobApplicationForm');
        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically send the application data to your backend
            showNotification('success', `Application submitted successfully for ${jobData.title} position at ${jobData.company}! We'll contact you soon.`);
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Initialize Learning System when recommendations are shown
document.addEventListener('DOMContentLoaded', () => {
    const jobBoard = new JobBoard();
    const learningSystem = new LearningSystem();
    
    // When career recommendations are generated, display relevant jobs and courses
    const recommendationsContainer = document.getElementById('recommendationsContainer');
    if (recommendationsContainer) {
        // Listen for course recommendations
        recommendationsContainer.addEventListener('courseRecommended', (e) => {
            const courseData = e.detail;
            learningSystem.addCourse(courseData);
            document.getElementById('learning-progress').classList.remove('hidden');
        });

        // Example: Display jobs when recommendations are shown
        jobBoard.displayJobs('Software');
    }
});

// Learning Progress and Quiz System
class LearningSystem {
    constructor() {
        this.courses = new Map();
        this.currentQuiz = null;
        this.stats = {
            coursesStarted: 0,
            coursesCompleted: 0,
            quizzesPassed: 0,
            overallProgress: 0
        };
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadProgress();
        this.initializeDemoCourses(); // Add demo courses for testing
    }

    initializeElements() {
        this.progressSection = document.getElementById('learning-progress');
        this.coursesList = document.getElementById('coursesList');
        this.quizSection = document.getElementById('quizSection');
        this.quizContent = document.getElementById('quizContent');
        this.submitQuizBtn = document.getElementById('submitQuiz');
        
        // Stats elements
        this.statsElements = {
            coursesStarted: document.getElementById('coursesStarted'),
            coursesCompleted: document.getElementById('coursesCompleted'),
            quizzesPassed: document.getElementById('quizzesPassed'),
            overallProgress: document.getElementById('overallProgress')
        };
    }

    setupEventListeners() {
        if (this.submitQuizBtn) {
            this.submitQuizBtn.addEventListener('click', () => this.submitQuiz());
        }
    }

    loadProgress() {
        // Load saved progress from localStorage
        const savedProgress = localStorage.getItem('learningProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            this.stats = progress.stats;
            this.courses = new Map(progress.courses);
            this.updateStats();
        }
    }

    saveProgress() {
        // Save progress to localStorage
        const progress = {
            stats: this.stats,
            courses: Array.from(this.courses.entries())
        };
        localStorage.setItem('learningProgress', JSON.stringify(progress));
    }

    addCourse(courseData) {
        const course = {
            id: courseData.id,
            title: courseData.title,
            description: courseData.description,
            progress: 0,
            completed: false,
            quizzes: courseData.quizzes || [],
            currentModule: 0,
            modules: courseData.modules || [],
            youtubeResources: courseData.youtubeResources || [],
            projects: courseData.projects || []
        };
        
        this.courses.set(course.id, course);
        this.renderCourse(course);
        this.updateStats();
        this.saveProgress();
    }

    renderCourse(course) {
        if (!this.coursesList) return;

        const courseElement = document.createElement('div');
        courseElement.className = 'course-card';
        courseElement.innerHTML = `
            <div class="course-header">
                <h4>${course.title}</h4>
                <p>${course.description}</p>
            </div>
            <div class="course-content">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${course.progress}%"></div>
                </div>
                <p>${course.progress}% Complete</p>
                
                ${course.projects ? `
                    <div class="projects-section">
                        <h5>Recommended Projects:</h5>
                        <div class="project-list">
                            ${course.projects.map(project => `
                                <div class="project-card">
                                    <h6>${project.title}</h6>
                                    <p>${project.description}</p>
                                    <div class="project-meta">
                                        <span class="difficulty ${project.difficulty.toLowerCase()}">${project.difficulty}</span>
                                        <div class="skills">
                                            ${project.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${course.youtubeResources ? `
                    <div class="youtube-resources">
                        <h5>YouTube Resources:</h5>
                        <ul class="resource-list">
                            ${course.youtubeResources.map(resource => `
                                <li>
                                    <a href="${resource.url}" target="_blank">
                                        <i class="fab fa-youtube"></i> ${resource.title}
                                        <span class="channel-name">${resource.channel}</span>
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="course-actions">
                    <button class="course-btn continue-btn" data-course="${course.id}">
                        ${course.completed ? 'Review Course' : 'Continue Learning'}
                    </button>
                    <button class="course-btn quiz-btn" data-course="${course.id}" ${course.progress < 50 ? 'disabled' : ''}>
                        Take Quiz
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const continueBtn = courseElement.querySelector('.continue-btn');
        const quizBtn = courseElement.querySelector('.quiz-btn');
        
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.continueCourse(course.id));
        }
        
        if (quizBtn) {
            quizBtn.addEventListener('click', () => this.startQuiz(course.id));
        }
        
        this.coursesList.appendChild(courseElement);
    }

    continueCourse(courseId) {
        const course = this.courses.get(courseId);
        if (!course) return;
        
        // Platform URLs - Updated with direct links to the learning platforms
        const platformUrls = {
            'datacamp-1': 'https://www.datacamp.com/courses/all',
            'coursera-ml-1': 'https://www.coursera.org/learn/machine-learning',
            'kaggle-1': 'https://www.kaggle.com/learn',
            'python-handbook-1': 'https://jakevdp.github.io/PythonDataScienceHandbook/',
            'google-analytics-1': 'https://www.coursera.org/professional-certificates/google-data-analytics',
            'tableau-public-1': 'https://public.tableau.com/en-us/s/'
        };

        // Open platform in new tab
        const platformUrl = platformUrls[courseId];
        if (platformUrl) {
            window.open(platformUrl, '_blank');
            
            // Update progress
            course.progress = Math.min(100, course.progress + 25);
            if (course.progress === 100) {
                course.completed = true;
            }
            
            // Update UI
            this.updateCourseUI(course);
            this.updateStats();
            this.saveProgress();
        } else {
            showNotification('error', 'Learning platform URL not available.');
        }
    }

    updateCourseUI(course) {
        const courseCard = this.coursesList.querySelector(`[data-course="${course.id}"]`).closest('.course-card');
        const progressFill = courseCard.querySelector('.progress-fill');
        const progressText = courseCard.querySelector('p');
        const continueBtn = courseCard.querySelector('.continue-btn');
        const quizBtn = courseCard.querySelector('.quiz-btn');
        
        progressFill.style.width = `${course.progress}%`;
        progressText.textContent = `${course.progress}% Complete`;
        continueBtn.textContent = course.completed ? 'Review Course' : 'Continue Learning';
        quizBtn.disabled = course.progress < 50;
    }

    startQuiz(courseId) {
        const course = this.courses.get(courseId);
        if (!course || !course.quizzes || course.quizzes.length === 0) {
            showNotification('error', 'No quiz available for this course yet.');
            return;
        }

        // Get the first quiz for the course
        const quiz = course.quizzes[0];
        this.currentQuiz = {
            courseId: courseId,
            title: quiz.title,
            questions: quiz.questions,
            answers: new Map()
        };

        // Show quiz section
        if (this.quizSection) {
            this.quizSection.classList.remove('hidden');
            document.getElementById('quizDescription').textContent = quiz.title;
            this.renderQuiz();
            
            // Scroll to quiz section
            this.quizSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    renderQuiz() {
        if (!this.currentQuiz || !this.quizContent) return;

        const quizHTML = this.currentQuiz.questions.map((question, index) => `
            <div class="quiz-question" data-question="${index}">
                <h4>Question ${index + 1}: ${question.question}</h4>
                <div class="quiz-options">
                    ${question.options.map((option, optIndex) => `
                        <div class="quiz-option" data-option="${optIndex}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        this.quizContent.innerHTML = quizHTML;

        // Add click handlers for options
        const options = this.quizContent.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                const questionEl = e.target.closest('.quiz-question');
                const questionIndex = parseInt(questionEl.dataset.question);
                
                // Remove previous selection
                questionEl.querySelectorAll('.quiz-option').forEach(opt => 
                    opt.classList.remove('selected'));
                
                // Add new selection
                e.target.classList.add('selected');
                
                // Save answer
                this.currentQuiz.answers.set(questionIndex, 
                    parseInt(e.target.dataset.option));
            });
        });
    }

    submitQuiz() {
        if (!this.currentQuiz) return;
        
        const course = this.courses.get(this.currentQuiz.courseId);
        let correctAnswers = 0;
        
        this.currentQuiz.questions.forEach((question, index) => {
            const userAnswer = this.currentQuiz.answers.get(index);
            if (userAnswer === question.correctAnswer) {
                correctAnswers++;
            }
        });
        
        const score = (correctAnswers / this.currentQuiz.questions.length) * 100;
        const passed = score >= 70;
        
        if (passed) {
            this.stats.quizzesPassed++;
            course.progress = 100;
            course.completed = true;
            this.updateCourseUI(course);
        }
        
        // Show result notification
        showNotification(
            passed ? 'success' : 'error',
            `Quiz ${passed ? 'Passed' : 'Failed'}: You scored ${Math.round(score)}%${passed ? '! Course completed!' : '. Try again after reviewing the material.'}`
        );
        
        this.quizSection.classList.add('hidden');
        this.currentQuiz = null;
        this.updateStats();
        this.saveProgress();
    }

    updateStats() {
        const coursesArray = Array.from(this.courses.values());
        this.stats.coursesStarted = coursesArray.filter(c => c.progress > 0).length;
        this.stats.coursesCompleted = coursesArray.filter(c => c.completed).length;
        this.stats.overallProgress = Math.round(
            coursesArray.reduce((acc, curr) => acc + curr.progress, 0) / coursesArray.length
        );
        
        // Update UI
        if (this.statsElements) {
            this.statsElements.coursesStarted.textContent = this.stats.coursesStarted;
            this.statsElements.coursesCompleted.textContent = this.stats.coursesCompleted;
            this.statsElements.quizzesPassed.textContent = this.stats.quizzesPassed;
            this.statsElements.overallProgress.textContent = `${this.stats.overallProgress}%`;
        }
    }

    initializeDemoCourses() {
        const demoCourses = [
            {
                id: 'datacamp-1',
                title: 'DataCamp',
                description: '25% Complete',
                progress: 25,
                projects: [
                    {
                        title: 'COVID-19 Data Analysis',
                        description: 'Analyze COVID-19 dataset to identify trends and create visualizations using pandas and matplotlib.',
                        difficulty: 'Beginner',
                        skills: ['Python', 'Pandas', 'Data Visualization']
                    },
                    {
                        title: 'Stock Market Prediction',
                        description: 'Build a stock price predictor using historical data and machine learning algorithms.',
                        difficulty: 'Intermediate',
                        skills: ['Python', 'Pandas', 'Scikit-learn']
                    },
                    {
                        title: 'Customer Segmentation',
                        description: 'Use clustering algorithms to segment customers based on their purchasing behavior.',
                        difficulty: 'Advanced',
                        skills: ['Python', 'Scikit-learn', 'Data Analysis']
                    }
                ],
                youtubeResources: [
                    {
                        title: 'Python for Data Science Full Course',
                        url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
                        channel: 'freeCodeCamp'
                    },
                    {
                        title: 'Data Science Tutorial for Beginners',
                        url: 'https://www.youtube.com/watch?v=ua-CiDNNj30',
                        channel: 'Simplilearn'
                    }
                ]
            },
            {
                id: 'coursera-ml-1',
                title: 'Coursera - Machine Learning by Andrew Ng',
                description: 'Course for Data Scientist',
                progress: 0,
                projects: [
                    {
                        title: 'Email Spam Classifier',
                        description: 'Build a machine learning model to classify emails as spam or not spam.',
                        difficulty: 'Beginner',
                        skills: ['Python', 'Scikit-learn', 'NLP']
                    },
                    {
                        title: 'House Price Prediction',
                        description: 'Develop a regression model to predict house prices using multiple features.',
                        difficulty: 'Intermediate',
                        skills: ['Python', 'Linear Regression', 'Feature Engineering']
                    },
                    {
                        title: 'Image Recognition System',
                        description: 'Create a deep learning model to classify images using neural networks.',
                        difficulty: 'Advanced',
                        skills: ['Python', 'TensorFlow', 'CNN']
                    }
                ],
                youtubeResources: [
                    {
                        title: 'Stanford CS229: Machine Learning Course',
                        url: 'https://www.youtube.com/watch?v=jGwO_UgTS7I',
                        channel: 'Stanford Online'
                    },
                    {
                        title: 'Machine Learning Basics',
                        url: 'https://www.youtube.com/watch?v=aircAruvnKk',
                        channel: '3Blue1Brown'
                    }
                ]
            },
            {
                id: 'kaggle-1',
                title: 'Kaggle',
                description: 'Tool/Community for Data Scientist',
                progress: 0,
                projects: [
                    {
                        title: 'Titanic Survival Prediction',
                        description: 'Predict passenger survival on the Titanic using machine learning.',
                        difficulty: 'Beginner',
                        skills: ['Python', 'Data Cleaning', 'Classification']
                    },
                    {
                        title: 'Credit Card Fraud Detection',
                        description: 'Build a model to detect fraudulent credit card transactions.',
                        difficulty: 'Intermediate',
                        skills: ['Python', 'Imbalanced Learning', 'Classification']
                    },
                    {
                        title: 'Store Sales Prediction',
                        description: 'Forecast store sales using time series analysis and machine learning.',
                        difficulty: 'Advanced',
                        skills: ['Python', 'Time Series', 'Forecasting']
                    }
                ],
                youtubeResources: [
                    {
                        title: 'Kaggle Tutorial for Beginners',
                        url: 'https://www.youtube.com/watch?v=Gp_qv317Gew',
                        channel: 'Ken Jee'
                    },
                    {
                        title: 'How to Win Kaggle Competitions',
                        url: 'https://www.youtube.com/watch?v=GwW7LgqEVP8',
                        channel: 'DataTalksClub'
                    }
                ]
            },
            {
                id: 'python-handbook-1',
                title: 'Python Data Science Handbook',
                description: 'Book for Data Scientist',
                progress: 0,
                projects: [
                    {
                        title: 'Data Cleaning and Analysis',
                        description: 'Clean and analyze a messy dataset using pandas and numpy.',
                        difficulty: 'Beginner',
                        skills: ['Python', 'Pandas', 'NumPy']
                    },
                    {
                        title: 'Interactive Dashboard',
                        description: 'Create an interactive dashboard using Plotly and Dash.',
                        difficulty: 'Intermediate',
                        skills: ['Python', 'Plotly', 'Dash']
                    },
                    {
                        title: 'Automated Report Generator',
                        description: 'Build a system to automatically generate data reports and visualizations.',
                        difficulty: 'Advanced',
                        skills: ['Python', 'Automation', 'Reporting']
                    }
                ],
                youtubeResources: [
                    {
                        title: 'Python for Data Analysis Tutorial',
                        url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8',
                        channel: 'Programming with Mosh'
                    },
                    {
                        title: 'NumPy, Pandas & Matplotlib Tutorial',
                        url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8',
                        channel: 'Corey Schafer'
                    }
                ]
            },
            {
                id: 'google-analytics-1',
                title: 'Google Data Analytics Professional Certificate',
                description: 'Course for Data Analyst',
                progress: 0,
                projects: [
                    {
                        title: 'Website Traffic Analysis',
                        description: 'Analyze website traffic patterns using Google Analytics.',
                        difficulty: 'Beginner',
                        skills: ['Google Analytics', 'Data Analysis', 'Reporting']
                    },
                    {
                        title: 'Marketing Campaign Analysis',
                        description: 'Evaluate the effectiveness of marketing campaigns using analytics data.',
                        difficulty: 'Intermediate',
                        skills: ['Google Analytics', 'Marketing Analytics', 'ROI Analysis']
                    },
                    {
                        title: 'Customer Journey Analysis',
                        description: 'Map and analyze customer journeys using Google Analytics data.',
                        difficulty: 'Advanced',
                        skills: ['Google Analytics', 'User Behavior', 'Funnel Analysis']
                    }
                ],
                youtubeResources: [
                    {
                        title: 'Data Analytics Full Course',
                        url: 'https://www.youtube.com/watch?v=ua-CiDNNj30',
                        channel: 'Simplilearn'
                    },
                    {
                        title: 'Google Data Analytics Certificate - Worth it?',
                        url: 'https://www.youtube.com/watch?v=CC3Mj0JFDsM',
                        channel: 'Alex The Analyst'
                    }
                ]
            },
            {
                id: 'tableau-public-1',
                title: 'Tableau Public',
                description: 'Tool for Data Analyst',
                progress: 0,
                projects: [
                    {
                        title: 'Sales Dashboard',
                        description: 'Create an interactive sales dashboard with key metrics and trends.',
                        difficulty: 'Beginner',
                        skills: ['Tableau', 'Dashboard Design', 'Data Visualization']
                    },
                    {
                        title: 'HR Analytics Dashboard',
                        description: 'Build a comprehensive HR analytics dashboard for employee data.',
                        difficulty: 'Intermediate',
                        skills: ['Tableau', 'HR Analytics', 'KPI Tracking']
                    },
                    {
                        title: 'Supply Chain Analytics',
                        description: 'Develop a supply chain analytics dashboard with forecasting.',
                        difficulty: 'Advanced',
                        skills: ['Tableau', 'Supply Chain', 'Forecasting']
                    }
                ],
                youtubeResources: [
                    {
                        title: 'Tableau Full Course for Beginners',
                        url: 'https://www.youtube.com/watch?v=aHaOIvR00So',
                        channel: 'Simplilearn'
                    },
                    {
                        title: 'Tableau Tutorial for Data Visualization',
                        url: 'https://www.youtube.com/watch?v=TPMlZxRRaBQ',
                        channel: 'freeCodeCamp'
                    }
                ]
            }
        ];

        // Clear existing courses
        this.courses.clear();
        if (this.coursesList) {
            this.coursesList.innerHTML = '';
        }

        // Add new courses
        demoCourses.forEach(course => {
            this.courses.set(course.id, course);
            this.renderCourse(course);
        });

        // Update stats
        this.updateStats();
    }
} 
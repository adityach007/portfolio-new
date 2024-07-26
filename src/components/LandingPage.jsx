import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import { ChevronDown, Send, Menu, X, MessageCircle, Loader, Star } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

import AboutSection from './AboutSection';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';
import ProjectPopup from './ProjectPopup';
import ContactSection from './ContactSection';
import Footer from './Footer';

// Load the API key from .env file
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// Initialize the Gemini AI
let genAI;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
} else {
  console.error('Google API Key is not set. Please check your environment variables.');
}

const ChatMessage = ({ message, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div className={`${isUser ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'} rounded-lg py-3 px-4 max-w-[80%] shadow-lg`}>
      {message}
    </div>
  </motion.div>
);

const ChatBot = ({ isOpen, onClose, websiteInfo }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;
    if (!genAI) {
      setMessages(prev => [...prev, { text: "I'm sorry, the AI service is currently unavailable. Please try again later.", isUser: false }]);
      return;
    }

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `You are a helpful assistant for Aditya Choudhary's personal portfolio website. Here's a comprehensive overview of Aditya's background, skills, projects, and contact information:

      ${JSON.stringify(websiteInfo, null, 2)}

      Please provide a detailed and informative answer to the following question about Aditya Choudhary or the website content: ${userMessage}

      If the question is not directly related to Aditya or the website content, politely redirect the conversation back to Aditya's portfolio or suggest asking about his skills, projects, or background.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { text: "I'm sorry, I encountered an error. Please try again later.", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed bottom-24 right-4 sm:right-8 w-11/12 sm:w-96 h-[500px] bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg shadow-2xl overflow-hidden z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="flex justify-between items-center bg-white bg-opacity-10 backdrop-blur-md text-white p-4">
        <h3 className="font-bold text-lg">Chat with AI Assistant</h3>
        <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 p-1 rounded-full transition-colors duration-300">
          <X size={20} />
        </button>
      </div>
      <div ref={chatContainerRef} className="h-[380px] overflow-y-auto p-4 bg-gradient-to-b from-indigo-100 to-purple-100">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message.text} isUser={message.isUser} />
        ))}
        {isLoading && (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin text-indigo-600" size={24} />
          </div>
        )}
      </div>
      <div className="p-4 bg-white bg-opacity-10 backdrop-blur-md">
        <div className="flex items-center bg-white rounded-full shadow-inner">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-grow bg-transparent px-4 py-2 focus:outline-none text-gray-800 placeholder-gray-500"
            placeholder="Ask about Aditya..."
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition duration-300 disabled:opacity-50 mr-1"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
      
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      let current = 'home';
      for (let section of sections) {
        const element = document.getElementById(section);
        if (element && window.pageYOffset >= element.offsetTop - 200) {
          current = section;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    {
      id: 1,
      title: "Github-App",
      description: "A look like github app performing some great features.",
      image: "/images/github.svg",
      category: "Web Development",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Passport.js"],
      features: [
        "Implemented Github like app with authenticated with Github using passport.js.",
        "Facility to view the user profile with all their repositories.",
        "Provide facility to like user profile and explore Github repositories of languages and integrated with MongoDB."
      ],
      liveDemo: "",
      sourceCode: "https://github.com/adityach007/github-app",
      demoVideo: "/images/Github-app.mp4",
      images: [
        "/images/github1.png",
        "/images/github2.png",
        "/images/github3.png"
      ]
    },
    {
      id: 2,
      title: "InfiUse",
      description: "A multi-functional LLM.",
      image: "/images/coding.svg",
      category: "Large Language Models",
      technologies: ["Python", "Streamlit", "Groq", "LangChain", "Codestral", "Streamlit Ace" ],
      features: [
        "InfiUse is a multimodal LLM providing facility of content generation, code generation, code compiler and conversational chat.",
        "Utilizes Groq Inference API and provides speedy results."
      ],
      liveDemo: "https://infiuse-3.onrender.com/",
      sourceCode: "https://github.com/adityach007/InfiUse",
      demoVideo: "/images/llm-video.mp4",
      images: [
        "/images/llm1.png",
        "/images/llm2.png",
        "/images/llm3.png",
        "/images/llm4.png"
      ]
    },
    {
      id: 3,
      title: "Fine-Tuning for Abstractive Text Summarization",
      description: "Developed text summarization project using Transformers.",
      image: "/images/transformers.svg",
      category: "Generative AI",
      technologies: ["Hugging Face", "PyTorch", "NLTK", "Py7zr"],
      features: [
        "Fine-tuned pre-trained Pegasus model for abstractive text summarization on SAMSum dataset.",
        "Evaluated model performance using ROUGE scores to measure quality of generated summaries."
      ],
      liveDemo: "",
      sourceCode: "https://github.com/adityach007/Gen_AI/tree/main/Pegasus%20Fine-Tuning%20for%20Abstractive%20Text%20Summarization",
      demoVideo: "",
      images: [
        "https://via.placeholder.com/800x600?text=Summarization+Screenshot+1",
        "https://via.placeholder.com/800x600?text=Summarization+Screenshot+2",
        "https://via.placeholder.com/800x600?text=Summarization+Screenshot+3"
      ]
    },
    {
      id: 4,
      title: "WhatsApp Chat Analyzer",
      description: "Analyze your WhatsApp chat conversations to gain insights into your messaging patterns and statistics.",
      image: "/images/transformers.svg",
      category: "Machine Learning",
      technologies: ["re", "streamlit", "pandas", "numpy", "seaborn", "matplotlib", "urlextract", "wordcloud", "collections", "emoji"],
      features: [
        "Total Statistics: Get an overview of the total messages, media shared, and participants in the chat.",
        "Monthly Timeline: Visualize message activity on a monthly basis to see how your conversations have evolved over time.",
        "Daily Timeline: Explore the daily messaging patterns to understand when the most active times are.",
        "Activity Map: View an interactive map displaying the geographical locations of participants during conversations.",
        "Weekly Activity Heat Map: Understand the distribution of messages across different days of the week.",
        "Most Busy User Graphs: Identify the most active participants and see how their engagement compares.",
        "Word Cloud: Generate a word cloud to highlight the most frequently used words in the chat.",
        "Emojis Usage Graph: Visualize the usage of emojis to understand the emotional context of the conversations."
      ],
      liveDemo: "",
      sourceCode: "https://github.com/adityach007/Machine-Learning/tree/main/WhatsApp_Chat_Analyzer",
      demoVideo: "",
      images: [
        "/images/ws1.png",
        "/images/ws2.png",
        "/images/ws3.png",
        "/images/ws4.png",
        "/images/ws5.png",
        "/images/ws6.png",
        "/images/ws7.png",
        "/images/ws8.png",
        "/images/ws9.png",
        "/images/ws10.png",
        "/images/ws11.png",
      ]
    }
  ];

  const websiteInfo = {
    name: "Aditya Choudhary",
    title: "Web Developer and Machine Learning Enthusiast",
    about: "Aditya Choudhary is a passionate web developer and machine learning enthusiast with a strong foundation in both front-end and back-end technologies. He combines creativity with technical expertise to build innovative and efficient web solutions.",
    education: [
      {
        degree: "Bachelor of Technology in Computer Science",
        institution: "Vellore Institute of Technology Chennai",
        year: "2021-2025"
      }
    ],
    workExperience: [
      {
        year: "Oct 2023 – Nov 2023",
        title: "Machine Learning Intern",
        company: "Feynn Labs",
        responsibilities: [
          "Formulated in-depth market research on the electric vehicle (EV) industry in India, analyzing sales data, consumer preferences, and government policies, resulting in valuable insights into the Indian EV revolution."
        ],
        achievements: [
          "Presented a model for defining the emotion of the tone in the form of audio."
        ]
      },
      {
        year: "Aug 2023 – Nov 2023",
        title: "Full Stack Developer",
        company: "Ethnus",
        responsibilities: [
          "Implemented MERN stack proficiency to drive the development of web applications.",
          "Leveraged MongoDB, ExpressJS, ReactJS, and NodeJS to deliver seamless user experiences and boost user engagement",
          "Collaborated with a virtual team to deliver high-quality solutions, honing skills in full-stack development, API integration, and agile methodologies."
        ],
        achievements: [
          ""
        ]
      },
    ],
    skills: [
      {
        category: "Front-end Development",
        description: "Creating responsive and intuitive user interfaces with modern web technologies.",
        skills: [
          { name: "HTML5", level: 90 },
          { name: "CSS3", level: 90 },
          { name: "JavaScript", level: 85 },
          { name: "React", level: 75 },
          { name: "Tailwind CSS", level: 80 },
        ]
      },
      {
        category: "Back-end Development",
        description: "Building robust server-side applications and APIs to power web applications.",
        skills: [
          { name: "Node.js", level: 80 },
          { name: "Python", level: 90 },
          { name: "SQL", level: 75 },
          { name: "MongoDB", level: 70 },
          { name: "Express.js", level: 80 },
        ]
      },
      {
        category: "DevOps & Tools",
        description: "Streamlining development processes and ensuring smooth deployment and operation.",
        skills: [
          { name: "Git", level: 85 },
          { name: "AWS", level: 75 },
        ]
      },
      {
        category: "Machine Learning",
        description: "Exploring and implementing cutting-edge technologies to stay ahead of the curve.",
        skills: [
          { name: "Machine Learning", level: 95 },
          { name: "Deep Learning", level: 85},
          { name: "NLP", level: 80},
          { name: "LLM", level: 70}
        ]
      },
      {
        category: "Soft Skills",
        description: "Complementing technical skills with essential professional attributes.",
        skills: [
          { name: "Problem Solving", level: 90 },
          { name: "Team Collaboration", level: 95 },
          { name: "Technical Writing", level: 80 },
          { name: "Mentoring", level: 85 }
        ]
      },
    ],
    projects: projects,
    contactInfo: {
      email: "panwaraditya366@gmail.com",
      github: "https://github.com/adityach007",
      linkedin: "www.linkedin.com/in/adityachoudhary007"
    },
    achievements: [
      ""
    ]
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const navItems = ['home', 'about', 'skills', 'projects', 'contact'];

  return (
    <div className="bg-gradient-to-b from-indigo-100 to-purple-200 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <motion.a 
            className="font-bold text-2xl text-indigo-600"
            href="#"
            onClick={() => scrollToSection('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            AC
          </motion.a>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <motion.button 
                key={item}
                className={`text-gray-700 hover:text-indigo-600 transition duration-300 ${activeSection === item ? 'text-indigo-600 font-semibold' : ''}`}
                onClick={() => scrollToSection(item)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </motion.button>
            ))}
          </div>
          <motion.button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-md z-40"
          >
            {navItems.map((item) => (
              <motion.button 
                key={item}
                className={`block w-full text-left px-6 py-3 text-gray-700 hover:bg-indigo-100 transition duration-300 ${activeSection === item ? 'bg-indigo-100 font-semibold' : ''}`}
                onClick={() => scrollToSection(item)}
                whileHover={{ x: 10 }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header id="home" className="container mx-auto px-4 sm:px-6 py-32 text-center">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Hi, I'm <span className="text-indigo-600">{websiteInfo.name}</span>
        </motion.h1>
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {websiteInfo.title}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button 
            className="bg-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300"
            onClick={() => scrollToSection('contact')}
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            Get in touch
          </motion.button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown 
              size={40} 
              className="mx-auto text-indigo-600 cursor-pointer"
              onClick={() => scrollToSection('about')}
            />
          </motion.div>
        </motion.div>
      </header>

      {/* Other Sections */}
      <section id="about">
        <AboutSection info={websiteInfo} />
      </section>
      <section id="skills">
        <SkillsSection skills={websiteInfo.skills} />
      </section>
      <section id="projects">
        <ProjectsSection 
          projects={websiteInfo.projects}
          handleProjectClick={handleProjectClick}
        />
      </section>
      <section id="contact">
        <ContactSection contactInfo={websiteInfo.contactInfo} />
      </section>

      <Footer />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 sm:bottom-8 right-4 sm:right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-50"
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Bot Button */}
      <motion.button
        className="fixed bottom-8 left-4 sm:left-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg z-50"
        onClick={() => setIsChatOpen(!isChatOpen)}
        whileHover={{ scale: 1.1, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={28} />
      </motion.button>

      {/* Chat Bot */}
      <AnimatePresence>
        {isChatOpen && (
          <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} websiteInfo={websiteInfo} />
        )}
      </AnimatePresence>

      {/* Project Popup */}
      <ProjectPopup
        project={selectedProject}
        isOpen={isPopupOpen}
        onClose={closePopup}
      />

      {/* Error message if API key is not set */}
      {!API_KEY && (
        <div className="fixed bottom-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
          <p className="font-bold">Error: Google API Key is not set.</p>
          <p>Please check your environment variables and restart the application.</p>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 right-4 sm:right-8 flex flex-col space-y-4">
        <motion.a
          href={websiteInfo.contactInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 text-white p-3 rounded-full shadow-lg"
          whileHover={{ scale: 1.1, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.9 }}
        >
          <FaGithub size={20} />
        </motion.a>
        <motion.a
          href={websiteInfo.contactInfo.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
          whileHover={{ scale: 1.1, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.9 }}
        >
          <FaLinkedin size={20} />
        </motion.a>
        <motion.a
          href={`mailto:${websiteInfo.contactInfo.email}`}
          className="bg-red-500 text-white p-3 rounded-full shadow-lg"
          whileHover={{ scale: 1.1, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.9 }}
        >
          <FaEnvelope size={20} />
        </motion.a>
      </div>

      {/* Floating Stars */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-400"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Star size={12} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
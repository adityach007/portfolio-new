import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import { ChevronDown, Send, Menu, X, MessageCircle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

import AboutSection from './AboutSection';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';
import ProjectPopup from './ProjectPopup';
import ContactSection from './ContactSection';
import Footer from './Footer';

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI('ENTER YOUR API KEY');

const ChatMessage = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`${isUser ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg py-2 px-4 max-w-[70%]`}>
      {message}
    </div>
  </div>
);

const ChatBot = ({ isOpen, onClose, websiteInfo }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `You are a helpful assistant for a personal portfolio website. The website contains information about Aditya Choudhary. Here's a comprehensive overview of the website content:

      ${websiteInfo}

      Please answer the following question about the website or its content: ${userMessage}`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { text: "I'm sorry, I encountered an error. Please try again later.", isUser: false }]);
    }
  };

  return (
    <motion.div
      className="fixed bottom-24 right-8 w-80 h-96 bg-white rounded-lg shadow-lg overflow-hidden z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="flex justify-between items-center bg-indigo-600 text-white p-4">
        <h3 className="font-semibold">Chat with AI Assistant</h3>
        <button onClick={onClose}><X size={20} /></button>
      </div>
      <div ref={chatContainerRef} className="h-64 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message.text} isUser={message.isUser} />
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-grow border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ask about the website..."
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition duration-300"
          >
            <Send size={20} />
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
      image: "src/assets/github/github.svg",
      category: "Web Development",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Passport.js"],
      features: [
        "Implemented Github like app with authenticated with Github using passport.js.",
        "Facility to view the user profile with all their repositories.",
        "Provide facility to like user profile and explore Github repositories of languages and integrated with MongoDB."
      ],
      liveDemo: "",
      sourceCode: "https://github.com/adityach007/github-app",
      demoVideo: "src/assets/github/Github-app.mp4",
      images: [
        "src/assets/github/github1.png",
        "src/assets/github/github2.png",
        "src/assets/github/github3.png"
      ]
    },
    {
      id: 2,
      title: "InfiUse",
      description: "A multi-functional LLM.",
      image: "src/assets/llm/coding.svg",
      category: "Web Development",
      technologies: ["Python", "Streamlit", "Groq", "LangChain", "Codestral", "Streamlit Ace" ],
      features: [
        "InfiUse is a multimodal LLM providing facility of content generation, code generation, code compiler and conversational chat.",
        "Utilizes Groq Inference API and provides speedy results."
      ],
      liveDemo: "https://infiuse-3.onrender.com/",
      sourceCode: "https://github.com/adityach007/InfiUse",
      demoVideo: "https://example.com/ecommerce-demo.mp4",
      images: [
        "https://via.placeholder.com/800x600?text=E-commerce+Screenshot+1",
        "https://via.placeholder.com/800x600?text=E-commerce+Screenshot+2",
        "https://via.placeholder.com/800x600?text=E-commerce+Screenshot+3"
      ]
    },
    {
      id: 3,
      title: "Fine-Tuning for Abstractive Text Summarization",
      description: "Developed text summarization project using Transformers.",
      image: "src/assets/text/transformers.svg",
      category: "Web Development",
      technologies: ["Hugging Face", "PyTorch", "NLTK", "Py7zr"],
      features: [
        "Fine-tuned pre-trained Pegasus model for abstractive text summarization on SAMSum dataset.",
        "Evaluated model performance using ROUGE scores to measure quality of generated summaries."
      ],
      liveDemo: "",
      sourceCode: "https://github.com/adityach007/Gen_AI/tree/main/Pegasus%20Fine-Tuning%20for%20Abstractive%20Text%20Summarization",
      demoVideo: "https://example.com/ecommerce-demo.mp4",
      images: [
        "https://via.placeholder.com/800x600?text=E-commerce+Screenshot+1",
        "https://via.placeholder.com/800x600?text=E-commerce+Screenshot+2",
        "https://via.placeholder.com/800x600?text=E-commerce+Screenshot+3"
      ]
    },
  ];

  const websiteInfo = `
    About Aditya Choudhary:
    Aditya Choudhary is a passionate web developer and machine learning enthusiast. He combines a diverse range of technical skills with a passion for innovation and problem-solving to deliver exceptional web solutions.

    Skills:
    1. Front-end Development: HTML5, CSS3, JavaScript, React, Tailwind CSS
    2. Back-end Development: Node.js, Python, SQL, MongoDB, Express.js, Django
    3. DevOps & Tools: Git, AWS
    4. Machine Learning: Machine Learning, Deep Learning, NLP, LLM
    5. Soft Skills: Problem Solving, Team Collaboration, Agile Methodologies, Technical Writing, Mentoring

    Projects:
    1. Github-App
       - Description: A GitHub-like app with authentication and repository exploration features.
       - Technologies: React, Node.js, Express, MongoDB, Passport.js
       - Key Features: GitHub authentication, user profile viewing, repository exploration

    2. InfiUse
       - Description: A multi-functional LLM for content generation, code generation, and conversational chat.
       - Technologies: Python, Streamlit, Groq, LangChain, Codestral, Streamlit Ace
       - Key Features: Content generation, code generation, code compiler, conversational chat

    3. Fine-Tuning for Abstractive Text Summarization
       - Description: Text summarization project using Transformers.
       - Technologies: Hugging Face, PyTorch, NLTK, Py7zr
       - Key Features: Fine-tuned Pegasus model, ROUGE score evaluation

    Contact Information:
    - Email: panwaraditya366@gmail.com
    - GitHub: https://github.com/adityach007
    - LinkedIn: 

    Website Sections:
    - Home: Introduction and call-to-action
    - About: Detailed information about Aditya's background and interests
    - Skills: Comprehensive list of technical and soft skills
    - Projects: Showcase of key projects with details
    - Contact: Form or information for getting in touch
  `;

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
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <a className="font-bold text-2xl text-indigo-600" href="#" onClick={() => scrollToSection('home')}>AC</a>
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
      <header id="home" className="container mx-auto px-6 py-32 text-center">
        <motion.h1 
          className="text-5xl md:text-6xl font-bold mb-4 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Hi, I'm <span className="text-indigo-600">Aditya Choudhary</span>
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl mb-8 text-gray-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A passionate web developer and machine learning enthusiast
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button 
            className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300"
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

      {/* About Section */}
      <section id="about">
        <AboutSection />
      </section>

      {/* Skills Section */}
      <section id="skills">
        <SkillsSection />
      </section>

      {/* Projects Section */}
      <section id="projects">
        <ProjectsSection 
          projects={projects}
          handleProjectClick={handleProjectClick}
        />
      </section>

      {/* Contact Section */}
      <section id="contact">
        <ContactSection />
      </section>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-50"
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
        className="fixed bottom-8 left-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-50"
        onClick={() => setIsChatOpen(!isChatOpen)}
        whileHover={{ scale: 1.1, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={24} />
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
    </div>
  );
};

export default LandingPage;

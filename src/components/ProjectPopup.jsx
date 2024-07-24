import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play, Pause, ChevronLeft, ChevronRight, Code, Star, Info, Image, MessageCircle, Loader } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
let genAI;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
} else {
  console.error('Google API Key is not set. Please check your environment variables.');
}

// Demo projects data
const demoProjects = [
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
    category: "Web Development",
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
    category: "Web Development",
    technologies: ["Hugging Face", "PyTorch", "NLTK", "Py7zr"],
    features: [
      "Fine-tuned pre-trained Pegasus model for abstractive text summarization on SAMSum dataset.",
      "Evaluated model performance using ROUGE scores to measure quality of generated summaries."
    ],
    liveDemo: "",
    sourceCode: "https://github.com/adityach007/Gen_AI/tree/main/Pegasus%20Fine-Tuning%20for%20Abstractive%20Text%20Summarization",
    demoVideo: "",
    images: [
      "https://via.placeholder.com/800x600?text=E-commerce+Screenshot+1",
      "https://via.placeholder.com/800x600?text=E-commerce+Screenshot+2",
      "https://via.placeholder.com/800x600?text=E-commerce+Screenshot+3"
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

const TabButton = ({ active, children, onClick, icon: Icon }) => (
  <motion.button
    className={`px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base font-semibold rounded-t-lg flex items-center ${
      active ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'bg-gray-100 text-gray-600'
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon className="mr-1 sm:mr-2" size={16} />
    {children}
  </motion.button>
);

const ProjectPopup = ({ projectId, isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [explainerVisible, setExplainerVisible] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Find the project based on the projectId
  const project = demoProjects.find(p => p.id === projectId);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateProgress = () => {
        const progress = (video.currentTime / video.duration) * 100;
        setProgress(progress);
      };
      video.addEventListener('timeupdate', updateProgress);
      return () => video.removeEventListener('timeupdate', updateProgress);
    }
  }, []);

  if (!project) return null;

  const toggleVideo = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === project.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? project.images.length - 1 : prevIndex - 1
    );
  };

  const generateExplanation = async () => {
    if (!genAI) {
      setExplanation("I'm sorry, the AI service is currently unavailable. Please try again later.");
      return;
    }

    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Please provide a detailed explanation of the following project:

      Project Title: ${project.title}
      Description: ${project.description}
      Technologies Used: ${project.technologies.join(', ')}
      Key Features: ${project.features.join(', ')}

      Please explain the project's purpose, its technical implementation and possible future enhancements.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      setExplanation(response);
    } catch (error) {
      console.error('Error generating explanation:', error);
      setExplanation("I'm sorry, I encountered an error while generating the explanation. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExplainer = () => {
    if (!explainerVisible) {
      setActiveTab('explainer');
      generateExplanation();
    }
    setExplainerVisible(!explainerVisible);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <motion.h2 
                className="text-2xl sm:text-4xl font-bold text-indigo-800"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {project.title}
              </motion.h2>
              <motion.button
                onClick={onClose}
                className="text-gray-500 hover:text-indigo-600 transition duration-300"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
              {/* Video Player */}
              <motion.div 
                className="w-full lg:w-3/5"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
                  <video 
                    ref={videoRef}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    poster={project.image}
                    onClick={toggleVideo}
                  >
                    <source src={project.demoVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      onClick={toggleVideo}
                      className="text-white p-3 sm:p-4 rounded-full bg-indigo-600 hover:bg-indigo-700 transition duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </motion.button>
                  </motion.div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-2 bg-gray-200">
                    <motion.div 
                      className="h-full bg-indigo-600" 
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Tabbed Content */}
              <motion.div 
                className="w-full lg:w-2/5 flex flex-col"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex mb-4 overflow-x-auto">
                  <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={Info}>Overview</TabButton>
                  <TabButton active={activeTab === 'technologies'} onClick={() => setActiveTab('technologies')} icon={Code}>Tech</TabButton>
                  <TabButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={Image}>Gallery</TabButton>
                  <TabButton active={activeTab === 'explainer'} onClick={() => setActiveTab('explainer')} icon={MessageCircle}>Explainer</TabButton>
                </div>

                <motion.div 
                  className="bg-white p-4 sm:p-6 rounded-b-lg flex-grow overflow-y-auto"
                  style={{ maxHeight: '400px' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-indigo-700">Project Overview</h3>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">{project.description}</p>
                        <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-indigo-600">Key Features</h4>
                        <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                          {project.features.map((feature, index) => (
                            <motion.li 
                              key={index} 
                              className="text-sm sm:text-base text-gray-700"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              {feature}
                            </motion.li>
                          ))}
                        </ul>
                        </motion.div>
                    )}

                    {activeTab === 'technologies' && (
                      <motion.div
                        key="technologies"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-indigo-700">Technologies Used</h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {project.technologies.map((tech, index) => (
                            <motion.span 
                              key={index} 
                              className="bg-indigo-100 text-indigo-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.05, backgroundColor: "#818cf8", color: "#ffffff" }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'gallery' && (
                      <motion.div
                        key="gallery"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-indigo-700">Project Gallery</h3>
                        <div className="relative h-48 sm:h-64">
                          <motion.img 
                            src={project.images[currentImageIndex]} 
                            alt={`Project image ${currentImageIndex + 1}`} 
                            className="w-full h-full object-cover rounded-lg"
                            key={currentImageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                          <motion.button 
                            onClick={prevImage} 
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-1 sm:p-2 rounded-full shadow-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ChevronLeft size={20} />
                          </motion.button>
                          <motion.button 
                            onClick={nextImage} 
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1 sm:p-2 rounded-full shadow-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ChevronRight size={20} />
                          </motion.button>
                        </div>
                        <p className="text-center mt-2 text-sm text-gray-600">
                          Image {currentImageIndex + 1} of {project.images.length}
                        </p>
                      </motion.div>
                    )}

                    {activeTab === 'explainer' && (
                      <motion.div
                        key="explainer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-indigo-700">Project Explainer</h3>
                        {isLoading ? (
                          <div className="flex justify-center items-center h-32">
                            <Loader className="animate-spin text-indigo-600" size={32} />
                          </div>
                        ) : (
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{explanation}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {project.liveDemo && (
                <motion.a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center bg-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 text-center text-sm sm:text-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink size={20} className="mr-2 sm:mr-3" />
                  View Live Demo
                </motion.a>
              )}
              {project.sourceCode && (
                <motion.a
                  href={project.sourceCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center bg-gray-200 text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-300 transition duration-300 text-center text-sm sm:text-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Code size={20} className="mr-2 sm:mr-3" />
                  View Source Code
                </motion.a>
              )}
            </motion.div>

            {/* Jumping Explainer Button */}
            <motion.button
              className="absolute bottom-4 right-4 bg-indigo-600 text-white p-3 sm:p-4 rounded-full shadow-lg z-10"
              onClick={toggleExplainer}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                y: explainerVisible ? [0, -20, 0] : 0,
              }}
              transition={{
                duration: 0.5,
                repeat: explainerVisible ? Infinity : 0,
                repeatType: "reverse",
              }}
            >
              <MessageCircle size={24} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectPopup;
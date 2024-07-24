import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, ChevronUp, Filter, RefreshCw, ExternalLink, Code } from 'lucide-react';
import ProjectPopup from './ProjectPopup'; // Make sure to import the ProjectPopup component

// Demo projects data (same as in the previous code)
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
    image: "/images/whatsapp (1).svg",
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

const ProjectCard = ({ project, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer h-full flex flex-col transform transition-all duration-300"
      whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
      onClick={() => onClick(project.id)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        <img src={project.image} alt={project.title} className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 transform hover:scale-110" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 transition-opacity duration-300"
          animate={{ opacity: isHovered ? 0.7 : 0 }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
          <p className="text-sm">{project.description}</p>
        </motion.div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <motion.span
              key={index}
              className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
              whileHover={{ scale: 1.05, backgroundColor: "#818cf8", color: "#ffffff" }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
        <div className="mt-auto flex justify-between">
          {project.liveDemo && (
            <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center" onClick={(e) => e.stopPropagation()}>
              <ExternalLink size={16} className="mr-1" />
              Live Demo
            </a>
          )}
          {project.sourceCode && (
            <a href={project.sourceCode} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 flex items-center" onClick={(e) => e.stopPropagation()}>
              <Code size={16} className="mr-1" />
              Source Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const [filteredProjects, setFilteredProjects] = useState(demoProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const allTechnologies = ['All', ...new Set(demoProjects.flatMap(project => project.technologies))];

  useEffect(() => {
    const results = demoProjects.filter(project =>
      (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedTech === 'All' || project.technologies.includes(selectedTech))
    );
    setFilteredProjects(results);
  }, [searchTerm, selectedTech]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTech('All');
  };

  const handleProjectClick = (projectId) => {
    setSelectedProject(projectId);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="bg-gradient-to-b from-white to-indigo-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-12"
        >
          Featured Projects
        </motion.h2>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg shadow-sm transition-all duration-300 focus:shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            {searchTerm && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                onClick={() => setSearchTerm('')}
              >
                <X size={20} />
              </button>
            )}
          </div>
          <div className="flex justify-between items-center mb-4">
            <motion.button
              className="flex items-center text-indigo-600 font-medium bg-indigo-100 px-4 py-2 rounded-full transition-all duration-300 hover:bg-indigo-200"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="mr-2" size={20} />
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </motion.button>
            <motion.button
              className="flex items-center text-gray-600 font-medium bg-gray-100 px-4 py-2 rounded-full transition-all duration-300 hover:bg-gray-200"
              onClick={resetFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="mr-2" size={20} />
              Reset Filters
            </motion.button>
          </div>
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap justify-center gap-4 py-4">
                  {allTechnologies.map((tech) => (
                    <motion.button
                      key={tech}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedTech === tech ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                      onClick={() => setSelectedTech(tech)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tech}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard
                  project={project}
                  onClick={handleProjectClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <p className="text-2xl text-gray-600 mb-4">No projects found.</p>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
            <motion.button
              className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium transition-all duration-300 hover:bg-indigo-700"
              onClick={resetFilters}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}

        {/* Project Popup */}
        <ProjectPopup
          projectId={selectedProject}
          isOpen={isPopupOpen}
          onClose={closePopup}
        />
      </div>
    </section>
  );
};

export default ProjectsSection;





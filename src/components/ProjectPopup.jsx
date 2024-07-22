import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play, Pause, ChevronLeft, ChevronRight, Code, Star } from 'lucide-react';

const TabButton = ({ active, children, onClick, icon: Icon }) => (
  <motion.button
    className={`px-6 py-3 font-semibold rounded-t-lg flex items-center ${
      active ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'bg-gray-100 text-gray-600'
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon className="mr-2" size={18} />
    {children}
  </motion.button>
);

const ProjectPopup = ({ project, isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-8 w-full max-w-7xl max-h-90vh overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <motion.h2 
                className="text-4xl font-bold text-indigo-800"
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
                <X size={28} />
              </motion.button>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left side - Video Player */}
              <motion.div 
                className="lg:w-3/5"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ width: '100%', height: '400px' }}>
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
                      className="text-white p-4 rounded-full bg-indigo-600 hover:bg-indigo-700 transition duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                    </motion.button>
                  </motion.div>
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200">
                    <motion.div 
                      className="h-full bg-indigo-600" 
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Right side - Tabbed Content */}
              <motion.div 
                className="lg:w-2/5 flex flex-col"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex mb-4">
                  <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={Star}>Overview</TabButton>
                  <TabButton active={activeTab === 'technologies'} onClick={() => setActiveTab('technologies')} icon={Code}>Technologies</TabButton>
                  <TabButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={ChevronRight}>Gallery</TabButton>
                </div>

                <motion.div 
                  className="bg-white p-6 rounded-b-lg flex-grow overflow-y-auto"
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
                        <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Project Overview</h3>
                        <p className="text-gray-700 leading-relaxed mb-6">{project.description}</p>
                        <h4 className="text-xl font-semibold mb-3 text-indigo-600">Key Features</h4>
                        <ul className="list-disc list-inside space-y-2">
                          {project.features.map((feature, index) => (
                            <motion.li 
                              key={index} 
                              className="text-gray-700"
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
                        <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Technologies Used</h3>
                        <div className="flex flex-wrap gap-3">
                          {project.technologies.map((tech, index) => (
                            <motion.span 
                              key={index} 
                              className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full"
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
                        <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Project Gallery</h3>
                        <div className="relative h-64">
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
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ChevronLeft size={24} />
                          </motion.button>
                          <motion.button 
                            onClick={nextImage} 
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ChevronRight size={24} />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mt-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {project.liveDemo && (
                <motion.a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 text-center text-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink size={24} className="mr-3" />
                  View Live Demo
                </motion.a>
              )}
              {project.sourceCode && (
                <motion.a
                  href={project.sourceCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center bg-gray-200 text-gray-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-300 transition duration-300 text-center text-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Code size={24} className="mr-3" />
                  View Source Code
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectPopup;
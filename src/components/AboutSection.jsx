import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload, FaQuoteLeft, FaTimes, FaBriefcase, FaUser, FaStar } from 'react-icons/fa';

const TabButton = ({ active, children, onClick, icon: Icon }) => (
  <motion.button
    className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 flex items-center ${
      active ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <Icon className="mr-2" />
    {children}
  </motion.button>
);

const ExperiencePopup = ({ experience, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-lg p-8 max-w-2xl w-full m-4 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-bold text-indigo-600">{experience.title}</h3>
        <motion.button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaTimes size={24} />
        </motion.button>
      </div>
      <p className="text-xl text-indigo-500 mb-2">{experience.company}</p>
      <p className="text-gray-600 mb-6">{experience.year}</p>
      <h4 className="text-2xl font-semibold mb-4">Responsibilities:</h4>
      <ul className="list-disc list-inside mb-6 space-y-2">
        {experience.responsibilities.map((resp, index) => (
          <li key={index} className="text-gray-700">{resp}</li>
        ))}
      </ul>
      <h4 className="text-2xl font-semibold mb-4">Achievements:</h4>
      <ul className="list-disc list-inside space-y-2">
        {experience.achievements.map((achievement, index) => (
          <li key={index} className="text-gray-700">{achievement}</li>
        ))}
      </ul>
    </motion.div>
  </motion.div>
);

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState('bio');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedExperience, setSelectedExperience] = useState(null);

  const tabs = [
    { id: 'bio', label: 'Bio', icon: FaUser },
    { id: 'experience', label: 'Experience', icon: FaBriefcase },
    { id: 'testimonials', label: 'Testimonials', icon: FaStar }
  ];

  const experiences = [
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
        "Developed and deployed 3 full-stack applications, increasing team productivity by 25%",
        "Optimized database queries, reducing load times by 40%"
      ]
    },
  ];

  const testimonials = [
    { text: "An exceptional developer with a keen eye for detail. Always delivers high-quality work.", author: "Jane Doe, Project Manager" },
    { text: "Innovative problem-solver and a pleasure to work with. Highly recommended!", author: "John Smith, CTO" },
    { text: "Consistently exceeds expectations. A true asset to any development team.", author: "Alice Johnson, Senior Developer" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-indigo-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-5xl font-bold text-center text-gray-800 mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Me
        </motion.h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center space-x-4 mb-12">
            {tabs.map((tab) => (
              <TabButton 
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
              >
                {tab.label}
              </TabButton>
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              {activeTab === 'bio' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-3xl font-semibold text-indigo-600 mb-6">Hello, I'm Aditya Choudhary</h3>
                  <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                    I'm a passionate web developer and machine learning enthusiast with a keen eye for creating intuitive and dynamic user experiences. With a strong foundation in both front-end and back-end technologies, I love bringing ideas to life in the digital world. My expertise spans across the MERN stack, and I'm always eager to learn and apply new technologies to solve complex problems.
                  </p>
                  <motion.a 
                    href="/images/Aditya_Choudhary (1).pdf" 
                    className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300 inline-flex items-center"
                    whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaDownload className="mr-3" />
                    Download Resume
                  </motion.a>
                </motion.div>
              )}
              
              {activeTab === 'experience' && (
                <div>
                  <h3 className="text-3xl font-semibold text-indigo-600 mb-8">Work Experience</h3>
                  <div className="relative pl-8 pb-8 border-l-2 border-indigo-300">
                    {experiences.map((exp, index) => (
                      <motion.div 
                        key={index} 
                        className="mb-10 relative cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedExperience(exp)}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="absolute -left-10 top-0 w-6 h-6 bg-indigo-600 rounded-full shadow-md" />
                        <h4 className="text-2xl font-semibold text-gray-800 mb-2">{exp.title}</h4>
                        <p className="text-xl text-indigo-600 mb-1">{exp.company}</p>
                        <p className="text-gray-600">{exp.year}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'testimonials' && (
                <div>
                  <h3 className="text-3xl font-semibold text-indigo-600 mb-8">What People Say</h3>
                  <div className="relative">
                    <FaQuoteLeft className="text-6xl text-indigo-200 absolute top-0 left-0" />
                    <div className="pl-16 pt-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentTestimonial}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                        >
                          <p className="text-gray-700 mb-6 italic text-xl leading-relaxed">{testimonials[currentTestimonial].text}</p>
                          <p className="text-indigo-600 font-semibold text-lg">{testimonials[currentTestimonial].author}</p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div className="flex justify-center mt-8">
                      {testimonials.map((_, index) => (
                        <motion.button 
                          key={index}
                          className={`w-4 h-4 rounded-full mx-2 ${currentTestimonial === index ? 'bg-indigo-600' : 'bg-gray-300'}`}
                          onClick={() => setCurrentTestimonial(index)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {selectedExperience && (
          <ExperiencePopup
            experience={selectedExperience}
            onClose={() => setSelectedExperience(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default AboutSection;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCode, HiDatabase, HiCog, HiChip, HiLightBulb, HiGlobe, HiArrowRight } from 'react-icons/hi';

const SkillTag = ({ name, level }) => (
  <motion.span
    className="bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full inline-flex items-center"
    whileHover={{ scale: 1.1, backgroundColor: "#818cf8", color: "#ffffff" }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
  >
    {name}
    <span className="ml-2 w-2 h-2 rounded-full bg-indigo-500" style={{ opacity: level / 100 }}></span>
  </motion.span>
);

const SkillCard = ({ icon: Icon, title, skills, description }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer perspective h-full"
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: 180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            <div className="flex items-center mb-4">
              <Icon className="text-4xl text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            </div>
            <p className="text-gray-600 mb-4 flex-grow">{description}</p>
            <div className="flex flex-wrap mt-auto">
              {skills.slice(0, 3).map((skill, index) => (
                <SkillTag key={index} name={skill.name} level={skill.level} />
              ))}
              {skills.length > 3 && (
                <motion.button 
                  className="text-indigo-600 font-medium flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(true);
                  }}
                >
                  +{skills.length - 3} more
                  <HiArrowRight className="ml-1" />
                </motion.button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: -180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -180, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{title} Skills</h3>
            <ul className="space-y-3 flex-grow">
              {skills.map((skill, index) => (
                <motion.li 
                  key={index} 
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700 font-medium">{skill.name}</span>
                    <span className="text-indigo-600 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                      className="bg-indigo-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    ></motion.div>
                  </div>
                </motion.li>
              ))}
            </ul>
            <motion.button
              className="mt-4 text-indigo-600 font-medium flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
            >
              Back to Overview
              <HiArrowRight className="ml-1 transform rotate-180" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SkillsSection = () => {
  const [filter, setFilter] = useState('All');
  const [animateFilter, setAnimateFilter] = useState(false);

  const skillsData = [
    {
      icon: HiCode,
      title: "Front-end Development",
      description: "Creating responsive and intuitive user interfaces with modern web technologies.",
      skills: [
        { name: "HTML5", level: 90 },
        { name: "CSS3", level: 90 },
        { name: "JavaScript", level: 85 },
        { name: "React", level: 75 },
        { name: "Tailwind CSS", level: 80 },
      ],
      category: "Development"
    },
    {
      icon: HiDatabase,
      title: "Back-end Development",
      description: "Building robust server-side applications and APIs to power web applications.",
      skills: [
        { name: "Node.js", level: 80 },
        { name: "Python", level: 90 },
        { name: "SQL", level: 75 },
        { name: "MongoDB", level: 70 },
        { name: "Express.js", level: 80 },
        { name: "Django", level: 70 },
      ],
      category: "Development"
    },
    {
      icon: HiCog,
      title: "DevOps & Tools",
      description: "Streamlining development processes and ensuring smooth deployment and operation.",
      skills: [
        { name: "Git", level: 85 },
        { name: "AWS", level: 75 },
        { name: "Docker", level: 70 },
        { name: "CI/CD", level: 80 },
      ],
      category: "DevOps"
    },
    {
      icon: HiChip,
      title: "Machine Learning",
      description: "Exploring and implementing cutting-edge technologies to stay ahead of the curve.",
      skills: [
        { name: "Machine Learning", level: 95 },
        { name: "Deep Learning", level: 85},
        { name: "NLP", level: 90},
        { name: "LLM", level: 80}
      ],
      category: "Emerging"
    },
    {
      icon: HiLightBulb,
      title: "Soft Skills",
      description: "Complementing technical skills with essential professional attributes.",
      skills: [
        { name: "Problem Solving", level: 90 },
        { name: "Team Collaboration", level: 95 },
        { name: "Agile Methodologies", level: 85 },
        { name: "Technical Writing", level: 80 },
        { name: "Mentoring", level: 85 }
      ],
      category: "Soft Skills"
    },
  ];

  const filteredSkills = filter === 'All' ? skillsData : skillsData.filter(skill => skill.category === filter);

  useEffect(() => {
    setAnimateFilter(true);
    const timer = setTimeout(() => setAnimateFilter(false), 500);
    return () => clearTimeout(timer);
  }, [filter]);

  return (
    <section id="skills" className="bg-gradient-to-b from-indigo-50 to-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold text-gray-800 mb-6">My Skillset</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Combining a diverse range of technical skills with a passion for innovation and problem-solving to deliver exceptional web solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {['All', 'Development', 'DevOps', 'Emerging', 'Soft Skills'].map((category) => (
              <motion.button
                key={category}
                className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${filter === category ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                onClick={() => setFilter(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <AnimatePresence mode="wait">
            {filteredSkills.map((category, index) => (
              <motion.div
                key={category.title}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <SkillCard {...category} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {animateFilter && (
          <motion.div
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            Filtered by: {filter}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
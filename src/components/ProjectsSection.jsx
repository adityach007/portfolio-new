import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, ChevronUp, Filter, RefreshCw, ExternalLink } from 'lucide-react';


const ProjectCard = ({ project, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer h-full flex flex-col transform transition-all duration-300"
      whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
      onClick={() => onClick(project)}
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
              {/* <FaGitHub size={16} className="mr-1" /> */}
              Source Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection = ({ projects, handleProjectClick }) => {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const allTechnologies = ['All', ...new Set(projects.flatMap(project => project.technologies))];

  useEffect(() => {
    const results = projects.filter(project =>
      (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedTech === 'All' || project.technologies.includes(selectedTech))
    );
    setFilteredProjects(results);
  }, [searchTerm, selectedTech, projects]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTech('All');
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
      </div>
    </section>
  );
};

export default ProjectsSection;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, ChevronUp, Filter, RefreshCw } from 'lucide-react';

const ProjectCard = ({ project, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-full flex flex-col"
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      onClick={() => onClick(project)}
      layout
    >
      <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
        <motion.div
          className={`text-gray-600 mb-4 ${isExpanded ? '' : 'line-clamp-3'}`}
          animate={{ height: isExpanded ? 'auto' : '4.5em' }}
        >
          {project.description}
        </motion.div>
        <motion.button
          className="text-indigo-600 font-medium flex items-center mb-4"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? 'Read less' : 'Read more'}
          {isExpanded ? <ChevronUp className="ml-1" size={16} /> : <ChevronDown className="ml-1" size={16} />}
        </motion.button>
        <div className="flex flex-wrap gap-2 mt-auto">
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
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-center text-gray-800 mb-12"
        >
          Featured Projects
        </motion.h2>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm('')}
              >
                <X size={20} />
              </button>
            )}
          </div>
          <div className="flex justify-between items-center mb-4">
            <motion.button
              className="flex items-center text-indigo-600 font-medium"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="mr-2" size={20} />
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </motion.button>
            <motion.button
              className="flex items-center text-gray-600 font-medium"
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
                      className={`px-4 py-2 rounded-full text-sm font-medium ${selectedTech === tech ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            <motion.button
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full font-medium"
              onClick={resetFilters}
              whileHover={{ scale: 1.05 }}
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
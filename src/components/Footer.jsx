import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const githubLink = "https://github.com/Adityach007/";
  const linkedinLink = "https://www.linkedin.com/in/adityachoudhary007/";
  const email = "panwaraditya366@gmail.com";

  const socialLinks = [
    { Icon: FaGithub, href: githubLink, label: "GitHub Profile" },
    { Icon: FaLinkedin, href: linkedinLink, label: "LinkedIn Profile" },
    { Icon: FaEnvelope, href: `mailto:${email}`, label: "Email Contact" }
  ];

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6 text-center">
        <p className="text-lg mb-4">&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mb-8">
          {socialLinks.map(({ Icon, href, label }, index) => (
            <motion.a 
              key={index}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-indigo-400 transition duration-300"
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon size={24} />
            </motion.a>
          ))}
        </div>
        <p className="text-sm text-gray-400">Designed and built with ❤️ </p>
      </div>
    </footer>
  );
};

export default Footer;
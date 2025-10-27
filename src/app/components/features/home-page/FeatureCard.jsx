'use client'

import React from 'react'
import { motion } from 'framer-motion'

const FeatureCard = ({ title, description, image }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{
        duration: 0.5,
        hover: { duration: 0.3, type: "spring", stiffness: 300 }
      }}
      viewport={{ once: true }}
      className="feature-card relative overflow-hidden w-full max-w-sm mx-auto h-80 md:h-96 cursor-pointer group"
    >
      {/* Decorative corner shapes */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-green-300 to-green-400 rounded-full opacity-80 z-10 group-hover:scale-125 transition-transform duration-300"></div>
      <div className="absolute top-2 right-2 w-4 h-4 bg-gradient-to-br from-black to-black rounded-full opacity-60 z-10 group-hover:rotate-45 transition-transform duration-300"></div>

      {/* Image Container with rounded corners */}
      <div className="absolute inset-4 rounded-2xl overflow-hidden">
        {image ? (
          <img
            src={`/images/${image}`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 via-green-500 to-blue-500 flex items-center justify-center">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="text-white w-16 h-16"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </motion.div>
          </div>
        )}
      </div>

      {/* Gentle gradient overlay */}
      <div className="absolute inset-4 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent z-20"></div>

      {/* Title Section - Always visible */}
      <div className="absolute bottom-4 left-4 right-4 z-30">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-green-100">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 text-center font-cairo" lang="ar">
            {title}
          </h3>
          <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
        </div>
      </div>

      {/* Interactive Hover Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        className="hover-overlay absolute inset-0 bg-gradient-to-br from-green-500/95 via-green-600/95 to-blue-600/95 rounded-3xl flex flex-col justify-center items-center p-6 text-white z-40 opacity-0 group-hover:opacity-100"
      >
        {/* Fun icon with bounce animation */}
        <motion.div
          whileHover={{
            scale: 1.2,
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.5 }
          }}
          className="w-16 h-16 mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            className="w-8 h-8 text-green-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </motion.div>

        {/* Title with fun styling */}
        <h3 className="text-xl md:text-2xl font-bold text-center mb-4 font-cairo" lang="ar">
          {title}
        </h3>

        {/* Colorful divider */}
        <div className="w-16 h-1 bg-gradient-to-r from-green-300 to-black rounded-full mb-6"></div>

        {/* Description */}
        <p className="text-white/90 text-center leading-relaxed text-sm md:text-base max-w-xs font-medium font-cairo" lang="ar">
          {description}
        </p>

      </motion.div>

      <style jsx>{`
        .feature-card {
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
          border: 2px solid transparent;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .feature-card:hover {
          border-color: rgba(16, 185, 129, 0.3);
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25);
        }

        /* Mobile touch interactions */
        @media (hover: none) and (pointer: coarse) {
          .feature-card {
            transform: none;
          }
          
          .feature-card:active {
            transform: scale(0.98);
          }
          
          .feature-card:active .hover-overlay {
            opacity: 1 !important;
            transform: scale(1) !important;
          }
          
          /* Touch indicator */
          .feature-card::after {
            content: '👆';
            position: absolute;
            top: 8px;
            left: 8px;
            font-size: 20px;
            z-index: 50;
            opacity: 0.8;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
        }

        /* Keyboard accessibility */
        .feature-card:focus-visible {
          outline: 3px solid #10b981;
          outline-offset: 2px;
          border-color: #10b981;
        }

        .feature-card:focus-visible .hover-overlay {
          opacity: 1 !important;
          transform: scale(1) !important;
        }

        /* Enhanced text readability */
        .feature-card h3 {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .hover-overlay * {
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        /* Responsive height adjustments */
        @media (max-width: 640px) {
          .feature-card {
            height: 18rem;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .feature-card {
            height: 22rem;
          }
        }

        /* Smooth performance optimizations */
        .feature-card,
        .hover-overlay {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </motion.div>
  )
}

export default FeatureCard
'use client'

import { useState, useEffect } from 'react';

export default function DashboardHeader() {
  // Ces données seraient normalement récupérées depuis une API
  const [stats, setStats] = useState({
    courses: 0,
    lessons: 0,
    specializations: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler une charge de données
    setTimeout(() => {
      setStats({
        courses: 12,
        lessons: 48,
        specializations: 5,
        users: 150
      });
      setLoading(false);
    }, 1000);
  }, []);

  const statsItems = [
    {
      title: 'Cours',
      value: stats.courses,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      ),
      color: 'bg-blue-100',
      link: '/dashboard/courses'
    },
    {
      title: 'Leçons',
      value: stats.lessons,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
      color: 'bg-green-100',
      link: '/dashboard/lessons'
    },
    {
      title: 'Filiéres',
      value: stats.specializations,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      color: 'bg-indigo-100',
      link: '/dashboard/specializations'
    },
    {
      title: 'Utilisateurs',
      value: stats.users,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a4 4 0 00-3-3.87M7 15h2v1H7v-1z" />
        </svg>
      ),
      color: 'bg-red-100',
      link: '/dashboard/users'
    },
  ];

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue dans votre plateforme éducative</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsItems.map((item, index) => (
          <a 
            key={index} 
            href={item.link}
            className={`${item.color} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium">{item.title}</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-3xl font-bold mt-1">{item.value}</p>
                )}
              </div>
              <div>
                {item.icon}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useYearOfStudy } from "../hooks/useYearOfStudy";
import { useSpecializations } from "../hooks/useSpecializations";
import { useStudyModules } from "../hooks/useStudyModules";
import { useCourses } from "../hooks/useCourses";
import { useLessons } from "../hooks/useLessons";

export default function EducationHierarchy() {
  const [yearsOfStudy, setYearsOfStudy] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [studyModules, setStudyModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [expandedYears, setExpandedYears] = useState({});
  const [expandedSpecs, setExpandedSpecs] = useState({});
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedCourses, setExpandedCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getAllYearOfStudies } = useYearOfStudy();
  const { getAllSpecializations } = useSpecializations();
  const { getAllStudyModules } = useStudyModules();
  const { getAllCourses } = useCourses();
  const { getAllLessons } = useLessons();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [
          yearsData,
          specializationsData,
          modulesData,
          coursesData,
          lessonsData,
        ] = await Promise.all([
          getAllYearOfStudies(),
          getAllSpecializations(),
          getAllStudyModules(),
          getAllCourses(),
          getAllLessons(),
        ]);

        setYearsOfStudy(yearsData || []);
        setSpecializations(specializationsData || []);
        setStudyModules(modulesData || []);
        setCourses(coursesData || []);
        setLessons(lessonsData || []);
      } catch (err) {
        console.error("Error fetching hierarchy data:", err);
        setError(
          err.message ||
            "Une erreur est survenue lors du chargement des données"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    getAllYearOfStudies,
    getAllSpecializations,
    getAllStudyModules,
    getAllCourses,
    getAllLessons,
  ]);

  const toggleYear = (yearId) => {
    setExpandedYears((prev) => ({
      ...prev,
      [yearId]: !prev[yearId],
    }));
  };

  const toggleSpec = (specId) => {
    setExpandedSpecs((prev) => ({
      ...prev,
      [specId]: !prev[specId],
    }));
  };

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const toggleCourse = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  // Filter specializations by year of study
  const getSpecializationsByYear = (yearId) => {
    return specializations.filter((spec) => spec.yearOfStudyId === yearId);
  };

  // Filter study modules by specialization
  const getModulesBySpecialization = (specId) => {
    return studyModules.filter((module) => {
      if (Array.isArray(module.specializationIds)) {
        return module.specializationIds.includes(specId);
      }
      return module.specializationId === specId;
    });
  };

  // Filter courses by study module
  const getCoursesByModule = (moduleId) => {
    return courses.filter((course) => course.studyModuleId === moduleId);
  };

  // Filter lessons by course
  const getLessonsByCourse = (courseId) => {
    return lessons.filter((lesson) => lesson.courseId === courseId);
  };

  // Get linked elements count
  const getLinkedSpecializationsCount = (yearId) => {
    return specializations.filter((spec) => spec.yearOfStudyId === yearId)
      .length;
  };

  const getLinkedModulesCount = (specId) => {
    return studyModules.filter((module) => {
      if (Array.isArray(module.specializationIds)) {
        return module.specializationIds.includes(specId);
      }
      return module.specializationId === specId;
    }).length;
  };

  const getLinkedCoursesCount = (moduleId) => {
    return courses.filter((course) => course.studyModuleId === moduleId).length;
  };

  const getLinkedLessonsCount = (courseId) => {
    return lessons.filter((lesson) => lesson.courseId === courseId).length;
  };

  if (loading)
    return (
      <div className="p-4">
        Chargement de la hiérarchie des données éducatives...
      </div>
    );
  if (error) return <div className="p-4 text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">
        Structure Hiérarchique du Programme
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {yearsOfStudy.length > 0 ? (
          <ul className="space-y-4">
            {yearsOfStudy.map((year) => (
              <li
                key={year.id}
                className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow duration-200"
              >
                <div
                  className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer"
                  onClick={() => toggleYear(year.id)}
                >
                  <div className="flex items-center">
                    <span
                      className={`transform transition-transform duration-200 ${
                        expandedYears[year.id] ? "rotate-90" : ""
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <div className="ml-2">
                      <h3 className="font-semibold text-lg">{year.title}</h3>
                      {year.description && (
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {year.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {getLinkedSpecializationsCount(year.id)} filiére(s)
                    </span>
                    <Link
                      href={`/dashboard/year-of-study/${year.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Voir les détails
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>

                {expandedYears[year.id] && (
                  <div className="p-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-700">
                        Filiéres
                      </h3>
                      <Link
                        href={`/dashboard/specializations/new?yearOfStudyId=${year.id}`}
                        className="text-sm text-green-600 hover:text-green-800 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Ajouter
                      </Link>
                    </div>

                    {getSpecializationsByYear(year.id).length > 0 ? (
                      <div className="space-y-3 ml-6">
                        {getSpecializationsByYear(year.id).map((spec) => (
                          <div
                            key={spec.id}
                            className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow duration-200"
                          >
                            <div
                              className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                              onClick={() => toggleSpec(spec.id)}
                            >
                              <div className="flex items-center">
                                <span
                                  className={`transform transition-transform duration-200 ${
                                    expandedSpecs[spec.id] ? "rotate-90" : ""
                                  }`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-gray-600"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                                <div className="ml-2">
                                  <h4 className="font-medium">{spec.title}</h4>
                                  {spec.description && (
                                    <p className="text-xs text-gray-600 line-clamp-1">
                                      {spec.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                  {spec.studyModules.length} module(s)
                                </span>
                                <Link
                                  href={`/specialization/${spec.id}`}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Voir les détails
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 ml-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </Link>
                              </div>
                            </div>

                            {expandedSpecs[spec.id] && (
                              <div className="p-3 border-t">
                                <h5 className="font-medium text-gray-700 text-sm mb-2">
                                  Matiéres
                                </h5>
                                {spec.studyModules.length > 0 ? (
                                  <ul className="space-y-2 ml-6">
                                    {spec.studyModules.map(
                                      ({ studyModule }) => (
                                        <li
                                          key={studyModule.id}
                                          className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50"
                                        >
                                          <span className="text-sm">
                                            {studyModule.title}
                                          </span>
                                          <Link
                                            href={`/dashboard/study-modules/${studyModule.id}`}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                          >
                                            Voir les détails
                                          </Link>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  <p className="text-gray-500 text-xs">
                                    Aucun module d'étude dans cette
                                    filiére
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-gray-500 text-sm mb-3">
                          Aucune filiére dans cette année d'étude
                        </p>
                        <Link
                          href={`/dashboard/specializations/new?yearOfStudyId=${year.id}`}
                          className="inline-flex items-center text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Créer une filiére
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Aucune structure pédagogique définie
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Pour commencer, vous devez créer des années d'étude, puis des
              filiéres, des Matiéres et des cours.
            </p>
            <div className="space-x-4">
              <Link
                href="/dashboard/year-of-study/new"
                className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Créer une année d'étude
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

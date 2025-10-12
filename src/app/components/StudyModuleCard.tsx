'use client'

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { BookOpen, Target, Award } from 'lucide-react';
import { getDisplayText } from '../../lib/translation-helpers';
import { Locale } from '../../types/api';

// Updated ModuleIcon component to handle both iconId and icon.url
const ModuleIcon = ({ 
  iconId, 
  colorHex, 
  icon, 
  className = "w-6 h-6",
  containerSize = "w-12 h-12"
}: { 
  iconId: number | null; 
  colorHex: string | null; 
  icon?: any;
  className?: string;
  containerSize?: string;
}) => {
  // If we have an icon object with URL, use the SVG
  if (icon?.url) {
    // Replace the minio URL with the correct AWS URL
    const correctedUrl = icon.url.replace(
      'http://aidaki-minio:9000',
      'http://ec2-54-226-40-236.compute-1.amazonaws.com:9000'
    );
    
    return (
      <div 
        className={`${containerSize} rounded-lg flex items-center justify-center p-2`}
        style={{ backgroundColor: colorHex || '#6366f1' }}
      >
        <img 
          src={correctedUrl} 
          alt="Module icon"
          className={`${className} object-contain filter brightness-0 invert`}
          style={{ 
            filter: 'brightness(0) invert(1)' // Makes SVG white
          }}
        />
      </div>
    );
  }

  // Fallback to iconId mapping or default icon
  const getIconComponent = (id: number | null) => {
    switch (id) {
      case 1:
        return <BookOpen className={className} />;
      case 2:
        return <Target className={className} />;
      case 3:
        return <Award className={className} />;
      default:
        return <BookOpen className={className} />;
    }
  };

  return (
    <div 
      className={`${containerSize} rounded-lg flex items-center justify-center text-white`}
      style={{ backgroundColor: colorHex || '#6366f1' }}
    >
      {getIconComponent(iconId)}
    </div>
  );
};

export const StudyModuleCard = ({ 
  studyModule, 
  index, 
  locale,
  size = 'default' 
}: { 
  studyModule: any; 
  index: number; 
  locale: string;
  size?: 'default' | 'compact';
}) => {
  const currentLocale = useLocale() as Locale;
  const module = studyModule.studyModule || studyModule;
  
  const displayTitle = getDisplayText(module, 'title', currentLocale);
  const displayDescription = getDisplayText(module, 'description', currentLocale);
  const moduleColor = module.colorHex || '#6366f1';
  
  // Create a light background color from the module color
  const lightBgColor = moduleColor + '20'; // Add transparency

  const isCompact = size === 'compact';

  return (
    <Link
      href={`/${locale}/dashboard/study-modules/${module.id}/overview`}
      className={`block bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer ${
        isCompact ? 'min-h-[160px]' : 'min-h-[200px]'
      }`}
    >
      <div className={`p-6 text-center flex flex-col justify-center ${
        isCompact ? 'min-h-[160px]' : 'min-h-[200px]'
      }`}>
        {/* Icon with circular background */}
        <div className="flex justify-center mb-4">
          <div 
            className={`${
              isCompact ? 'w-12 h-12' : 'w-16 h-16'
            } rounded-full flex items-center justify-center`}
            style={{ backgroundColor: lightBgColor }}
          >
            {module.icon?.url ? (
              <img 
                src={module.icon.url.replace(
                  'http://aidaki-minio:9000',
                  'http://ec2-54-226-40-236.compute-1.amazonaws.com:9000'
                )} 
                alt="Module icon"
                className={`${
                  isCompact ? 'w-6 h-6' : 'w-8 h-8'
                } object-contain`}
                style={{ filter: `brightness(0) saturate(100%)`, color: moduleColor }}
              />
            ) : (
              <div style={{ color: moduleColor }}>
                {(() => {
                  switch (module.iconId) {
                    case 1:
                      return <BookOpen className={isCompact ? 'w-6 h-6' : 'w-8 h-8'} />;
                    case 2:
                      return <Target className={isCompact ? 'w-6 h-6' : 'w-8 h-8'} />;
                    case 3:
                      return <Award className={isCompact ? 'w-6 h-6' : 'w-8 h-8'} />;
                    default:
                      return <BookOpen className={isCompact ? 'w-6 h-6' : 'w-8 h-8'} />;
                  }
                })()}
              </div>
            )}
          </div>
        </div>
        
        {/* Module name */}
        <h3 
          className={`text-center ${
            isCompact ? 'text-base' : 'text-lg'
          } font-semibold mb-2`}
          style={{ color: moduleColor }}
        >
          {displayTitle}
        </h3>

        {/* Module description */}
        {displayDescription && !isCompact && (
          <p className="text-center text-gray-500 text-sm">
            {displayDescription}
          </p>
        )}
      </div>
    </Link>
  );
};

export default StudyModuleCard;

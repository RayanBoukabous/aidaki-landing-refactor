'use client';

import { ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { Translatable, Locale } from '@/types/api';
import { getDisplayText, getDisplayTexts } from '@/lib/translation-helpers';
import { getTranslatedDirection } from '@/lib/translations';

interface TranslatableItemProps<T extends Translatable> {
  item: T;
  field?: 'title' | 'description';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  fallback?: ReactNode;
}

/**
 * Simple component for displaying a single field from a translatable item
 */
export function TranslatableText<T extends Translatable>({
  item,
  field = 'title',
  className = '',
  as: Component = 'span',
  fallback = null
}: TranslatableItemProps<T>) {
  const locale = useLocale() as Locale;
  const text = getDisplayText(item, field, locale);
  const direction = getTranslatedDirection(item, locale);

  if (!text && fallback) {
    return <>{fallback}</>;
  }

  return (
    <Component className={className} dir={direction}>
      {text}
    </Component>
  );
}

interface TranslatableCardProps<T extends Translatable> {
  item: T;
  titleClassName?: string;
  descriptionClassName?: string;
  titleAs?: keyof JSX.IntrinsicElements;
  descriptionAs?: keyof JSX.IntrinsicElements;
  className?: string;
  children?: ReactNode;
  showDescription?: boolean;
}

/**
 * Card component that displays both title and description
 */
export function TranslatableCard<T extends Translatable>({
  item,
  titleClassName = 'text-lg font-semibold',
  descriptionClassName = 'text-sm text-gray-600',
  titleAs = 'h3',
  descriptionAs = 'p',
  className = '',
  children,
  showDescription = true
}: TranslatableCardProps<T>) {
  const locale = useLocale() as Locale;
  const { title, description } = getDisplayTexts(item, locale);
  const direction = getTranslatedDirection(item, locale);

  return (
    <div className={className} dir={direction}>
      <TranslatableText 
        item={item} 
        field="title" 
        className={titleClassName} 
        as={titleAs}
      />
      {showDescription && description && (
        <TranslatableText 
          item={item} 
          field="description" 
          className={descriptionClassName} 
          as={descriptionAs}
        />
      )}
      {children}
    </div>
  );
}

interface CourseCardProps {
  course: any; // Course type
  onSelect?: (course: any) => void;
  className?: string;
  showEnrollment?: boolean;
}

/**
 * Specialized component for displaying course cards
 */
export function CourseCard({ 
  course, 
  onSelect, 
  className = '', 
  showEnrollment = true 
}: CourseCardProps) {
  const locale = useLocale() as Locale;
  const { title, description } = getDisplayTexts(course, locale);

  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 ${className} ${
        onSelect ? 'cursor-pointer' : ''
      }`}
      onClick={() => onSelect?.(course)}
    >
      <div className="flex justify-between items-start mb-4">
        <TranslatableText 
          item={course} 
          field="title" 
          className="text-xl font-bold text-gray-900"
          as="h3"
        />
        {course.isEnrolled && showEnrollment && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Enrolled
          </span>
        )}
      </div>
      
      <TranslatableText 
        item={course} 
        field="description" 
        className="text-gray-600 mb-4"
        as="p"
      />
      
      {course.specialization && (
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="font-medium">Specialization:</span>
          <TranslatableText 
            item={course.specialization} 
            field="title" 
            className="ml-2"
          />
        </div>
      )}
      
      {course.studyModule && (
        <div className="flex items-center text-sm text-gray-500">
          <span className="font-medium">Module:</span>
          <TranslatableText 
            item={course.studyModule} 
            field="title" 
            className="ml-2"
          />
        </div>
      )}
    </div>
  );
}

interface SpecializationCardProps {
  specialization: any; // Specialization type
  onSelect?: (specialization: any) => void;
  className?: string;
  showModuleCount?: boolean;
}

/**
 * Specialized component for displaying specialization cards
 */
export function SpecializationCard({ 
  specialization, 
  onSelect, 
  className = '',
  showModuleCount = true 
}: SpecializationCardProps) {
  const locale = useLocale() as Locale;

  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 ${className} ${
        onSelect ? 'cursor-pointer' : ''
      }`}
      onClick={() => onSelect?.(specialization)}
    >
      <TranslatableText 
        item={specialization} 
        field="title" 
        className="text-xl font-bold text-gray-900 mb-3"
        as="h3"
      />
      
      <TranslatableText 
        item={specialization} 
        field="description" 
        className="text-gray-600 mb-4"
        as="p"
      />
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        {specialization.yearOfStudy && (
          <div>
            <span className="font-medium">Year:</span>
            <TranslatableText 
              item={specialization.yearOfStudy} 
              field="title" 
              className="ml-1"
            />
          </div>
        )}
        
        {showModuleCount && (
          <div>
            <span className="font-medium">
              {specialization.studyModules?.length || 0} modules
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface LessonCardProps {
  lesson: any; // Lesson type
  onSelect?: (lesson: any) => void;
  className?: string;
  showCourse?: boolean;
}

/**
 * Specialized component for displaying lesson cards
 */
export function LessonCard({ 
  lesson, 
  onSelect, 
  className = '',
  showCourse = false 
}: LessonCardProps) {
  const locale = useLocale() as Locale;

  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 ${className} ${
        onSelect ? 'cursor-pointer' : ''
      }`}
      onClick={() => onSelect?.(lesson)}
    >
      <div className="flex justify-between items-start mb-4">
        <TranslatableText 
          item={lesson} 
          field="title" 
          className="text-xl font-bold text-gray-900"
          as="h3"
        />
        {lesson.isActive && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Active
          </span>
        )}
      </div>
      
      <TranslatableText 
        item={lesson} 
        field="description" 
        className="text-gray-600 mb-4"
        as="p"
      />
      
      {showCourse && lesson.course && (
        <div className="flex items-center text-sm text-gray-500">
          <span className="font-medium">Course:</span>
          <TranslatableText 
            item={lesson.course} 
            field="title" 
            className="ml-2"
          />
        </div>
      )}
    </div>
  );
}

// Hook for easy access to translated text in components
export function useTranslatableText<T extends Translatable>(item: T | null | undefined) {
  const locale = useLocale() as Locale;
  
  if (!item) {
    return { title: '', description: '', direction: 'ltr' as const };
  }
  
  return {
    ...getDisplayTexts(item, locale),
    direction: getTranslatedDirection(item, locale)
  };
}

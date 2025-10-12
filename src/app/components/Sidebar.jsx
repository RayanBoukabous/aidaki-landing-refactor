"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { getNavigationItems, Logo } from "../../lib/navigationData"

// Custom hook to detect direction
const useDirection = () => {
  const [dir, setDir] = useState('ltr');

  useEffect(() => {
    // Check the HTML dir attribute
    const htmlDir = document.documentElement.dir || 'ltr';
    setDir(htmlDir);

    // Observer to watch for changes in dir attribute
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
          setDir(document.documentElement.dir || 'ltr');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir']
    });

    return () => observer.disconnect();
  }, []);

  return { dir };
};

// Custom Popover component for collapsed navigation items
const NavigationPopover = ({ children, label, collapsed }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const { dir } = useDirection();

  const handleMouseEnter = () => {
    if (!collapsed) return;
    
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 200;
      const offset = 12;
      
      let left, top;
      
      if (dir === 'rtl') {
        // Position to the left for RTL
        left = rect.left - popoverWidth - offset;
        // Make sure it doesn't go off screen
        if (left < 0) {
          left = rect.right + offset;
        }
      } else {
        // Position to the right for LTR
        left = rect.right + offset;
        // Make sure it doesn't go off screen
        if (left + popoverWidth > window.innerWidth) {
          left = rect.left - popoverWidth - offset;
        }
      }
      
      top = rect.top + (rect.height / 2);
      
      setPosition({ top, left });
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible]);

  if (!collapsed) {
    return children;
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={popoverRef}
          className="fixed z-[1000] pointer-events-none"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translateY(-50%)',
          }}
        >
          <div className="relative">
            {/* Arrow */}
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white border border-gray-200 rotate-45 ${
                dir === 'rtl' 
                  ? 'right-0 translate-x-1/2 border-r-0 border-b-0' 
                  : 'left-0 -translate-x-1/2 border-l-0 border-t-0'
              }`}
            />
            
            {/* Popover content */}
            <div
              className={`bg-white border border-gray-200 rounded-xl shadow-xl px-3 py-2 min-w-[200px] ${
                dir === 'rtl' ? 'mr-2' : 'ml-2'
              }`}
              style={{
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              }}
            >
              <span
                className={`text-sm font-medium text-gray-700 ${
                  dir === 'rtl' ? 'text-right' : 'text-left'
                }`}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {label}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Navigation Item Component with enhanced popover support
const NavItem = ({
  item,
  isActive,
  collapsed,
  onClick,
  hasNotification = false,
}) => {
  const { dir } = useDirection();

  const navItemContent = (
    <>
      {item.path ? (
        <Link
          href={item.path}
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
            isActive
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
              : "text-gray-700 hover:bg-white hover:shadow-md hover:text-green-600"
          }`}
          data-tour={`nav-${item.key}`}
        >
          <div className="relative">
            <span
              className={`${
                isActive
                  ? "text-white"
                  : "text-gray-500 group-hover:text-green-600"
              } transition-colors`}
            >
              {item.icon}
            </span>
          
          </div>
          {!collapsed && (
            <span 
              className={`font-medium text-sm ${
                dir === 'rtl' ? 'text-right' : 'text-left'
              }`}
            >
              {item.name}
            </span>
          )}
          {isActive && !collapsed && (
            <div className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'}`}>
              <div className="w-2 h-2 bg-white rounded-full opacity-75"></div>
            </div>
          )}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
              : "text-gray-700 hover:bg-white hover:shadow-md hover:text-green-600"
          }`}
          data-tour={`nav-${item.key}`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`${
                isActive
                  ? "text-white"
                  : "text-gray-500 group-hover:text-green-600"
              } transition-colors`}
            >
              {item.icon}
            </span>
            {!collapsed && (
              <span 
                className={`font-medium text-sm ${
                  dir === 'rtl' ? 'text-right' : 'text-left'
                }`}
              >
                {item.name}
              </span>
            )}
          </div>
          {!collapsed && (
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                item.expanded ? "rotate-180" : ""
              } ${isActive ? "text-white" : "text-gray-400"} ${
                dir === 'rtl' ? 'transform scale-x-[-1]' : ''
              }`}
            />
          )}
        </button>
      )}
    </>
  );

  return (
    <div className="relative">
      <NavigationPopover 
        label={item.name} 
        collapsed={collapsed}
      >
        {navItemContent}
      </NavigationPopover>
    </div>
  );
};

// Sub Navigation Item Component
const SubNavItem = ({ item, isActive }) => {
  const { dir } = useDirection();
  
  return (
    <Link
      href={item.path}
      className={`group flex items-center gap-3 ${
        dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'
      } py-2 rounded-lg text-sm transition-all duration-200 ${
        isActive
          ? "bg-green-100 text-green-700 font-medium"
          : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full transition-colors ${
          isActive ? "bg-green-500" : "bg-gray-300 group-hover:bg-green-400"
        }`}
      ></div>
      <span className={dir === 'rtl' ? 'text-right' : 'text-left'}>
        {item.name}
      </span>
      {item.description && (
        <div className={dir === 'rtl' ? 'mr-auto' : 'ml-auto'}>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      )}
    </Link>
  );
};

// User Profile Component
const UserProfile = ({ collapsed, t }) => {
  const { dir } = useDirection();
  
  return (
    <div
      className={`px-4 py-4 border-t border-gray-200 bg-white bg-opacity-50 backdrop-blur-sm ${
        collapsed ? "px-2" : ""
      }`}
    ></div>
  );
};

export default function Sidebar({ locale }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const t = useTranslations();
  const { dir } = useDirection();

  // Get navigation items from shared utility
  const navGroups = getNavigationItems(locale, t);

  // Improved active link detection
  const isActive = (path, activePaths = null) => {
    if (!path) return false;

    // If activePaths is provided, check against all paths
    if (activePaths && Array.isArray(activePaths)) {
      return activePaths.some((activePath) => {
        const normalizedPathname = pathname.replace(/\/$/, "");
        const normalizedPath = activePath.replace(/\/$/, "");

        // Exact match
        if (normalizedPathname === normalizedPath) return true;

        // For dashboard root, only match exactly to avoid conflicts
        if (normalizedPath === `/${locale}/dashboard`) {
          return normalizedPathname === normalizedPath;
        }

        // For other paths, check if current path starts with the nav path
        return normalizedPathname.startsWith(normalizedPath + "/");
      });
    }

    // Normalize paths by removing trailing slashes
    const normalizedPathname = pathname.replace(/\/$/, "");
    const normalizedPath = path.replace(/\/$/, "");

    // Exact match
    if (normalizedPathname === normalizedPath) return true;

    // For dashboard root, only match exactly to avoid conflicts
    if (normalizedPath === `/${locale}/dashboard`) {
      return normalizedPathname === normalizedPath;
    }

    // For other paths, check if current path starts with the nav path
    return normalizedPathname.startsWith(normalizedPath + "/");
  };

  // Check if a group has any active children
  const hasActiveChild = (group) => {
    if (group.path) {
      return isActive(group.path, group.activePaths);
    }

    // For expandable groups, check children
    if (group.children) {
      return group.children.some((child) =>
        isActive(child.path, child.activePaths)
      );
    }

    return false;
  };

  // Auto-expand menus with active children
  useEffect(() => {
    const updatedExpandedMenus = { ...expandedMenus };

    navGroups.forEach((group) => {
      if (group.isExpandable && group.children) {
        const hasActiveChildItem = group.children.some((child) =>
          isActive(child.path, child.activePaths)
        );
        if (hasActiveChildItem) {
          updatedExpandedMenus[group.key] = true;
        }
      }
    });

    setExpandedMenus(updatedExpandedMenus);
  }, [pathname]);

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  return (
    <div
      className={`h-screen shadow-2xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      } bg-gradient-to-b from-green-50 via-blue-50 to-purple-50 flex-col relative hidden lg:flex`}
      dir={dir}
      data-tour="sidebar-navigation"
    >
      {/* Decorative elements - positioned according to direction */}
      <div className={`absolute top-20 ${dir === 'rtl' ? 'left-0' : 'right-0'} w-32 h-32 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-20 -translate-y-8 ${dir === 'rtl' ? '-translate-x-16' : 'translate-x-16'}`}></div>
      <div className={`absolute bottom-40 ${dir === 'rtl' ? 'right-0' : 'left-0'} w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 ${dir === 'rtl' ? 'translate-x-12' : '-translate-x-12'}`}></div>

      {/* Header */}
      <div className="flex-shrink-0 px-2 py-4 flex justify-between items-center border-b border-white border-opacity-50 backdrop-blur-sm bg-opacity-30">
        <Logo collapsed={collapsed} />
        <NavigationPopover 
          label={collapsed ? t("sidebar.expand") : t("sidebar.collapse")} 
          collapsed={collapsed}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl bg-white bg-opacity-50 hover:bg-opacity-70 transition-all duration-200 shadow-md hover:shadow-lg"
            title={collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
          >
            {collapsed ? (
              dir === 'rtl' ? (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )
            ) : (
              dir === 'rtl' ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )
            )}
          </button>
        </NavigationPopover>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 overflow-y-auto px-4 space-y-2 relative z-10">
        {navGroups.map((group) => {
          const isGroupActive = hasActiveChild(group);
          const groupWithExpanded = {
            ...group,
            expanded: expandedMenus[group.key],
          };

          return (
            <div key={group.key} className="space-y-1">
              <NavItem
                item={groupWithExpanded}
                isActive={isGroupActive}
                collapsed={collapsed}
                onClick={() => group.isExpandable && toggleMenu(group.key)}
                hasNotification={group.hasNotification}
              />

              {group.isExpandable && expandedMenus[group.key] && !collapsed && (
                <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                  {group.children?.map((child) => (
                    <SubNavItem
                      key={child.key}
                      item={child}
                      isActive={isActive(child.path, child.activePaths)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
      <UserProfile collapsed={collapsed} t={t} />
    </div>
  );
}

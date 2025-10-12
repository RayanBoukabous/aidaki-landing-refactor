import {
  Home,
  BookOpen,
  Activity,
  MessageCircleQuestion,
  Brain,
  Lightbulb,
} from "lucide-react";

// Shared navigation data for both sidebar and mobile menu
export const getNavigationItems = (locale, t) => [
  {
    key: "dashboard",
    name: t("sidebar.home"),
    path: `/${locale}/dashboard`,
    icon: <Home className="w-5 h-5" />,
    isExpandable: false,
    category: "main",
  },
  {
    key: "my_learning",
    name: t("sidebar.myLearning"),
    path: `/${locale}/dashboard/learning`,
    icon: <BookOpen className="w-5 h-5" />,
    isExpandable: false,
    category: "progress",
    hasNotification: true,
    activePaths: [
      `/${locale}/dashboard/learning`,
      `/${locale}/dashboard/study-modules`,
    ],
  },
  {
    key: "my_progress",
    name: t("sidebar.myProgress"),
    path: `/${locale}/dashboard/progress`,
    icon: <Activity className="w-5 h-5" />,
    isExpandable: false,
    category: "progress",
  },
  {
    key: "quiz",
    name: t("sidebar.quiz"),
    path: `/${locale}/dashboard/quiz`,
    icon: <MessageCircleQuestion className="w-5 h-5" />,
    isExpandable: false,
    category: "quiz",
  },
  {
    key: "assistant",
    name: t("sidebar.assistant"),
    path: `/${locale}/dashboard/assistant`,
    icon: <Brain className="w-5 h-5" />,
    isExpandable: false,
    category: "assistant",
  },
  {
    key: "tips",
    name: t("sidebar.tips"),
    path: `/${locale}/dashboard/tips`,
    icon: <Lightbulb className="w-5 h-5" />,
    isExpandable: false,
    category: "tips",
  },
];

// Enhanced Logo Component (reusable)
export const Logo = ({ collapsed, className = "" }) => (
  <div className={`flex w-full justify-center items-center gap-3 ${className}`}>
    <div className="w-16 h-16 rounded-xl flex items-center justify-center">
      <img src="/images/logo-black.png" alt="Logo" className="w-24 pt-1" />
    </div>
  </div>
);

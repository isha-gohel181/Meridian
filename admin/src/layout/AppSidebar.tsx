import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  TaskIcon,
  VideoIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { Tag, UserCircle2Icon, Bell, MessageCircle, Search, X } from "lucide-react";
import BrandLogo from "../components/common/BrandLogo";
import { BRAND_SIDEBAR_CLASS } from "../constants/brand";

type NavSubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  subItems?: NavSubItem[];
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: NavSubItem[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },

  {
    icon: <ListIcon />,
    name: "Courses",
    path: "/courses/all/courses"
  },
  // {
  //   icon: <MessageCircle />,
  //   name: "Course Feedbacks",
  //   path: "/course-feedbacks",
  // },

  // {
  //   icon: <PageIcon />,
  //   name: "Test Series",
  //   path: "/test-series",
  // },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "Physical Books",
  //   subItems: [
  //     { name: "Manage Books", path: "/ebooks" },
  //     { name: "Book Orders", path: "/ebooks/orders" }
  //   ]
  // },

  // {
  //   icon: <BoxCubeIcon />,
  //   name: "Course Bundle",
  //   path: "/bundles/all",
  // },
  {
    icon: <BoxCubeIcon />,
    name: "Categories",
    path: "/categories",

  },
  {
    icon: <PageIcon />,
    name: "Banner",
    path: "/banner",
  },
  {
    icon: <CalenderIcon />,
    name: "Events",
    path: "/events",
  },
  {
    icon: <UserCircleIcon />,
    name: "Jobs",
    path: "/jobs",
  },
  {
    icon: <PageIcon />,
    name: "News",
    path: "/news",
  },

  {
    icon: <PageIcon />,
    name: "Forums",
    path: "/forum",
  },
  {
    icon: <UserCircleIcon />,
    name: "Students",
    path: "/students/all",

  },
  // {
  //   icon: <UserCircleIcon />,
  //   name: "Add Reporter",
  //   path: "/reporters/add",
  // },
  {
    icon: <TableIcon />,
    name: "Assignment Submissions",
    path: "/assignments/submissions"
  },
  {
    icon: <UserCircle2Icon />,
    name: "Contact Queries",
    path: "/queries/all"
  },
  {
    icon: <TableIcon />,
    name: "Support Requests",
    path: "/requests"
  },
  {
    icon: <MessageCircle />,
    name: "Chat",
    path: "/chat"
  },
  {
    icon: <Tag />,
    name: "Coupons",
    path: "/coupons/all"
  },
  {
    icon: <TableIcon />,
    name: "Device Approvals",
    path: "/device-approvals"
  },
  {
    icon: <MessageCircle />,
    name: "Testimonials",
    path: "/testimonials"
  },
  // {
  //   icon: <Bot />,
  //   name: "AI Tool",
  //   path: "/ai-tool"
  // },
  {
    icon: <PieChartIcon />,
    name: "Leaderboard Settings",
    path: "/leaderboard-setting"
  },
  // {
  //   icon: <TaskIcon />,
  //   name: "Personality Test",
  //   path: "/personality-test"
  // },
  {
    icon: <PageIcon />,
    name: "Security",
    subItems: [
      { name: "Incidents", path: "/security/incidents" },
    ],
  },
  // {
  //   icon: <Files />,
  //   name: "Analytics",
  //   subItems: [
  //     { name: "Dashboard", path: "/files/all" },
  //     { name: "Video  Logs", path: "/files/sessions" },
  //     { name: "Performance", path: "/files/projects" },
  //   ],
  // },




  //sales analytics
  {
    icon: <TableIcon />,
    name: "Sales Analytics",
    subItems: [
      { name: "User", path: "/sales/user" },
      { name: "Course", path: "/sales/course" },
      { name: "Bundle", path: "/sales/bundle" },
    ],
  }
  ,

  {
    icon: <Bell />,
    name: "Notifications",
    subItems: [
      { name: "Send Notifications", path: "/send-notification" },
      { name: "Notification History", path: "/notification-history" },
    ],
  },



  {
    icon: <PieChartIcon />,
    name: "Certifications",
    subItems: [
      {
        name: "All Templates",
        path: "/certificates-template/all",
      },
      { name: "Add Template", path: "/certificates-template/add" },
      // {
      //   name: "Certificates",
      //   path: "/certificates",
      //   subItems: [
      //     { name: "Quiz Certificates", path: "/certificates/quiz" },
      //     { name: "Completion Certificates", path: "/certificates/completion" },
      //     { name: "Certificate Templates", path: "/certificates/templates" },
      //     { name: "Create New Template", path: "/certificates/templates/new" },
      //   ],
      // },
      // { name: "Gradebook", path: "/grades/gradebook" },
      // { name: "Reports", path: "/grades/reports" },
    ],
  },
  {
    icon: <VideoIcon />,
    name: "Live Classes",
    path: "/live-classes",
  },
  // {
  //   icon: <CalenderIcon />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },
];

const filterSubItems = (subItems: NavSubItem[], query: string): NavSubItem[] => {
  const q = query.trim().toLowerCase();
  if (!q) return subItems;

  return subItems.reduce<NavSubItem[]>((acc, sub) => {
    const nameMatch = sub.name.toLowerCase().includes(q);
    const pathMatch = sub.path?.toLowerCase().includes(q);

    if (sub.subItems?.length) {
      const nested = filterSubItems(sub.subItems, q);
      if (nameMatch || nested.length) {
        acc.push({
          ...sub,
          subItems: nested.length ? nested : sub.subItems,
        });
      }
    } else if (nameMatch || pathMatch) {
      acc.push(sub);
    }
    return acc;
  }, []);
};

const filterNavItems = (items: NavItem[], query: string): NavItem[] => {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return items.reduce<NavItem[]>((acc, item) => {
    const nameMatch = item.name.toLowerCase().includes(q);
    const pathMatch = item.path?.toLowerCase().includes(q);

    if (item.subItems?.length) {
      const filteredSubs = filterSubItems(item.subItems, q);
      if (nameMatch) {
        acc.push({
          ...item,
          subItems: filteredSubs.length ? filteredSubs : item.subItems,
        });
      } else if (filteredSubs.length) {
        acc.push({ ...item, subItems: filteredSubs });
      }
    } else if (nameMatch || pathMatch) {
      acc.push(item);
    }
    return acc;
  }, []);
};

const othersItems: NavItem[] = [
  // {
  //   icon: <PlugInIcon />,
  //   name: "Settings",
  //   subItems: [
  //     { name: "App Menu Settings", path: "/settings/app-menu" },
  //   ],
  // },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [userRole, setUserRole] = useState<string | null>(() => {
    try {
      let role = localStorage.getItem("role");
      if (!role) {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const parsed = JSON.parse(userStr);
            role = parsed?.role;
          } catch (e) {
            // ignore parse error
          }
        }
      }
      return role ? String(role).trim() : null;
    } catch (e) {
      return null;
    }
  });

  const [menuSearch, setMenuSearch] = useState("");
  const [openSubmenu, setOpenSubmenu] = useState<string[]>([]);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // Function to check if any subitem is active recursively
  const hasActiveSubItem = useCallback(
    (subItems: NavSubItem[]): boolean => {
      return subItems.some((subItem) => {
        if (isActive(subItem.path)) return true;
        if (subItem.subItems) return hasActiveSubItem(subItem.subItems);
        return false;
      });
    },
    [isActive]
  );

  // Auto-expand menus based on active route (skip while search is filtering)
  useEffect(() => {
    if (menuSearch.trim()) return;

    const activeMenus: string[] = [];

    const checkMenuItems = (items: NavItem[], prefix: string) => {
      items.forEach((nav, index) => {
        const menuKey = `${prefix}-${index}`;
        if (nav.subItems && hasActiveSubItem(nav.subItems)) {
          activeMenus.push(menuKey);

          // Check for nested submenus
          nav.subItems.forEach((subItem, subIndex) => {
            const subMenuKey = `${menuKey}-${subIndex}`;
            if (subItem.subItems && hasActiveSubItem(subItem.subItems)) {
              activeMenus.push(subMenuKey);
            }
          });
        }
      });
    };

    checkMenuItems(navItems, "main");

    setOpenSubmenu(activeMenus);
  }, [location, hasActiveSubItem, menuSearch]);

  // Update submenu heights when they open
  useEffect(() => {
    openSubmenu.forEach((key) => {
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    });
  }, [openSubmenu]);

  const handleSubmenuToggle = (menuKey: string) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu.includes(menuKey)) {
        return prevOpenSubmenu.filter((key) => key !== menuKey);
      }
      return [...prevOpenSubmenu, menuKey];
    });
  };

  // Recursive function to render subitems
  const renderSubItems = (
    subItems: NavSubItem[],
    parentKey: string,
    level: number = 1
  ) => {
    return subItems.map((subItem, index) => {
      const subMenuKey = `${parentKey}-${index}`;
      const marginLeft = level === 1 ? "ml-9" : `ml-${9 + (level - 1) * 4}`;

      return (
        <li key={subItem.name}>
          {subItem.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(subMenuKey)}
                className={`menu-dropdown-item cursor-pointer w-full text-left ${openSubmenu.includes(subMenuKey) ||
                  hasActiveSubItem(subItem.subItems || [])
                  ? "menu-dropdown-item-active"
                  : "menu-dropdown-item-inactive"
                  }`}
              >
                <span className="flex sm:flex-row items-center sm:items-center justify-between gap-4 w-full">
                  <span>{subItem.name}</span>
                  <span className="flex items-center gap-1">
                    {subItem.new && (
                      <span
                        className={`menu-dropdown-badge ${openSubmenu.includes(subMenuKey) ||
                          hasActiveSubItem(subItem.subItems || [])
                          ? "menu-dropdown-badge-active"
                          : "menu-dropdown-badge-inactive"
                          }`}
                      >
                        new
                      </span>
                    )}
                    {subItem.pro && (
                      <span
                        className={`menu-dropdown-badge ${openSubmenu.includes(subMenuKey) ||
                          hasActiveSubItem(subItem.subItems || [])
                          ? "menu-dropdown-badge-active"
                          : "menu-dropdown-badge-inactive"
                          }`}
                      >
                        pro
                      </span>
                    )}
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-200 ${openSubmenu.includes(subMenuKey) ? "rotate-180" : ""
                        }`}
                    />
                  </span>
                </span>
              </button>
              <div
                ref={(el) => {
                  subMenuRefs.current[subMenuKey] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: openSubmenu.includes(subMenuKey)
                    ? `${subMenuHeight[subMenuKey]}px`
                    : "0px",
                }}
              >
                <ul className={`mt-2 space-y-1 ${marginLeft}`}>
                  {renderSubItems(subItem.subItems, subMenuKey, level + 1)}
                </ul>
              </div>
            </>
          ) : (
            <Link
              to={subItem.path}
              className={`menu-dropdown-item ${isActive(subItem.path)
                ? "menu-dropdown-item-active"
                : "menu-dropdown-item-inactive"
                }`}
            >
              {subItem.name}
              <span className="flex items-center gap-1 ml-auto">
                {subItem.new && (
                  <span
                    className={`menu-dropdown-badge ${isActive(subItem.path)
                      ? "menu-dropdown-badge-active"
                      : "menu-dropdown-badge-inactive"
                      }`}
                  >
                    new
                  </span>
                )}
                {subItem.pro && (
                  <span
                    className={`menu-dropdown-badge ${isActive(subItem.path)
                      ? "menu-dropdown-badge-active"
                      : "menu-dropdown-badge-inactive"
                      }`}
                  >
                    pro
                  </span>
                )}
              </span>
            </Link>
          )}
        </li>
      );
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const menuKey = `${menuType}-${index}`;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(menuKey)}
                className={`menu-item group ${openSubmenu.includes(menuKey) ||
                  hasActiveSubItem(nav.subItems)
                  ? "menu-item-active"
                  : "menu-item-inactive"
                  } cursor-pointer ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${openSubmenu.includes(menuKey) ||
                    hasActiveSubItem(nav.subItems)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-4 h-4 transition-transform duration-200 ${openSubmenu.includes(menuKey)
                      ? "rotate-180 text-white"
                      : "text-white/70 group-hover:text-white"
                      }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${isActive(nav.path)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                    }`}
                >
                  <span
                    className={`menu-item-icon-size ${isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                      }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[menuKey] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: openSubmenu.includes(menuKey)
                    ? `${subMenuHeight[menuKey]}px`
                    : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {renderSubItems(nav.subItems, menuKey)}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  const roleFilteredNavItems =
    userRole === "news_editor"
      ? navItems.filter((nav) => nav.name === "News")
      : navItems;

  const filteredNavItems = useMemo(
    () => filterNavItems(roleFilteredNavItems, menuSearch),
    [roleFilteredNavItems, menuSearch]
  );

  const sidebarWide = isExpanded || isHovered || isMobileOpen;
  const isSearching = menuSearch.trim().length > 0;

  // Expand submenus while searching so matches stay visible
  useEffect(() => {
    if (!isSearching) return;

    const keys: string[] = [];
    const collectKeys = (items: NavItem[], prefix: string) => {
      items.forEach((nav, index) => {
        const menuKey = `${prefix}-${index}`;
        if (nav.subItems?.length) {
          keys.push(menuKey);
          nav.subItems.forEach((sub, subIndex) => {
            if (sub.subItems?.length) {
              keys.push(`${menuKey}-${subIndex}`);
            }
          });
        }
      });
    };

    collectKeys(filteredNavItems, "main");
    setOpenSubmenu(keys);
  }, [isSearching, filteredNavItems, menuSearch]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 left-0 ${BRAND_SIDEBAR_CLASS} text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-white/10 shadow-xl
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="py-5 flex items-center justify-center border-b border-white/15 mb-2"
      >
        <Link to="/" className="flex items-center justify-center w-full">
          <BrandLogo
            size={isExpanded || isHovered || isMobileOpen ? "md" : "sm"}
          />
        </Link>
      </div>

      {sidebarWide ? (
        <div className="mb-3 px-1">
          <label className="sr-only" htmlFor="sidebar-menu-search">
            Search menu
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
              aria-hidden
            />
            <input
              id="sidebar-menu-search"
              type="text"
              role="searchbox"
              autoComplete="off"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Search menu..."
              className="w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pl-9 pr-9 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-white/40 focus:bg-white/15"
            />
            {menuSearch && (
              <button
                type="button"
                onClick={() => setMenuSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-3 flex justify-center px-1" title="Expand sidebar to search menu">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white/70">
            <Search className="h-4 w-4" />
          </span>
        </div>
      )}

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-3 text-[11px] font-bold tracking-[0.2em] uppercase flex leading-[20px] text-white/60 ${!sidebarWide
                  ? "lg:justify-center"
                  : "justify-start px-2"
                  }`}
              >
                {sidebarWide ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-5 text-white/60" />
                )}
              </h2>
              {filteredNavItems.length === 0 ? (
                <p className="px-2 py-3 text-center text-sm text-white/60">
                  No menu items match &quot;{menuSearch.trim()}&quot;
                </p>
              ) : (
                renderMenuItems(filteredNavItems, "main")
              )}
            </div>
            {userRole !== "news_editor" && othersItems.length > 0 && (
              <div className="">
                <h2
                  className={`mb-3 text-[11px] font-bold tracking-[0.2em] uppercase flex leading-[20px] text-white/60 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start px-2"
                    }`}
                >
                  {sidebarWide ? (
                    "Others"
                  ) : (
                    <HorizontaLDots className="size-5 text-white/60" />
                  )}
                </h2>
                {renderMenuItems(othersItems, "others")}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

import React, { useState } from "react";
import {
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  GraduationCap,
  LogIn,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useApp } from "../context/useApp";

const navItems = [
  { label: "Home", type: "section", target: "home" },
  { label: "About Us", type: "view", target: "about" },
  { label: "Destinations", type: "section", target: "destinations" },
  { label: "Services", type: "section", target: "services" },
  { label: "Universities", type: "view", target: "colleges" },
  { label: "Scholarships", type: "view", target: "scholarships" },
  { label: "Language Prep", type: "view", target: "language_academy" },
  { label: "Success Stories", type: "section", target: "stories" },
  { label: "Contact", type: "view", target: "contact" },
];

export const Navbar = ({ onOpenAuth, onStartTest, onNavigate }) => {
  const { currentView, setCurrentView, userRole, activeUser, logout } =
    useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goToLandingSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (currentView !== "landing") onNavigate("landing");
    window.setTimeout(
      () =>
        document
          .querySelector(`#${sectionId}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      currentView === "landing" ? 20 : 100,
    );
  };

  const handleNav = (item) => {
    setMobileMenuOpen(false);
    if (item.type === "section") goToLandingSection(item.target);
    if (item.type === "view") onNavigate(item.target);
    if (item.type === "assessment") onStartTest();
  };

  const isActive = (item) => {
    if (item.target === "home") return currentView === "landing";
    if (item.target === "colleges")
      return ["colleges", "college_detail"].includes(currentView);
    return item.type === "view" && currentView === item.target;
  };

  const openActivePortal = () => {
    setMobileMenuOpen(false);
    if (userRole === "student") setCurrentView("student_portal");
    if (userRole === "counselor") setCurrentView("counselor_portal");
  };

  const openStaffErp = () => {
    setMobileMenuOpen(false);
    if (userRole === "counselor") setCurrentView("counselor_portal");
    else onOpenAuth("staff", "counselor_portal");
  };

  const openCms = () => {
    setMobileMenuOpen(false);
    if (userRole === "counselor") onNavigate("cms");
    else onOpenAuth("staff", "cms");
  };

  return (
    <header className="pointer-events-none sticky top-0 z-50 h-[96px] bg-transparent px-3 pt-3 no-print sm:px-5">
      <div className="pointer-events-auto mx-auto flex h-[72px] max-w-[1540px] items-center justify-between gap-4 rounded-[1.35rem] border border-white/80 bg-white/90 px-3 shadow-[0_18px_55px_rgba(6,45,85,0.14)] backdrop-blur-2xl sm:px-5 lg:px-6">
        <button
          type="button"
          onClick={() => goToLandingSection("home")}
          className="brand-logo-frame w-[190px] shrink-0 sm:w-[215px]"
          aria-label="Mother Teresa Educational Global Trust home"
        >
          <img
            src={`${import.meta.env.BASE_URL}brand/logo-blue.png`}
            alt="Mother Teresa Educational Global Trust"
          />
        </button>

        <nav
          className="hidden items-center rounded-2xl border border-slate-200/70 bg-slate-50/80 px-1.5 min-[1380px]:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNav(item)}
              aria-current={isActive(item) ? "page" : undefined}
              className={`relative whitespace-nowrap rounded-xl px-2.5 py-3 text-[9.5px] font-extrabold transition 2xl:px-3.5 ${isActive(item) ? "bg-white text-[#075ec5] shadow-sm" : "text-slate-600 hover:bg-white/70 hover:text-[#075ec5]"}`}
            >
              {item.label}
              {isActive(item) && (
                <span className="absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-[#075ec5]" />
              )}
            </button>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 min-[1380px]:flex">
          <button
            type="button"
            onClick={openCms}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${currentView === "cms" ? "border-blue-200 bg-blue-50 text-[#075ec5]" : "border-slate-200 text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-[#075ec5]"}`}
            aria-label="Open landing page CMS"
            title="Landing page CMS"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={openStaffErp}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#075ec5]"
            aria-label="Open Staff ERP"
            title="Staff ERP"
          >
            <BriefcaseBusiness className="h-4 w-4" />
          </button>
          {activeUser ? (
            <>
              <button
                type="button"
                onClick={openActivePortal}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 text-[10px] font-extrabold text-[#075ec5]"
                aria-label={`Open ${userRole === "counselor" ? "counselor ERP" : "student portal"}`}
                title={
                  userRole === "counselor" ? "Counselor ERP" : "Student portal"
                }
              >
                <GraduationCap className="h-4 w-4" />
                <span className="max-w-20 truncate">
                  {activeUser.name?.split(" ")[0] || "Portal"}
                </span>
                <ChevronDown className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuth("student", "student_portal")}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-[10px] font-extrabold text-[#075ec5] transition hover:border-[#075ec5] hover:bg-[#075ec5] hover:text-white"
              aria-label="Login to your account"
            >
              <LogIn className="h-4 w-4" /> Login
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("contact")}
            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-[#075ec5] to-[#064a9d] px-4 text-[10px] font-extrabold text-white shadow-[0_10px_24px_rgba(7,94,197,0.25)] transition hover:-translate-y-0.5"
          >
            <CalendarDays className="h-4 w-4" /> Free Consultation
          </button>
        </div>

        <div className="flex items-center gap-2 min-[1380px]:hidden">
          {!activeUser && (
            <button
              type="button"
              onClick={() => onOpenAuth("student", "student_portal")}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#075ec5] px-3 text-xs font-extrabold text-white"
            >
              <LogIn className="h-4 w-4" /> Login
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-[#063764]"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute left-3 right-3 top-[84px] overflow-hidden rounded-3xl border border-white bg-white/95 px-5 py-5 shadow-[0_25px_70px_rgba(6,45,85,0.2)] backdrop-blur-2xl min-[1380px]:hidden sm:left-5 sm:right-5">
          <nav className="mx-auto max-w-3xl" aria-label="Mobile navigation">
            <div className="grid sm:grid-cols-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNav(item)}
                  aria-current={isActive(item) ? "page" : undefined}
                  className={`border-b border-slate-100 px-3 py-3 text-left text-sm font-bold ${isActive(item) ? "text-[#075ec5]" : "text-slate-700"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={openCms}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-[#075ec5]"
              >
                <Settings className="h-4 w-4" /> Content Manager
              </button>
              <button
                type="button"
                onClick={openStaffErp}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-[#075ec5]"
              >
                <BriefcaseBusiness className="h-4 w-4" /> Staff ERP
              </button>
              {activeUser ? (
                <button
                  type="button"
                  onClick={openActivePortal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-[#075ec5]"
                >
                  <GraduationCap className="h-4 w-4" /> Open{" "}
                  {userRole === "counselor"
                    ? "counselor ERP"
                    : "student portal"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-[#075ec5]"
                >
                  <LogIn className="h-4 w-4" /> Login
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onStartTest();
                  setMobileMenuOpen(false);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#062d55] px-5 py-3 text-sm font-bold text-white"
              >
                <Brain className="h-4 w-4" /> Aptitude test
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate("contact");
                  setMobileMenuOpen(false);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#075ec5] px-5 py-3 text-sm font-bold text-white"
              >
                <CalendarDays className="h-4 w-4" /> Free consultation
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

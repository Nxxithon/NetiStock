import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className={`pt-16 transition-all duration-300 lg:pl-64 ${isMobileMenuOpen ? 'blur-sm lg:blur-none' : ''}`}>
        <div className="app-container py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

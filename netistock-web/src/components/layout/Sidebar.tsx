import { NavLink } from "react-router-dom";
import { LayoutDashboard, ArrowRightLeft, History, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: "คลังสินค้า",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "รับเข้า / เบิกออก",
    path: "/transactions",
    icon: ArrowRightLeft,
  },
  {
    label: "ประวัติรายการ",
    path: "/history",
    icon: History,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside className={cn(
        "fixed top-0 lg:top-16 left-0 bottom-0 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] z-50 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">
            เมนูหลัก
          </p>
          <button onClick={onClose} className="show-mobile p-1 text-[var(--color-muted-foreground)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                  isActive
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-foreground)]"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
import { Link, useLocation } from "react-router";
import { ChartNoAxesCombined, ChevronRight } from "lucide-react";

export default function MenuFlutComp() {
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: ChartNoAxesCombined,
    },
  ];

  return (
    <aside className="fixed left-5 top-1/2 z-40 -translate-y-1/2">
      <div className="w-14 overflow-hidden rounded-xl border border-(--border) bg-(--surface-container-low) transition-all duration-300 hover:w-48">
        <div className="border-b border-(--border) p-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--text-secondary)">
            Menu
          </span>
        </div>

        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-(--surface-container-high) text-white"
                    : "text-(--text-secondary) hover:bg-(--surface-container) hover:text-white"
                }`}
              >
                <Icon size={20} className="shrink-0" />

                <span className="whitespace-nowrap text-sm font-medium">
                  {item.label}
                </span>

                <ChevronRight
                  size={16}
                  className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

import { Outlet } from "react-router";
import HeaderComp from "../components/header";
import BannerComp from "../components/banner";
import TabsComp from "../components/tabs";
import MenuFlutComp from "../components/menuflut";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();

  const canAccessMenu = user?.roles && ["admin", "seller"].includes(user.roles);

  return (
    <div className="min-h-screen bg-[#131313] text-[#e4e2e1]">
      <HeaderComp />

      <main className="min-h-screen">
        {canAccessMenu && <MenuFlutComp />}

        <section className="border-b border-[#444748] bg-[#0e0e0e]">
          <BannerComp />
        </section>

        <section className="mx-auto w-full max-w-360 border-x border-[#262626] bg-[#131313]">
          <div className="px-6 py-16 lg:px-12 xl:px-20">
            <TabsComp />

            <div className="mt-16">
              <Outlet />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

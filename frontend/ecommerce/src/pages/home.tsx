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
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
      <HeaderComp />

      <main className="min-h-screen">
        {canAccessMenu && <MenuFlutComp />}

        <section className="border-b border-[#333333] bg-[#070707]">
          <BannerComp />
        </section>

        <section className="mx-auto w-full max-w-360 border-x border-[#333333] bg-[#0a0a0a]">
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

import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import BrandLogo from "../../components/common/BrandLogo";
import { APP_DISPLAY_NAME, BRAND_ACCENT_CLASS } from "../../constants/brand";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div
          className={`items-center hidden w-full h-full lg:w-1/2 ${BRAND_ACCENT_CLASS} lg:grid`}
        >
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
                <BrandLogo size="lg" />
              </Link>
              <p className="text-center text-white/90 font-medium tracking-wide">
                {APP_DISPLAY_NAME} Admin Dashboard
              </p>
            </div>
          </div>
        </div>
        {/* <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div> */}
      </div>
    </div>
  );
}

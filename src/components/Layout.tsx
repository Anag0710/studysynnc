import React, { ReactNode } from 'react';
import Navbar from './layout/Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <footer className="py-4 mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} StudySync. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
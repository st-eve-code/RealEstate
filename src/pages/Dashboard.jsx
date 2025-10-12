import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import React, { useState , useEffect} from 'react';
// Main Dashboard Component
export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // get the selected link from sidebar
  const [option, setOption] = useState('dashboard');

  // Detect mobile screen size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
      };

  return (
    <div className="min-h-screen bg-gray-100/30 block md:flex">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar}
        onSelect={setOption} 
      />
      <MainContent 
        isSidebarCollapsed={isSidebarCollapsed}
        data={option} 
      />
    </div>
  );
}
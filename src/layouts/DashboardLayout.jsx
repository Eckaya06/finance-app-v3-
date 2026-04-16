import { Outlet, useLocation } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar.jsx';
import ChatWidget from '../components/chatbot/ChatWidget';
import './DashboardLayout.css';

const DashboardLayout = () => {
  // Main content div'ine takmak için bir ref oluştur
  const mainContentRef = useRef(null);
  const { pathname } = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prevState => !prevState);
  };

  // ScrollToTop bileşenindeki mantığı buraya taşıdık
  useEffect(() => {
    // Eğer ref'imiz bağlıysa (yani element ekrandaysa)
    // ve kaydırılabiliyorsa, onu en üste kaydır.
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0);
    }
  }, [pathname]); // Sadece URL değiştiğinde çalış

  const layoutClassName = `dashboard-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`;

  return (
    // Dinamik class'ı ana div'e ekle
    <div className={layoutClassName}>
      {/* State'i ve toggle fonksiyonunu Sidebar'a prop olarak geçir */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      
      <main className="main-content" ref={mainContentRef}>
        <Outlet />
        
        {/* Yapay Zeka Chatbot Bileşeni */}
        <ChatWidget />
      </main>
    </div>
  );
};

export default DashboardLayout;
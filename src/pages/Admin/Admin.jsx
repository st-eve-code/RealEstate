import React from 'react';
import '../../App.css';
import Sidebar from './Components/Sidebar';
import Main from './Components/Main';

function Admin() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <section className="admin-section bg-gray-100 min-h-screen grid grid-cols-1 md:grid-cols-12 gap-3">
      <Sidebar onToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <Main />
    </section>
  )
}

export default Admin
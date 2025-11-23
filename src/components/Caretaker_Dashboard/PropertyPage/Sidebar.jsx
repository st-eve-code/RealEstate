import {
  HomeIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white flex flex-col justify-between p-6 border-r border-gray-200">
      <div>
        <div className="flex items-center mb-10">
          <div className="text-blue-600 text-3xl font-bold mr-2">📍</div>
          <span className="text-xl font-bold text-gray-900">RentSpot</span>
          <span className="ml-2 w-3 h-3 rounded-full bg-green-500"></span>
        </div>
        <nav className="space-y-5">
          <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-semibold">
            <HomeIcon className="h-6 w-6" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-semibold">
            <BuildingOfficeIcon className="h-6 w-6" />
            <span>Properties</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-900 font-bold">
            <UserCircleIcon className="h-6 w-6" />
            <span>My Profile</span>
          </a>
        </nav>
      </div>
      <div className="space-y-4">
        <button className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 w-full font-semibold">
          <Cog6ToothIcon className="h-6 w-6" />
          <span>Settings</span>
        </button>
        <button className="flex items-center space-x-3 text-red-600 hover:text-red-800 w-full font-semibold">
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
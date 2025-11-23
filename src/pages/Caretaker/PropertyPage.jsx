import Sidebar from '@/components/Caretaker_Dashboard/PropertyPage/Sidebar';
import Header from '@/components/Caretaker_Dashboard/PropertyPage/Header';
import PropertyOverview from '@/components/Caretaker_Dashboard/PropertyPage/PropertyOverview';
import OwnerDetails from '@/components/Caretaker_Dashboard/PropertyPage/OwnerDetails';
import EditPropertyDetails from '@/components/Caretaker_Dashboard/PropertyPage/EditPropertyDetails';

const PropertyPage = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 overflow-auto">
          <PropertyOverview />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <OwnerDetails />
            <EditPropertyDetails />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PropertyPage;
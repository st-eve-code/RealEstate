const PropertyOverview = () => {
  return (
    <section className="bg-white rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-xl font-bold mb-1 text-gray-900">Property Overview</h2>
      <p className="text-gray-500 mb-6">All property details concerning the property</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Images grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 rounded-lg overflow-hidden md:col-span-2">
          <img
            src="https://images.unsplash.com/photo-1501183638714-9f3e60b5ecb8?auto=format&fit=crop&w=800&q=80"
            alt="property exterior"
            className="w-full h-full object-cover rounded-lg"
          />
          <img
            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"
            alt="property interior"
            className="w-full h-full object-cover rounded-lg"
          />
          <img
            src="https://images.unsplash.com/photo-1527766833261-b09c3163a791?auto=format&fit=crop&w=800&q=80"
            alt="tenant"
            className="w-full h-full object-cover rounded-lg"
          />
          <img
            src="https://images.unsplash.com/photo-1560448074-3b8ab2d1aa4a?auto=format&fit=crop&w=800&q=80"
            alt="kitchen"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Property details */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Sunny Villa Apartment</h3>
            <h4 className="font-semibold text-lg mb-2">Property Description</h4>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The goal of a property summary is to quickly capture the interest of potential buyers or tenants and provide them with enough information to encourage further inquiry or a physical visit. It acts as a concise, informative "hook" that highlights the property's best features and value proposition.
            </p>

            <h4 className="font-semibold mb-1">Location</h4>
            <p className="text-gray-600 mb-4">Untared Malingo, Ub Junction</p>

            <h4 className="font-semibold mb-1">Price</h4>
            <p className="text-gray-900 font-bold mb-4">150,000 FCFA/month</p>

            <h4 className="font-semibold mb-3">Features</h4>
            <div className="flex items-center space-x-6 text-gray-700 mb-3">
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21v-2a4 4 0 014-4h10a4 4 0 014 4v2"/></svg>
                <span>3 beds</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                <span>1 bathroom</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                <span>1 kitchen</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.488 7.91l6.561-.955L10 1l2.951 5.955 6.561.955-4.757 4.635 1.123 6.545z"/></svg>
              ))}
              <span className="text-gray-700 ml-2">5.0</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyOverview;
import { useUser } from '../components/UserContext';

function Dashboard() {
  const { role } = useUser();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-y-auto text-gray-900 dark:text-white">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-2">Welcome to your dashboard!</p>

          {role === 'admin' && (
            <div className="mt-6 p-4 border rounded bg-white dark:bg-gray-900">
              <h2 className="text-xl font-semibold">Admin Panel</h2>
              <p className="text-sm mt-2">Manage users, settings, etc.</p>
            </div>
          )}

          {role === 'user' && (
            <div className="mt-6 p-4 border rounded bg-white dark:bg-gray-900">
              <h2 className="text-xl font-semibold">User Panel</h2>
              <p className="text-sm mt-2">Your bookings and account info.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

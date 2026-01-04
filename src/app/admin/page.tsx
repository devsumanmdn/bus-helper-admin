import BusList from './components/BusList';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6">Welcome to the Bus Helper Admin Area.</p>
      <BusList />
    </div>
  );
}

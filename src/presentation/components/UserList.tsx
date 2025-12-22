import { useState } from 'react';
import { useUsers, useCreateUser } from '@presentation';

export const UserList = () => {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      createUser.mutate({
        name,
        email,
        role: 'user', // Default for demo
      });
      setName('');
      setEmail('');
    }
  };

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <ul className="space-y-2 mb-4">
        {users?.map((user) => (
          <li key={user.id} className="p-2 border-b border-gray-100 last:border-0">
            <span className="font-medium">{user.name}</span> ({user.email})
          </li>
        ))}
      </ul>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:flex-1 min-w-0"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:flex-1 min-w-0"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shrink-0">
            Add User
        </button>
      </form>
    </div>
  );
};

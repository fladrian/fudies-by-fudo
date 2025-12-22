import { UserList, PostList } from '@presentation';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">React Clean Architecture Boilerplate</h1>
        <p className="text-gray-600 mt-2">Vite + React + TS + Zustand + Query + Tailwind</p>
      </header>
      
      <main className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserList />
        <PostList />
      </main>
    </div>
  );
}

export default App;

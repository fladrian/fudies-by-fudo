import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HomePage } from '@presentation/pages';
import { MainLayout } from '@presentation/layouts';

function App() {
  return (
    <>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/post/:postId" element={<PostDetailPage />} /> */}
        </Routes>
      </MainLayout>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;

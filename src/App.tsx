import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ChatPage from './pages/ChatPage'
import MemoriesPage from './pages/MemoriesPage'
import WishesPage from './pages/WishesPage'
import AchievementsPage from './pages/AchievementsPage'
import GalleryPage from './pages/GalleryPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<ChatPage />} />
          <Route path="memories" element={<MemoriesPage />} />
          <Route path="wishes" element={<WishesPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

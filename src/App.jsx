import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/common/ProtectedRoute'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import LoadingSpinner from './components/common/LoadingSpinner'
import LearnCourse from './components/students/LearnCourse'
import StdDashboard from './pages/StDashboard'
import Index from './pages/Home'
import Profile from './pages/Profile'
import CourseView from './pages/NonTailored/CourseView'
import CourseLearn from './pages/NonTailored/CourseLearn'
import Courses from './pages/NonTailored/Courses'
import NTDashboard from './pages/NonTailored/NTDashboard'
import Navbar from './pages/NonTailored/Navbar'
import BottomFooter from './pages/NonTailored/Footer'
import MyProfile from './pages/NonTailored/MyProfile'
import LandingPage from './pages/NonTailored/LandingPage'
import { useAuth } from './contexts/AuthContext'
import TeacherDashboard from './pages/Teacher/TeacherDashboard'
import CourseForm from './pages/Teacher/CourseForm'
import CourseManagement from './pages/Teacher/CourseManagement'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const isAuthRoute = ['/login', '/register'].includes(location.pathname)
  const isTailored = user?.preferences?.learningApproach === 'tailored'

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Render header only for students (not teachers) */}
      {!isAuthRoute && (user?.role === 'teacher' ? <Navbar /> : 
        isTailored ? <Header /> : <Navbar />
      )}

      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            user?.role === 'teacher' ? <TeacherDashboard /> : 
            isTailored ? <Index /> : <LandingPage />
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Teacher routes */}
          {user?.role === 'teacher' && (
            <>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="teacher">
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/create"
                element={
                  <ProtectedRoute requiredRole="teacher">
                    <CourseForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id/edit"
                element={
                  <ProtectedRoute requiredRole="teacher">
                    <CourseForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id/manage"
                element={
                  <ProtectedRoute requiredRole="teacher">
                    <CourseManagement />
                  </ProtectedRoute>
                }
              />
            </>
          )}

          {/* Student routes - tailored */}
          {user?.role === 'student' && isTailored && (
            <>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StdDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute requiredRole="student">
                    <CoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id"
                element={
                  <ProtectedRoute requiredRole="student">
                    <CourseDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id/learn"
                element={
                  <ProtectedRoute requiredRole="student">
                    <LearnCourse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute requiredRole="student">
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </>
          )}

          {/* Student routes - non-tailored */}
          {user?.role === 'student' && !isTailored && (
            <>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="student">
                    <NTDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute requiredRole="student">
                    <Courses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id"
                element={
                  <ProtectedRoute requiredRole="student">
                    <CourseView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id/learn"
                element={
                  <ProtectedRoute requiredRole="student">
                    <CourseLearn />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute requiredRole="student">
                    <MyProfile />
                  </ProtectedRoute>
                }
              />
            </>
          )}

          {/* Not found route */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>

      {/* Render footer only for students (not teachers) */}
      {!isAuthRoute && user?.role === 'student' && (
        isTailored ? <Footer /> : <BottomFooter />
      )}
    </div>
  )
}

export default App
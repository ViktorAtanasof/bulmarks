import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, lazy } from 'react';

/*
import { Landmarks } from './pages/Landmarks';
import { Profile } from './pages/Profile';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { CreateLandmark } from './pages/CreateLandmark';
import { EditLandmark } from './pages/EditLandmark';
import { Landmark } from './pages/Landmark';
import { Category } from './pages/Category';
import { NotFound } from './pages/NotFound'; */

import { Home } from './pages/Home';
import { Header } from './components/Header';
import { PrivateRoute } from './components/PrivateRoute';
import { PublicRoute } from './components/PublicRoute';
import { Spinner } from './components/Spinner';

const Landmarks = lazy(() => import('./pages/Landmarks'));
const Profile = lazy(() => import('./pages/Profile'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const CreateLandmark = lazy(() => import('./pages/CreateLandmark'));
const EditLandmark = lazy(() => import('./pages/EditLandmark'));
const Landmark = lazy(() => import('./pages/Landmark'));
const Category = lazy(() => import('./pages/Category'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/sign-in' element={<PublicRoute />}>
            <Route path='/sign-in' element={<SignIn />} />
          </Route>
          <Route path='/sign-up' element={<PublicRoute />}>
            <Route path='/sign-up' element={<SignUp />} />
          </Route>
          <Route path='/forgot-password' element={<PublicRoute />}>
            <Route path='/forgot-password' element={<ForgotPassword />} />
          </Route>
          <Route path='/category/:categoryName/:landmarkId' element={<Landmark />} />
          <Route path='/category/:categoryName' element={<Category />} />
          <Route path='/landmarks' element={<Landmarks />} />
          <Route path='/create-landmark' element={<PrivateRoute />}>
            <Route path='/create-landmark' element={<CreateLandmark />} />
          </Route>
          <Route path='/edit-landmark' element={<PrivateRoute />}>
            <Route path='/edit-landmark/:landmarkId' element={<EditLandmark />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;

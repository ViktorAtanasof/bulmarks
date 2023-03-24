import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Home } from './pages/Home';
import { Landmarks } from './pages/Landmarks';
import { Profile } from './pages/Profile';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { PrivateRoute } from './components/PrivateRoute';
import { ForgotPassword } from './pages/ForgotPassword';
import { Header } from './components/Header';
import { CreateLandmark } from './pages/CreateLandmark';
import { EditLandmark } from './pages/EditLandmark';
import { Landmark } from './pages/Landmark';
import { Category } from './pages/Category';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/category/:categoryName/:landmarkId' element={<Landmark />} />
        <Route path='/category/:categoryName' element={<Category />} />
        <Route path='/landmarks' element={<Landmarks />} />
        <Route path='/create-landmark' element={<PrivateRoute />}>
          <Route path='/create-landmark' element={<CreateLandmark />} />
        </Route>
        <Route path='/edit-landmark' element={<PrivateRoute />}>
            <Route path='/edit-landmark/:landmarkId' element={<EditLandmark />}/>
        </Route>
        <Route path='*' element={<h1>404 Not Found</h1>} />
      </Routes>
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

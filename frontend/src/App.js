import { Routes, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { Landmarks } from './pages/Landmarks';
import { Profile } from './pages/Profile';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';

function App() {
  return (
    <>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/landmarks' element={<Landmarks />}/>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route path='/sign-up' element={<SignUp />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/forgot-password' element={<ForgotPassword />}/>
          <Route path='*' element={<h1>404 Not Found</h1>} />
        </Routes>
    </>
  );
}

export default App;

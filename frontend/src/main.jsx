import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import HomeScreen from './screens/HomeScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import CFScreen from './screens/CFScreen.jsx';
import CCScreen from './screens/CCScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<HomeScreen />} />
      <Route path='login' element={<LoginScreen />}></Route>
      <Route path='register' element={<RegisterScreen />}></Route>
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile'>
          <Route index element={<ProfileScreen />}></Route>
          <Route path='codeforces' element={<CFScreen />}></Route>
          <Route path='codechef' element={<CCScreen />}></Route>
        </Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
)

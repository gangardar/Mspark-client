import './App.css'
import { RouterProvider } from 'react-router-dom';
import route from './routes/route';
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <>
    <AuthProvider>
      <RouterProvider router={route} />
    </AuthProvider>
    </>
  )
}

export default App

import './App.css'
import { RouterProvider } from 'react-router-dom';
import route from './routes/route';
import { AuthProvider } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';

function App() {

  return (
    <>
    <SnackbarProvider>
      <AuthProvider>
        <RouterProvider router={route} />
      </AuthProvider>
    </SnackbarProvider>
    </>
  )
}

export default App

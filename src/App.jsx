import "./App.css";
import { RouterProvider } from "react-router-dom";
import route from "./routes/route";
import { AuthProvider } from "./context/AuthContext";
import { SnackbarProvider } from "./context/SnackbarContext";
import { SocketProvider } from "./context/SocketContext";

function App() {
  return (
    <>
      <SnackbarProvider>
        <AuthProvider>
          <SocketProvider>
            <RouterProvider router={route} />
          </SocketProvider>
        </AuthProvider>
      </SnackbarProvider>
    </>
  );
}

export default App;

import { Box } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./components/Auth/Login";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { Navigation } from "./components/Navigation";
import { TestData } from "./components/TestData";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Box>
          <Navigation />
          <Box sx={{ p: 3 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/test" element={<TestData />} />
              <Route
                path="/protected"
                element={
                  <ProtectedRoute>
                    <></>
                  </ProtectedRoute>
                }
              />
              {/* Other routes... */}
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

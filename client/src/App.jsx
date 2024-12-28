import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./pages/hompage";
import SignupPage from "./pages/signup.page";
import LoginPage from "./pages/login.page";
import SettingsPage from "./pages/settings.page";
import ProfilePage from "./pages/profile.page";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const {authUser,checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();

  

  useEffect(() => {
    checkAuth();
    console.log("Online Users:", onlineUsers);
  }, [checkAuth, onlineUsers]);

  if((isCheckingAuth && !authUser)){
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin"/> 
      </div>
    )
  }

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={!authUser? <Navigate to={"/login"}/> : <HomePage/>} />
        <Route path="/signup" element={!authUser? <SignupPage/> : <Navigate to={"/"}/>} />
        <Route path="/login" element={!authUser? <LoginPage/>: <Navigate to={"/"}/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={!authUser?  <Navigate to={"/login"}/> : <ProfilePage/>} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
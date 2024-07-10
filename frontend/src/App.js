import { Route,Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RighPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import {Toaster} from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
function App() {
  const{data,isLoading,error,isError}=useQuery({
    queryKey:['authUser'],
    queryFn: async ()=>{
      try {
				const res = await fetch("http://localhost:5000/api/auth/getme",{
					withCredentials:true,
					credentials:'include'
				});
	
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				console.log("auth user is here:",data);
				return data;
			} catch (error) {
        console.log("no token");
				console.log(error.message);
				throw error;
			}
    }
  });
  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar/>
      <Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/notifications' element={<NotificationPage />} />
				<Route path='/profile/:username' element={<ProfilePage />} />
			</Routes>
      <RightPanel/>
      <Toaster/>
    </div>
  );
}

export default App;

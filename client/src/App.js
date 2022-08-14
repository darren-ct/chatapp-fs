import {BrowserRouter,Route,Routes,Navigate} from "react-router-dom";
import {useState,useEffect,createContext} from "react";
import {QueryClient,QueryClientProvider} from "react-query";
import io from "socket.io-client";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
import Reset from "./pages/Reset";
import NewPassword from "./pages/NewPassword";
import LandingPage from "./pages/LandingPage";
import Error from "./pages/Error"


const queryClient = new QueryClient();
export const AppContext = createContext(null);


const socket = io.connect("http://localhost:5000");

function App() {
  
  const[user,setUser] = useState(null);
  const[resetToken,setResetToken] = useState(null)
  const token = user ? user.token : null;
  const isAdmin = user ? user.isAdmin : null;

  useEffect(()=>{
  //  get token first time
     const userInfo =  JSON.parse(localStorage.getItem("user"));

     if(!userInfo) return;

     setUser(userInfo);
  },[])

  useEffect(()=>{
    if(user){
      // save token to localstorage
      localStorage.setItem("user",JSON.stringify(user));
    }
    },[user])


  return (
    <AppContext.Provider value={{user,setUser,token,isAdmin,resetToken,setResetToken,socket}}>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
            <Routes>
            <Route path="/landing" element={!token? <LandingPage/> : <Navigate to="/"/>} />
            <Route path="/login" element={!token ? <Login setUser={setUser}/> : <Navigate to="/"/>}/>
            <Route path="/signup" element={!token ?  <Signup setUser={setUser}/> : <Navigate to="/"/>}/>
            <Route path="/" element={token ? <Main/> : <Navigate to="/landing" /> } />
            <Route path="/reset" element={ resetToken ?   <Navigate to="/newpassword"/> : token ? <Navigate to="/"/> : <Reset />} />
            <Route path="/newpassword" element={resetToken ? <NewPassword/> : token ? <Navigate to="/"/> : <Navigate to="/login"/> } />
            <Route path="/error" element={<Error />} />
            </Routes>
    </BrowserRouter>
    </QueryClientProvider>
    </AppContext.Provider>
  );
}

export default App;

import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import About from "./pages/About"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Project from "./pages/Project"
import Header from "./components/Header"
import Footer from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"
import CreatePost from "./pages/CreatePost"
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute"


export default function App() {
  return (
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/signin" element={<SignIn/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
          </Route>
          <Route element={<OnlyAdminPrivateRoute/>}>
          <Route path="/create-post" element={<CreatePost/>}/>
          </Route>
          <Route path="/project" element={<Project/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    
  )
}

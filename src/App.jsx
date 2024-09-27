import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./admin/Login"
import Admin from "./admin/Admin"
import AdminLayout from "./admin/AdminLayout"
import Register from "./admin/Register"
import AddTask from "./admin/AddTask"
import EditTask from "./admin/EditTask"
import ViewAllTasks from "./admin/ViewAlllTasks"
import UserList from "./admin/UserList"
import UserLogin from "./user/UserLogin"
import UserRegister from "./user/UserRegister"
import Dashboard from "./user/Dashboard"
import UserLayout from "./user/UserLayout"

function App() {

  return (
    <BrowserRouter>
       <Routes>
          {/* <Route path="/user/*" element={<Home />}>
              <Route path="tasks" element={<UserTasks/>}/>
          </Route> */}
          <Route path="/admin/*" element={<AdminLayout />}>
              <Route path="" element={<Admin/>}/>
              <Route path="login" element={<Login/>}/>
              <Route path="register" element={<Register/>}/>
              <Route path=":userid/add-task" element={<AddTask />} />
              <Route path=":userid/edit/:taskid" element={<EditTask />} />
              <Route path="user-list" element={<UserList/>}/>
              <Route path="view-tasks" element={<ViewAllTasks/>}/>
          </Route>
         
          <Route path="/user/*" element={<UserLayout/>}>
              <Route path="" element={<Dashboard/>}/>
              <Route path="login" element={<UserLogin/>}/>
              <Route path="register" element={<UserRegister/>}/>
          </Route>


       </Routes>
    </BrowserRouter>
  )
}

export default App

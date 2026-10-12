import { useParams, Navigate, Outlet } from "react-router-dom"


function PrivateAdminRoute() {

  const {adminId} = useParams();
  
  if(!adminId){
    return <Navigate to='/admin/auth'  replace/>
  }
  return (
    <Outlet/>
  )
}

export default PrivateAdminRoute

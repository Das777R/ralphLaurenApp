
import { Outlet, Navigate, useParams } from "react-router-dom"



function PrivateRoute() {

  const {userId} = useParams();



  if(!userId){
    return <Navigate to="/bagSubmit" replace/>
  }

  return <Outlet/>
}

export default PrivateRoute

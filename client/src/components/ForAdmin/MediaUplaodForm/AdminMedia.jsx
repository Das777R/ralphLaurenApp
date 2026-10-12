import AdminSideBar from "../SideBar/AdminSideBar"
import MediaUploadForm from "./MediaUploadForm"
import AdminHeader from "../Head/AdminHeader"



function AdminMedia() {
  return (
   <div className="d-flex vh-100">
    <AdminHeader/>
    <AdminSideBar/>
    <MediaUploadForm/>
    </div>
  )
}

export default AdminMedia
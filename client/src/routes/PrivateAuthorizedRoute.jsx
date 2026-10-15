import { useEffect, useState } from "react";


import { Outlet , Navigate} from "react-router-dom";
import { refreshSession } from "../api/api";


function PrivateAuthorizedRoute() {
     const [status, setStatus] = useState('loading');

    useEffect(() => {
     let cancelled = false;

     refreshSession('user')
     .then((data) => {
      if(cancelled) return;
      setStatus(data?.role === 'user' && data.userId ? 'authed' : 'denied');
     })
     .catch(() => {
      if(!cancelled) setStatus('denied')
     });

     return () => cancelled = true;
    },[])

    if(status === 'loading') return null;
    if(status === 'denied') return <Navigate to='/auth' replace />

  return (
      <Outlet/>
  )
}

export default PrivateAuthorizedRoute

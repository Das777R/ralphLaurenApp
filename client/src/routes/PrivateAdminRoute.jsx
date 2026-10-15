// import { useEffect, useState } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { refreshSession } from '../api/api';

// function PrivateAdminRoute() {
//   const [status, setStatus] = useState('loading'); // 'loading' | 'authed' | 'denied'

//   useEffect(() => {
//     let cancelled = false;

//     refreshSession('admin')
//       .then((data) => {
//         if (cancelled) return;
//         const ok = data?.role === 'admin' && !!data?.userId;
//         if (!ok) console.warn('[admin guard] denied, response data:', data);
//         setStatus(ok ? 'authed' : 'denied');
//       })
//       .catch((err) => {
//         if (cancelled) return;
//         console.warn(
//           '[admin guard] refresh failed:',
//           err.response?.status,
//           err.response?.data?.message
//         );
//         setStatus('denied');
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   if (status === 'loading') return null;
//   // if (status === 'denied') return <Navigate to="/admin/auth" replace />;

//   return <Outlet />;
// }

// export default PrivateAdminRoute;
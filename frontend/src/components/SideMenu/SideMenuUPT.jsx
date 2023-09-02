import { Link } from "react-router-dom";
import { SideMenuItem } from "../SideMenuItem";


export const SideMenuUPT = () => {
  const userName = localStorage.getItem('user_name');
  const userRoles = localStorage.getItem('user_roles');
  const userSlug = localStorage.getItem('user_slug');

    return (
      <div className="side-menu h-100 " id="sticky-sidebar">
        <Link
          to="/dashboard/upt"
          className="side-menu-header d-flex justify-content-center"
        >
          <img className="w-75 p-4" src="/simamat/logo.png" alt="logo" />
        </Link>
        <div className="side-menu-list d-flex flex-col">
          <SideMenuItem title="DASHBOARD" id="/dashboard/upt" />
        </div>
        <h6 className="ps-4 font-semibold">DATA UPT</h6>
        <div className="side-menu-list d-flex flex-col p-0">
          <SideMenuItem title={userRoles} id={"/upt/"+userRoles+"/upt"} />
        </div>
      </div>
    );
};


// const city = getCookie("city") => 'kediri'
// return (
//   <div className="side-menu border">
//     <Link
//       to="/dashboard"
//       className="side-menu-header d-flex justify-content-center"
//     >
//       <img className="w-75 p-4" src="/logo.png" alt="logo" />
//     </Link>
//     <div className="side-menu-list d-flex flex-col">
//       <SideMenuItem title="DASHBOARD" id="/dashboard" />

//     </div>
//     <h6 className="ps-4 font-semibold">DATA UPT</h6>
//     <div className="side-menu-list d-flex flex-col p-0">
//       <SideMenuItem title=`UPT ${city.toUpperCase()}`` id=`/upt/${city}` />
//     </div>
//   </div>
// );
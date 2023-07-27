import { Link } from "react-router-dom";
import { SideMenuItem } from "../SideMenuItem";

export const SideMenuAdmin = () => {
    return (
      <div className="side-menu border">
        <Link
          to="/dashboard/admin"
          className="side-menu-header d-flex justify-content-center"
        >
          <img className="w-75 p-4" src="/logo.png" alt="logo" />
        </Link>
        <div className="side-menu-list d-flex flex-col">
          <SideMenuItem title="DASHBOARD" id="/dashboard/admin" />
          <SideMenuItem title="MANAJEMEN USER" id="/manajemenuser/admin" />
          <SideMenuItem title="PUSDA JATIM" id="/upt/pusdajatim/admin" />
        </div>
        <h6 className="ps-4 font-semibold">DATA UPT</h6>
        <div className="side-menu-list d-flex flex-col p-0">
          <SideMenuItem title="UPT KEDIRI" id="/upt/Upt Psda Kediri/admin" />
          <SideMenuItem title="UPT LUMAJANG" id="/upt/Upt Psda Lumajang/admin" />
          <SideMenuItem title="UPT BONDOWOSO" id="/upt/Upt Psda Bondowoso/admin" />
          <SideMenuItem title="UPT PASURUAN" id="/upt/Upt Psda Pasuruan/admin" />
          <SideMenuItem title="UPT BOJONEGORO" id="/upt/Upt Psda Bojonegoro/admin" />
          <SideMenuItem title="UPT PAMEKASAN" id="/upt/Upt Psda Pamekasan/admin" />
        </div>
      </div>
    );
};

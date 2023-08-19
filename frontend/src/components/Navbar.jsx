import { Dropdown } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const navigate = useNavigate()
  const params = useParams();
  const id = params.id;

  const [pageTitle, setPageTitle] = useState("");
  const [userName, setUserName] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("token");
    localStorage.removeItem("password");
    localStorage.removeItem("email");
    localStorage.removeItem("active_author_id");
    localStorage.removeItem("user_roles");
    localStorage.removeItem("auth");
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) navigate("/");

    let name = localStorage.getItem('user_name');
    setUserName(name);

    switch (id) {
      case "pusdajatim":
        localStorage.setItem('active_author_id', 1);
        setPageTitle('PUSDA JATIM');
        break;

      case "Upt Psda Kediri":
        localStorage.setItem('active_author_id', 2);
        setPageTitle('UPT PUSDA WS Brantas di Kediri');
        break;

      case "Upt Psda Lumajang":
        localStorage.setItem('active_author_id', 3);
        setPageTitle('UPT PUSDA WS Bondoyudo di Lumajang');
        break;

      case "Upt Psda Bondowoso":
        localStorage.setItem('active_author_id', 4);
        setPageTitle('UPT PUSDA WS Sampean Setail di Bondowoso');
        break;

      case "Upt Psda Pasuruan":
        localStorage.setItem('active_author_id', 5);
        setPageTitle('UPT PUSDA WS Welang Pekalen di Pasuruan');
        break;

      case "Upt Psda Bojonegoro":
        localStorage.setItem('active_author_id', 6);
        setPageTitle('UPT PUSDA WS Bengawan Solo di Bojonegoro');
        break;

      case "Upt Psda Pamekasan":
        localStorage.setItem('active_author_id', 7);
        setPageTitle('UPT PUSDA WS Kepulauan Madura di Pamekasan');
        break;

      default:
        setPageTitle('UPT PU-SDA JAWA TIMUR');
    }
  }, [id]);

  return (
    <div className="navbar ">
      <div>
        <p className="m-0">DATA ASET</p>
        <h2 className="font-semibold">{pageTitle}</h2>
      </div>
      <Dropdown>
        <Dropdown.Toggle variant="none" id="dropdown-basic">
          <div className="d-flex  gap-2 h-100">
            <span>
              Hi, <span className="text-cyanblue font-semibold">{userName}</span>
            </span>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <div
            className="d-flex justify-content-center align-items-center px-2"
            style={{ color: "red" }}
            onClick={() => {
              handleLogout();
            }}
          >
            <FiLogOut />
            <Dropdown.Item style={{ color: "red" }} href="/">
              Logout
            </Dropdown.Item>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
};

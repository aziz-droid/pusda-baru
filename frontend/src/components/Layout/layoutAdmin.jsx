import React, { useState } from "react";
import { Navbar } from "../Navbar";
import { SideMenuAdmin } from "../SideMenu/SideMenuAdmin";
import { Button, Collapse } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function LayoutAdmin({ children, ...rest }) {
  const [show, setShow] = useState(true);
  const handleShow = () => setShow(true);
  return (
    <div className="container-fluid">

     <div className="row py-3">
     <Collapse in={show} dimension="width">

        <div className="col-3" id="sticky-sidebar">
            <div className="sticky-top">
          <div id="example-collapse-text " className="">
      <SideMenuAdmin />
      </div>
      
        </div>
        
        </div>
        </Collapse>

      <div className="w-100 h-100 col container" id="main">
        <div className=" ">
      <Navbar />
      </div>
     
        <main className="bg-light-gray h-100 border ">
       
<Button
onClick={() => setShow(!show)}
aria-controls="example-collapse-text"
aria-expanded={show}
className="position-absolute  top-50 translate-middle mx-2 bg-cyanblue "
>
{!show ? (<FaArrowRight/>): <FaArrowLeft/>}
</Button>
          {children}
        </main>
      </div>
      </div>
    </div>
  );
}

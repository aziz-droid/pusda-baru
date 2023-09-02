import React, { useState } from "react";
import { Navbar } from "../Navbar";
import { SideMenuUPT } from "../SideMenu/SideMenuUPT";
import { Button, Collapse } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";


export default function LayoutUPT({ children }) {
  const [show, setShow] = useState(true);
  const handleShow = () => setShow(true);
  return (
    <div className="container-fluid">
      <div className="row py-3">
        <Collapse in={show} dimension="width">
        <div className={`${show ? 'col-3' : 'col-0'}`} id="sticky-sidebar">
        {/* <div className="col-3 bg-primary"> */}
        <div className=" side-menu " >
      <SideMenuUPT />
      </div>
        </div>
        {/* </div>
            </div> */}
        {/* </div> */}
        </Collapse>

        <div className={`col h-100 animasi  container ${show ? 'w-75' : 'w-100'}`} id="main">
          <div className=" ">
            <Navbar />
          </div>

          <main className="bg-light-gray h-100 border w-100 ">
            <Button
              onClick={() => setShow(!show)}
              aria-controls="example-collapse-text"
              aria-expanded={show}
              className="position-fixed  top-50 translate-middle mx-1 bg-cyanblue"
            >
              {!show ? <FaArrowRight /> : <FaArrowLeft />}
            </Button>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

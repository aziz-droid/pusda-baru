import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Swal from "sweetalert2";

export const ModalPembayaran = ({
  show,
  handleClose,
  parentPayment,
  setParentPayment,
  setEmptyMsg,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const params = useParams();

  const [payment, setPayment] = useState({
    childrens_id: params.children_id,
    year: "",
    proof_of_payment: "",
    payment_amount: "",
  });

  
  // fungsi handlesubmit yang berfungsi untuk mengirim data dari form lalu dikirim ke url API tambah informasi pembayaran
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let token = localStorage.getItem("token");
      const formData = new FormData();

      for (const key in payment) {
        formData.append(key, payment[key]);
      }
      formData.append("token", token);

      let res = await fetch(apiUrl + "payment/create", {
        method: "POST",
        body: formData,
      });

      let resJson = await res.json();

      if (res.status != 201) {
        let message = resJson.message;
        if (!Array.isArray(message)) message = [resJson.message];

        let messageList = "";
        message.forEach((item) => {
          messageList += "<li>" + item + "</li>";
        });

        return Swal.fire({
          icon: "error",
          title: "Oops...",
          html: messageList,
          // text: messageList,
          // timer: 1000,
        });

        // return setMessage(message);
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: resJson.message,
        timer: 1000,
      });

      setPayment({
        childrens_id: params.children_id,
        year: "",
        proof_of_payment: "",
        payment_amount: "",
      });

      handleClose();

      const newData = resJson.data[0];
      setParentPayment([...parentPayment, newData]);

      setEmptyMsg("");
    } catch (error) {
      console.log(error);
    }
  };
  const [file, setFile] = useState();
  const uploadRef = useRef();
  const statusRef = useRef();
  const loadTotalRef = useRef();
  const progressRef = useRef();

  
  const UploadFile = () => {
    const file = uploadRef.current.files[0];
    setFile(URL.createObjectURL(file));
    var formData = new FormData();
    formData.append("image", file);
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", ProgressHandler, false);
    xhr.addEventListener("load", SuccessHandler, false);
    xhr.addEventListener("error", ErrorHandler, false);
    xhr.addEventListener("abort", AbortHandler, false);
    xhr.open("POST", "fileupload.php");
    xhr.send(formData);
  };

  const ProgressHandler = (e) => {
    loadTotalRef.current.innerHTML = `${
      uploadRef.current.files[0].name
    } uploaded ${Math.round(e.loaded / 1024)}K bytes of ${Math.round(
      e.total / 1024
    )}K    bytes`;
    var percent = (e.loaded / e.total) * 100;
    progressRef.current.value = Math.round(percent);
    statusRef.current.innerHTML = Math.round(percent) + "% uploaded...";
  };

  const SuccessHandler = (e) => {
    statusRef.current.innerHTML = e.target.responseText;
    progressRef.current.value = 0;
  };

  const ErrorHandler = () => {
    statusRef.current.innerHTML = "upload failed!!";
  };
  const AbortHandler = () => {
    statusRef.current.innerHTML = "upload aborted!!";
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        className="d-flex justify-content-center align-items-center"
      >
        <Modal.Header closeButton>
          <Modal.Title>Informasi Pembayaran</Modal.Title>
          {/* <div className="error-text-container w-100">
                        {message.map((item, key) => {
                            return (
                                <div className="text-danger" key={key}>
                                    {item}
                                </div>
                            );
                        })}
                    </div> */}
        </Modal.Header>
        <Modal.Body className="py-3">
          <form className="d-flex flex-col form-tambah-tanah gap-2">
            <div>
              <label htmlFor="nilai-sewa">Tahun</label>
              <input
                type="text"
                className="w-100"
                name="nilai-sewa"
                placeholder="Masukkan Tahun"
                value={payment.year}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    year: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="nilai-sewa">Jumlah Pembayaran</label>
              <input
                type="text"
                className="w-100"
                name="nilai-sewa"
                placeholder="Masukkan jumlah pembayaran"
                value={payment.payment_amount}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    payment_amount: e.target.value,
                  })
                }
              />
            </div>
            <div className="d-flex flex-col">
              <label className="font-semibold">Bukti Pembayaran</label>
              <label
                htmlFor="surat-permohonan"
                className="font-semibold file-input d-flex flex-col justify-content-center align-items-center"
              >
                <img src="/upload.png" width={80} />
                <p className="p-0 m-0">
                  Drag & drop files or{" "}
                  <span style={{ color: "#483EA8" }}>Browse</span>
                </p>
                <p className="secondary-text">
                  Supported formates: JPEG, PDF
                </p>
              </label>
              <input
                type="file"
                accept="application/pdf, image/jpeg, image/jpg"
                className="d-none"
                id="surat-permohonan"
                ref={uploadRef}
                onChange={(e) => {
                  setPayment({
                    ...payment,
                    proof_of_payment: e.target.files[0],
                  });
                  UploadFile();
                }}
              />
              <p ref={loadTotalRef}></p>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button className="primary-btn px-5" onClick={handleSubmit}>
            Simpan Data
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

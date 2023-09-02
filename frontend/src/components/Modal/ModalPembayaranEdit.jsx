import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Swal from "sweetalert2";

export const ModalPembayaranEdit = ({
  showEdit,
  handleCloseEdit,
  parentPayment,
  setParentPayment,
  paymentEdit,
  setPaymentEdit,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [message, setMessage] = useState([]);

  // fungsi handlesubmit yang berfungsi untuk mengirim data dari form lalu dikirim ke url API edit informasi pembayaran
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let token = localStorage.getItem("token");
      const formData = new FormData();

      for (const key in paymentEdit) {
        formData.append(key, paymentEdit[key]);
      }
      formData.append("token", token);

      let res = await fetch(apiUrl + "payment/update/" + paymentEdit.id, {
        method: "POST",
        body: formData,
      });

      let resJson = await res.json();

      if (res.status != 200) {
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

      handleCloseEdit();

      const newData = resJson.data;
      setParentPayment(
        parentPayment.map((p) => {
          if (p.id === newData.id) {
            return {
              ...p,
              childrens_id: newData.childrens_id,
              year: newData.year,
              proof_of_payment: newData.proof_of_payment,
              payment_amount: newData.payment_amount,
            };
          } else {
            return p;
          }
        })
      );
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
        show={showEdit}
        onHide={handleCloseEdit}
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
                value={paymentEdit.year}
                onChange={(e) =>
                  setPaymentEdit({
                    ...paymentEdit,
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
                value={paymentEdit.payment_amount}
                onChange={(e) =>
                  setPaymentEdit({
                    ...paymentEdit,
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
                <img src="/upload.png" width={80} alt="" />
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
                  setPaymentEdit({
                    ...paymentEdit,
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

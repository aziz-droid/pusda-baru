import { useState } from "react";
import { Button } from "react-bootstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const LupaPasswordForm = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState([]);
  const [input, setInput] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage([]);

    // validate
    if (input.password !== input.password_confirmation) {
      return setMessage(["Password dan Konfirmasi Password tidak sama"]);
    }

    try {
      let token = localStorage.getItem("token");

      let res = await fetch(apiUrl + "password/reset", {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + token,
        },
      });

      let resJson = await res.json();

      if (res.status != 200) {
        let message = resJson.message;

        if (!Array.isArray(message)) message = [resJson.message];

        // Jika ingin menggunakan sweetalert2 untuk menampilkan pesan error \
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
        // return setMessage([resJson.status]);
        Swal.fire({
          icon: "success",
          title: "Berhasil Mengubah Kata Sandi",
          text: resJson.message,
        //   timer: 5000,
        });
      return navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-col justify-content-center align-items-center h-100 w-75 gap-1"
    >
      <div className="form-group w-100">
        <label htmlFor="email">Email</label>
        <input
          className="rounded"
          type="email"
          name="email"
          id="email"
          placeholder="Masukkan Email"
          value={input.email}
          onChange={(e) =>
            setInput({
              ...input,
              email: e.target.value,
            })
          }
          required
        />
      </div>
      <div className="form-group w-100 position-relative">
        <label htmlFor="password">Kata Sandi Baru</label>
        <input
          className="rounded"
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder="Min. 8 karakter"
          value={input.password}
          onChange={(e) =>
            setInput({
              ...input,
              password: e.target.value,
            })
          }
          required
        />
        <div className="position-absolute top-icon-eye end-0">
          <div
            className="btn btn-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEye /> : <FiEyeOff />}
          </div>
        </div>
      </div>
      <div className="form-group w-100 position-relative">
        <label htmlFor="password">Konfirmasi Kata Sandi Baru</label>
        <input
          className="rounded"
          type={showConfirmPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder="Min. 8 karakter"
          value={input.password_confirmation}
          onChange={(e) =>
            setInput({
              ...input,
              password_confirmation: e.target.value,
            })
          }
          required
        />
        <div className="position-absolute top-icon-eye end-0">
          <div
            className="btn btn-none"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
          </div>
        </div>
      </div>

      {/* Error text container */}
      <div className="error-text-container w-100">
        {message.map((item, key) => {
          return (
            <div className="text-danger" key={key}>
              {" "}
              {item}{" "}
            </div>
          );
        })}
      </div>

      <div className="form-group submit-btn w-100 gap-2">
      <Button
        type="submit"
        className="rounded bg-cyanblue text-light form-btn mt-2 font-semibold text-center"
        // loading={isLoading}
      >
        Reset Kata Sandi
      </Button>

      <Link
        to="/"
        className="rounded text-cyanblue form-btn bg-none font-semibold text-center"
      >
        Kembali ke Halaman Login
      </Link>
      </div>
    </form>
  );
};

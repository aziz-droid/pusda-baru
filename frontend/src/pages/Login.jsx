import { LoginForm } from "../components/Home/LoginForm"
import { useEffect } from "react";
// import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

export const Login = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    // const navigate = useNavigate();
    const input = {
        email: (localStorage.getItem('email') ? localStorage.getItem('email') : 'huu@gmail.com'),
        password: (localStorage.getItem('password') ? localStorage.getItem('password') : '34323'),
    }

    // Menggunakan useEffect untuk melakukan proses login data yang terkirim dari form ke url api login
    useEffect(() => {
        async function fetchData() {
            try {
                let res = await fetch(apiUrl + "login", {
                    method: "POST",
                    body: JSON.stringify(input),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })

                let resJson = await res.json();

                // if(res.status === 422){
                //     console.log("oke")
                // }

                if (res.status === 422) {
                   


                } else {
                    // Check roles
                    localStorage.setItem('user_id', resJson.user.id);
                    localStorage.setItem('user_name', resJson.user.name);
                    localStorage.setItem('user_slug', resJson.user.slug);
                    localStorage.setItem('token', resJson.token);


                    Swal.fire({
                        title: 'Berhasil Login',
                        icon: 'success',
                        text: `${resJson.message} ${resJson.user.name}`,
                        timer: 1000,
                        // showConfirmButton: false,
                        // backdrop: false,
                        // position: 'top',
                    })

                    let roles = resJson.user.roles;
                    if (roles.filter(e => e.name === 'admin').length > 0) {
                        window.location = '/dashboard/admin';
                    } else {
                        window.location = '/dashboard/upt'
                        console.log("upt")
                    }


                }
            } catch (error) {
                // console.log(error);
            }
        }

        fetchData()
    }, [input.password])


    return (
        <div className="home d-flex flex-row justify-content-center align-items-center">
            {/* pict */}
            <div className="hero-picture">
                <div className="bg-cyanblue">
                    <img src="/pusda.jpeg" alt="home cover" style={{ objectFit:'cover' }} />
                </div>
            </div>

            {/* form */}
            <div className="d-flex flex-col justify-content-center align-items-center w-100">
                <img className="hero-logo" src="/logo.png" alt="logo" />
                <h2 className="font-semibold">Selamat Datang!</h2>
                <p>Masuk dengan akun milikmu yang sudah terdaftar.</p>
                <LoginForm />
            </div>
        </div>
    )
}
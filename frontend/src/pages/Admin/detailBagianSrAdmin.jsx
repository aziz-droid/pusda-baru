import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import LayoutAdmin from "../../components/Layout/layoutAdmin";
import { ModalPembayaran } from "../../components/Modal/ModalPembayaran";
import { ModalPembayaranEdit } from "../../components/Modal/ModalPembayaranEdit";
import { ButtonDelete } from "../../components/Button/ButtonDelete";
import { TablePembayaran } from "../../components/Table/TablePembayaran";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { MapContainer, Marker, TileLayer, useMap  } from 'react-leaflet'
import {Icon} from 'leaflet'

import markerIconPng from "leaflet/dist/images/marker-icon.png"


// Mendefinisikan koordinat pusat peta
const center = {
    // Bujur dari pusat peta
     lng: 112.1716087070837,
    // Lintang dari pusat peta
    lat: -7.516677410514516,
  };

// Mendefinisikan komponen DetailBagianSrAdmin
export const DetailBagianSrAdmin = () => {
    // Mendapatkan URL backend dari variabel environment
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
   
    // Mendapatkan URL API dari variabel environment
    const apiUrl = process.env.REACT_APP_API_URL;
    // Mendefinisikan fungsi navigasi
    const navigate = useNavigate();
    // Mendefinisikan state untuk menampilkan modal
    const [show, setShow] = useState(false);
    // Mendefinisikan state untuk menampilkan modal edit
    const [showEdit, setShowEdit] = useState(false);
    // Mendapatkan parameter URL
    const params = useParams();

    // Fungsi untuk menutup modal
    const handleClose = () => setShow(false);
    // Fungsi untuk menampilkan modal
    const handleShow = () => setShow(true);
    // Fungsi untuk menutup modal edit
    const handleCloseEdit = () => setShowEdit(false);
    // Fungsi untuk menampilkan modal edit
    const handleShowEdit = () => setShowEdit(true);

    // Fungsi untuk memformat tanggal menjadi format yyyy-mm-dd
    const formatDate = (date) => {
        const d = new Date(date);
        const month = `${d.getMonth() + 1}`.padStart(2, "0");
        const day = `${d.getDate()}`.padStart(2, "0");
        const year = d.getFullYear();
        return [year, month, day].join("-");
    };

    // Fungsi untuk memformat angka menjadi format mata uang Indonesia
    const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    });

    // Fungsi untuk memetakan jenis pembayaran
    const mapType = (str) => {
        if (str === "sewa_sip_bmd") return "Sewa/SIP BMD";
        else if (str === "retribusi") return "Retribusi";

        return null;
    };

    // Fungsi untuk menangani klik halaman
    const handlePageClick = (e) => {
        if (e.selected >= 0) {
            setPageNum(e.selected + 1);
        }
    };

    // Mendefinisikan state untuk menyimpan data anak
    const [children, setChildren] = useState({});
    // Mendefinisikan state untuk menyimpan data pembayaran
    const [payment, setPayment] = useState([]);
    // Mendefinisikan state untuk menyimpan nomor halaman
    const [pageNum, setPageNum] = useState(1);
    // Mendefinisikan state untuk menyimpan jumlah halaman
    const [pageCount, setPageCount] = useState(0);
    // Mendefinisikan state untuk menyimpan titik awal
    const [startingPoint, setStartingPoint] = useState(0);
    // Mendefinisikan state untuk menyimpan pesan kosong
    const [emptyMsg, setEmptyMsg] = useState("");
    // Mendefinisikan state untuk menyimpan data pembayaran yang diedit
    const [paymentEdit, setPaymentEdit] = useState({});
    // Mendefinisikan state untuk menyimpan pusat peta
    const [centers, setCenters] = useState(center)
    // Mendefinisikan state untuk menyimpan latitude
    const [latitude, setLatitude] = useState("");
    // Mendefinisikan state untuk menyimpan longitude
    const [longitude, setLongitude] = useState("");

    // Mendefinisikan state untuk menyimpan trigger penghapusan
    const [triggerDeleted, setTriggerDeleted] = useState(false);

    // Menggunakan useEffect untuk melakukan fetch data anak dan pembayaran
    useEffect(() => {
        // console.log("param", params)
        let token = localStorage.getItem("token");

        // Fungsi untuk melakukan fetch data anak
        const fetchChildren = async () => {
            try {
                let res = await fetch(
                    apiUrl + "childer/" + params.children_id,
                    {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json; charset=UTF-8",
                            Authorization: "Bearer " + token,
                        },
                    }
                );

                let resJson = await res.json();

                if (res.status !== 200) {
                    return console.log(resJson.message);
                }

                let resData = resJson.data;
                // console.log({resData})
                setChildren(resData);
                setLatitude(resData?.latitude);
                setLongitude(resData?.longitude);
        
               let center = {
                    lng: resData.longitude,
                        lat: resData.latitude
                }
               
                setCenters(center)
            } catch (error) {
                console.log(error);
            }
        };

        // Fungsi untuk melakukan fetch data pembayaran
        const fetchPayment = async () => {
            try {
                let res = await fetch(
                    apiUrl +
                        "payment/all?page=" +
                        pageNum +
                        "&childrens_id=" +
                        params.children_id,
                    {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json; charset=UTF-8",
                            Authorization: "Bearer " + token,
                        },
                    }
                );

                let resJson = await res.json();

                if (res.status !== 200) {
                    return console.log(resJson.message);
                }

                setPageCount(resJson.data.last_page);
                setStartingPoint(
                    resJson.data.per_page * resJson.data.current_page -
                        (resJson.data.per_page - 1)
                );

                let resData = resJson.data.data;
                if (resData.length === 0) {
                    return setEmptyMsg("Tidak ada data");
                }

                setEmptyMsg("");

                setPayment(resData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchChildren().catch(console.error);
        fetchPayment().catch(console.error);
    }, [triggerDeleted, pageNum]);

    // Fungsi untuk mengimpor detail pembayaran admin
    const importDetailPaymentAdmin = () => {
        Swal.fire({
            title: "Import Data",
            text: "Upload file excel",
            input: "file",
            inputAttributes: {
                accept: ".xls,.xlsx,.csv, .xlx",
                "aria-label": "Upload your file",
                name: "file",
            },
            showCancelButton: true,
            confirmButtonText: "Upload",
            showLoaderOnConfirm: true,
            preConfirm: (file) => {
                let token = localStorage.getItem("token");
                let formData = new FormData();
                formData.append("file", file);
                formData.append("token", token);
                console.log({formData})
                console.log("id", children.id)
                return fetch(apiUrl + "import/file/payment/" + children.id, {
                    method: "POST",
                    body: formData,
                }).then((response) => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                }).catch((error) => {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                });
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Success!",
                    text: "Data berhasil diimport",
                    icon: "success",
                });

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Data gagal diimport",
                    icon: "error",
                });
            }
        });
    };
    // Fungsi untuk mengubah tampilan peta
    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
      }
    // Mengembalikan komponen yang akan ditampilkan
   
    return (
        <LayoutAdmin>
            {/* component modal untuk tambah data pembayaran */}
            <ModalPembayaran
                show={show}
                handleClose={handleClose}
                handleShow={handleShow}
                parentPayment={payment}
                setParentPayment={setPayment}
                setEmptyMsg={setEmptyMsg}
            />

            {/* component modal untuk tambah edit pembayaran */}
            <ModalPembayaranEdit
                showEdit={showEdit}
                handleCloseEdit={handleCloseEdit}
                handleShowEdit={handleShowEdit}
                parentPayment={payment}
                setParentPayment={setPayment}
                paymentEdit={paymentEdit}
                setPaymentEdit={setPaymentEdit}
            />

            <div
                className="d-flex justify-content-between align-items-center mx-3 py-3"
                style={{
                    borderBottom: "#BCBCBC 1px solid",
                }}
            >
                <div
                    className="font-semibold"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    &larr; &emsp; Kembali
                </div>
                <div className="d-flex gap-2">
                    <ButtonDelete
                        urlDelete={
                            apiUrl + "childer/delete/" + params.children_id
                        }
                        urlRedirect={
                            "/upt/" +
                            params.id +
                            "/admin/detail/" +
                            params.induk_id
                        }
                    />
                    <Link
                        to={
                            "/upt/" +
                            params.id +
                            "/admin/detail/" +
                            params.induk_id +
                            "/tanah-bagian-sr/edit/" +
                            params.children_id
                        }
                        className="primary-btn"
                    >
                        Ubah Data
                    </Link>
                </div>
            </div>
            <div className="mx-5">
                <h5 style={{ paddingBottom: "20px", paddingTop: "10px" }}>
                    Informasi Tanah Bagian
                </h5>
                <div className="d-flex informasi-tanah-bagian gap-5 justify-content-between">
                    <div className="left-form d-flex flex-col gap-3 w-100 ">
                        <div>
                            <label htmlFor="nilai-sewa">
                                Jenis Perikatan Pemanfaatans
                            </label>
                            <h5>
                                {mapType(children.utilization_engagement_type)}
                            </h5>
                        </div>
                        <div>
                            <label htmlFor="jenis-pemanfaatan">Atas Nama</label>
                            <h5>{children.utilization_engagement_name}</h5>
                        </div>
                        <div>
                            <label htmlFor="berlaku-dari">
                                Peruntukkan Pemanfaatan
                            </label>
                            <h5>{children.allotment_of_use}</h5>
                        </div>
                        <div>
                            <label htmlFor="koordinat">Latitude (LS BT)</label>
                        {children.latitude  !==  "" ? (

                            <h5>{children.latitude}</h5>
                        ):(
                            <h5 className=" fw-light fst-italic">Belum Di Isi</h5>
                        )}
                        </div>
                        <div>
                            <label htmlFor="koordinat">Longitude (LS BT)</label>
                            {children.longitude  !==  "" ? (

<h5>{children.longitude}</h5>
):(
<h5 className=" fw-light fst-italic">Belum Di Isi</h5>
)}
                        </div>
                        <div>
                        <label htmlFor="koordinat">Peta Lokasi</label>

                        {children.latitude && children.longitude !==  "" ? (
                            <>
{/* {console.log('ini children',children)} */}
                        <MapContainer center={[-7.246854784171441,112.73635667066236]}  zoom={8} scrollWheelZoom={false}>
                        <ChangeView center={centers} zoom={12} /> 

                        <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
  <Marker position={[latitude, longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
   
  </Marker>
</MapContainer>
</>
                        ) : (
                            <h5 className=" fw-light fst-italic">
                               
                            Belum Di Tentukan
                    </h5>
                        )}
                        </div>
                       
                    </div>
                    <div
                        className="right-form d-flex flex-col gap-3 w-100"
                        style={{ paddingRight: "100px" }}
                    >
                        <div>
                            <label htmlFor="luas-bagian">Luas Induk (m)</label>
                            <h5>{children.large}</h5>
                        </div>
                        <div>
                            <label htmlFor="luas-bagian">
                                Nilai Sewa/Retribusi (Rp/Tahun)
                            </label>
                            <h5>
                                {formatter.format(children.rental_retribution)}
                            </h5>
                        </div>
                        <div>
                            <label htmlFor="nomor-perikatan">
                                Masa Berlaku
                            </label>
                            <h5>
                                {formatDate(children.validity_period_of)} -{" "}
                                {formatDate(children.validity_period_until)}
                            </h5>
                        </div>
                        <div>
                            <label htmlFor="nomor-perikatan">
                                Nomor Perikatan
                            </label>
                            <h5>{children.engagement_number}</h5>
                        </div>
                        <div>
                            <label htmlFor="tanggal-perikatan">
                                Tanggal Perikatan
                            </label>
                            <h5>{formatDate(children.engagement_date)}</h5>
                        </div>
                        <div className="d-flex flex-col">
                            <label className="font-semibold">
                                Surat Perjanjian
                            </label>
                            {children.agreement_letter !== 'null' ? (
                            <h5 className="filename">
                                <a
                                    href={
                                        backendUrl + `agreementletter/` + children.agreement_letter
                                    }
                                    target="_blank" rel="noreferrer"
                                >
                                    SURAT PERJANJIAN-1.PDF
                                </a>
                            </h5>
                            ) : 
                            (
                                <h5 className=" fw-light fst-italic">
                               
                                    Belum Di Upload
                            </h5>
                            )}
                        </div>
                        <div className="d-flex flex-col">
                            <label className="font-semibold">
                                Surat Permohonan
                            </label>
                            {children.application_letter !== 'null' ? (

                            <h5 className="filename">
                                <a
                                    href={
                                        backendUrl + `applicationletter/` + children.application_letter
                                    }
                                    target="_blank" rel="noreferrer"
                                >
                                    SURAT PERMOHONAN-1.PDF
                                </a>
                            </h5>
                             ) : 
                             (
                                 <h5 className=" fw-light fst-italic">
                                
                                     Belum Di Upload
                             </h5>
                             )}
                        </div>
                    </div>
                </div>
                <div
                    className="d-flex justify-content-between align-items-center py-3"
                    style={{
                        borderBottom: "#BCBCBC 1px solid",
                    }}
                ></div>
                <div className="mx-3">
                    <div
                        className="d-flex flex-row justify-content-between px-3 py-3"
                        style={{ marginTop: "30px" }}
                    >
                        <h5>Informasi Pembayaran</h5>
                        <div className="d-flex">
                        <div
                                onClick={importDetailPaymentAdmin}
                                className="secondary-btn d-flex align-items-center me-2"
                                style={{ padding: "0 15px" }}
                            >
                                Import
                            </div>
                            <div
                                to="/upt/tambah"
                                className="primary-btn d-flex justify-content-center align-items-center"
                                onClick={() => {
                                    setShow(true);
                                }}
                            >
                                Tambah Data
                            </div>
                        </div>
                    </div>
                    <div className="table-informasi-pembayaran">
                        {emptyMsg === "" ? (
                            payment.map((item, key) => {
                                return (
                                    // menampilkan component table informasi pembayaran beserta tombol action edit dan delete
                                    <TablePembayaran
                                        iterator={startingPoint + key}
                                        payment={item}
                                        triggerDeleted={triggerDeleted}
                                        setTriggerDeleted={setTriggerDeleted}
                                        setShowEdit={setShowEdit}
                                        urlRedirect={window.location.href}
                                        setPaymentEdit={setPaymentEdit}
                                    />
                                );
                            })
                        ) : (
                            <>
                                <div className="text-center">{emptyMsg}</div>
                            </>
                        )}
                    </div>
                    <div className="pagination-container">
                        <ReactPaginate
                            nextLabel="next >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={pageCount}
                            previousLabel="< previous"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            containerClassName="pagination"
                            activeClassName="active"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    );
};

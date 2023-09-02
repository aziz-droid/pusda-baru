import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ButtonDelete } from "../../components/Button/ButtonDelete";
import { MapContainer, Marker, TileLayer, useMap  } from 'react-leaflet'
import {Icon} from 'leaflet'

import markerIconPng from "leaflet/dist/images/marker-icon.png"

import LayoutAdmin from "../../components/Layout/layoutAdmin";

// Mendefinisikan koordinat pusat peta
const center = {
     // Bujur dari pusat peta
      lng: 112.1716087070837,
     // Lintang dari pusat peta
     lat: -7.516677410514516,
  };
export const DetailBagianPppsAdmin = () => {
    // Mendapatkan URL backend dari variabel environment

    const apiUrl = process.env.REACT_APP_API_URL;

    // Mendefinisikan fungsi navigasi
    const navigate = useNavigate();
    // Mendapatkan parameter URL
    const params = useParams();

    // Fungsi untuk memformat angka menjadi format mata uang Indonesia
    const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    });

    // Fungsi untuk memetakan jenis pembayaran
    const mapType = (str) => {
        if (str === "pinjam_pakai") return "Pinjam Pakai";
        else if (str === "pakai_sendiri") return "Pakai Sendiri";

        return "";
    };

    // Mendefinisikan state untuk menyimpan data anak
    const [children, setChildren] = useState({});
    // Mendefinisikan state untuk menyimpan latitude
    const [latitude, setLatitude] = useState("");
    // Mendefinisikan state untuk menyimpan longitude
    const [longitude, setLongitude] = useState("");

    // Mendefinisikan state untuk menyimpan pusat peta
const [centers, setCenters] = useState(center)
//   const [centers, setCenters] = useState({lng:0,lat:0});

// eslint-disable-next-line react-hooks/exhaustive-deps
  
// fungsi untuk melakukan fetch data tanah bidang 
const fetchInduk = async (token) => {
    // console.log(token)
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

        // Menampilkan pesan error di console jika status response bukan 200
        if (res.status !== 200) {
            return console.log(resJson.message);
        }

        // Mengupdate state dengan data yang diterima dari API
        let resData = resJson.data;
        setChildren(resData);
        setLatitude(resData?.latitude);
        setLongitude(resData?.longitude);

       let center = {
            lng: resData.longitude,
                lat: resData.latitude
        }
      
        setCenters(center)
      
    } catch (error) {
        // Menampilkan error di console jika terjadi kesalahan
        console.log(error);
    }
};


    // Menggunakan useEffect untuk mendapatkan token dari localstorage yang kemudian dijadikan parameter untuk fungsi fetchInduk
    useEffect(() => {
        let token = localStorage.getItem("token");

       fetchInduk(token)
   
    }, []);
  
    // fungsi untuk merubah titik view lokasi sesuai dari database
    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
      }
    return (
        <LayoutAdmin>
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
                    {/* Button hapus data yang berisi props url api delete */}
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
                            "/tanah-bagian-ppps/edit/" +
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
                <div className="d-flex informasi-tanah-bagian ">
                    <div className="left-form d-flex flex-col gap-3  w-100 ">
                        <div>
                            <label htmlFor="nilai-sewa">
                                Jenis Perikatan Pemanfaatan
                            </label>
                            <h5>
                                {mapType(children.utilization_engagement_type)}
                            </h5>
                        </div>
                        <div>
                            <label htmlFor="berlaku-dari">
                                Peruntukkan Pemanfaatan
                            </label>
                            <h5>{children.allotment_of_use}</h5>
                        </div>
                        <div>
                            <label htmlFor="luas-bagian">Luas Bagian (m)</label>
                            <h5>{children.large}</h5>
                        </div>
                    </div>
                    <div
                        className="right-form d-flex flex-col gap-3 w-100 "
                    >
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
                            <label htmlFor="keterangan">Keterangan</label>
                            <h5>{children.description}</h5>
                        </div>
                       
                        <div className="">
                        <label htmlFor="koordinat">Peta Lokasi</label>
                        {children.latitude && children.longitude !==  "" ? (
                            <>
                            {/* menampilkan maps */}
                        <MapContainer center={[-7.246854784171441,112.73635667066236]}  zoom={8} scrollWheelZoom={false}>
                        <ChangeView center={centers} zoom={12} /> 

                        <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* menampilkan marker berwarna biru dengan position yang didapatkan dari state latitude dan longitude */}
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
                </div>
                <div
                    className="d-flex justify-content-between align-items-center py-3"
                    style={{
                        borderBottom: "#BCBCBC 1px solid",
                    }}
                ></div>
            </div>
        </LayoutAdmin>
    );
};

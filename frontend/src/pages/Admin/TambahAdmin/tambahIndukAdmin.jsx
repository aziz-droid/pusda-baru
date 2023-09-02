import { useEffect, useMemo, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "../../../components/Layout/layoutAdmin";
import { MapContainer, Marker, Popup, TileLayer, useMap, Circle  } from 'react-leaflet'
// import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import {Icon, latLng} from 'leaflet'

import markerIconPng from "leaflet/dist/images/marker-icon.png"
// import osm from "./osm-providers";


import Swal from "sweetalert2";


    // Mendefinisikan koordinat pusat peta
    const center = {
        lng: 112.1716087070837,
        lat: -7.516677410514516,
        
    };
    // Fungsi utama komponen TambahIndukAdmin
    export const TambahIndukAdmin = () => {
        // Mendapatkan URL API dari environment variable
        const apiUrl = process.env.REACT_APP_API_URL;

        // Mendapatkan fungsi navigate dari react-router-dom
        const navigate = useNavigate();
        // Mendapatkan parameter dari URL
        const params = useParams();
        // // Mendefinisikan state untuk layer peta
        // const [mapLayers, setMapLayers] = useState();

        // // Mendefinisikan level zoom untuk peta
        // const ZOOM_LEVEL = 12;
        // // Mendefinisikan ref untuk peta
        // const mapRef = useRef();

        // Mendefinisikan state untuk data induk
        const [induk, setInduk] = useState({
            auhtor: localStorage.getItem('active_author_id'),
            certificate_number: "",
            certificate_date: "",
            address: "",
            large: "",
            latitude:"",
            longitude:"",
            asset_value: "",
            item_name: "",
            upt: params.id
        });

        

        // Fungsi untuk menangani submit form
        const handleSubmit = async (e) => {
            // Mencegah aksi default form
            e.preventDefault();

            // Menampilkan data induk di console
            console.log({induk})
            try {
                // Mendapatkan token dari local storage
                let token = localStorage.getItem("token");

                // Melakukan request ke API untuk membuat data induk
                let res = await fetch(apiUrl + "parent/create", {
                    method: "POST",
                    body: JSON.stringify({
                        ...induk,
                        token,
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });

                // Mengubah response menjadi JSON
                let resJson = await res.json();

                // Jika status response bukan 201, menampilkan pesan error
                if (res.status !== 201) {
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
                    });

                }

                // Jika berhasil, menampilkan pesan sukses dan mengarahkan ke halaman admin
                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: resJson.message,
                    timer: 1000,
                });

                return navigate("/upt/" + params.id + "/admin");
            } catch (error) {
                // Menampilkan error di console
                console.log(error);
            }
        };

        // Mendefinisikan ref untuk marker
        const markerRef = useRef(null);

        // Mendefinisikan state untuk posisi marker
        const [position, setPosition] = useState(center);
        // Mendefinisikan state untuk latitude dan longitude
        const [latitude, setLatitude] = useState("");
        const [longitude, setLongitude] = useState("");
  
        // Mendefinisikan event handler untuk marker
        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current;
                    if (marker != null) {
                        setPosition(marker.getLatLng());
                        
                        setLatitude(marker.getLatLng().lat);
                        setLongitude(marker.getLatLng().lng);
  
                        setInduk({
                            ...induk,
                            latitude: marker.getLatLng().lat,
                            longitude: marker.getLatLng().lng,
                        })
                        
                    }
                },
            }),
            [latitude, longitude, induk]
        );
        // Render komponen
        return (
            <LayoutAdmin>
                <div
                    className="d-flex justify-content-between align-items-center mx-3 py-3"
                    style={{
                        borderBottom: "#BCBCBC 1px solid",
                    }}
                >
                    <div className="font-semibold" style={{ cursor: "pointer" }}>
                        <div
                            className="font-semibold"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            &larr; &emsp; Kembali
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <div
                            className="text-center"
                            style={{
                                cursor: "pointer",
                                border: "#DC2F2F 1px solid",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                color: "#DC2F2F",
                                width: "120px",
                            }}
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            Batal
                        </div>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="primary-btn"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
                <div className="m-3">
                    <h5 style={{ paddingBottom: "20px" }}>Tambah Tanah Induk</h5>

                    <form className="form-tambah-tanah d-flex flex-col gap-3 px-5">
                        <div>
                            <label htmlFor="nama-jenis-barang">
                                Nama/Jenis Barang
                            </label>
                            <input
                                type="text"
                                className="w-100"
                                name="nama-jenis-barang"
                                placeholder="Masukkan nama/jenis barang"
                                value={induk.item_name}
                                onChange={(e) =>
                                    setInduk({
                                        ...induk,
                                        item_name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="nilai-aset">Nilai Aset</label>
                            <input
                                type="text"
                                className="w-100"
                                name="nilai-aset"
                                placeholder="Masukkan nilai aset"
                                value={induk.asset_value}
                                onChange={(e) =>
                                    setInduk({
                                        ...induk,
                                        asset_value: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <p className="p-0 m-0">Sertifikat</p>
                            <div className="d-flex gap-2">
                                <div className="d-flex flex-col">
                                    <label htmlFor="sertifikat-nomor">Nomor</label>
                                    <input
                                        type="text"
                                        id="sertifikat-nomor"
                                        placeholder="Ex : 1"
                                        style={{ width: "100px" }}
                                        value={induk.certificate_number}
                                        onChange={(e) =>
                                            setInduk({
                                                ...induk,
                                                certificate_number: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="d-flex flex-col">
                                    <label htmlFor="sertifikat-tanggal">
                                        Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        id="sertifikat-tanggal"
                                        style={{ width: "fit-content" }}
                                        value={induk.certificate_date}
                                        onChange={(e) =>
                                            setInduk({
                                                ...induk,
                                                certificate_date: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="sertifikat-luas"> Luas Tanah Bidang  (m²)</label>
                            <input
                                type="text"
                                className="w-100"
                                name="sertifikat-luas"
                                placeholder="Masukkan luas"
                                value={induk.large}
                                onChange={(e) =>
                                    setInduk({
                                        ...induk,
                                        large: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="sertifikat-alamat">Alamat</label>
                            <textarea
                                name="sertifikat-alamat"
                                className="w-100"
                                placeholder="Masukkan Alamat"
                                value={induk.address}
                                onChange={(e) =>
                                    setInduk({
                                        ...induk,
                                        address: e.target.value,
                                    })
                                }
                            ></textarea>
                        </div>
                        <div>
                            <MapContainer center={center} zoom={8} scrollWheelZoom={false}>
                                <TileLayer
                                    attribution="&copy; OpenStreetMap"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker  draggable
                                    eventHandlers={eventHandlers}
                                    position={position}
                                    ref={markerRef} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                                    <Circle center={[latitude, longitude]} radius={induk.large ? induk.large : 0 } icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
   
                                    </Circle>
                                </Marker>
                            </MapContainer>
                        </div>
                        <div>
                            <label htmlFor="latitude">Latitude</label>
                            <input
                                disabled
                                type="number"
                                className="w-100"
                                name="latitude"
                                placeholder="Masukkan latitude"
                                value={latitude}
                            />
                        </div>
                        <div>
                            <label htmlFor="longitude">Longitude</label>
                            <input
                                disabled
                                type="number"
                                className="w-100"
                                name="longitude"
                                placeholder="Masukkan longitude"
                                value={longitude}
                            />
                        </div>
                    </form>
                </div>
            </LayoutAdmin>
        );
    };



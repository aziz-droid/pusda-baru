import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "../../../components/Layout/layoutAdmin";
import { MapContainer, Marker, Popup, TileLayer, useMap,  } from 'react-leaflet'
import {Icon} from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"


import Swal from "sweetalert2";


const center = {    
    lng: 112.73635667066236,
    lat: -7.246854784171441,
  };
  
export const EditBagianPppsAdmin = () => {

    const apiUrl = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();
    const params = useParams();


    const [position, setPosition] = useState(center);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    const [children, setChildren] = useState({
        parent_id: params.induk_id,
        utilization_engagement_type: "",
        allotment_of_use: "",
        large: "",
        present_condition: "",
        assets_value: "",
        coordinate: "",
        latitude:"",
        longitude:"",
        description: "",
    });

    const [message, setMessage] = useState([]);

    // fungsi handlesubmit yang berfungsi untuk mengirim data dari form yang di simpan ke state children lalu dikirim ke url API edit tanah bagian
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let token = localStorage.getItem("token");
            // proses pengiriman data ke url API edit tanah bagian
            let res = await fetch(apiUrl + "childer/update/" + params.children_id, {
                method: "POST",
                body: JSON.stringify({
                    ...children,
                    token,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });

            // respon setelah data dikirim
            let resJson = await res.json();
            // jika respon gagal menghasilkan eror
            if (res.status !== 200) {
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
            // jika respon berhasil menghasilkan popup success
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: resJson.message,
                timer: 1000,
            });

            // fungsi navigate ketika data berhasil di update maka kembali ke halaman detail tanah bagian
            return navigate(
                "/upt/" + params.id + "/admin/detail/" + params.induk_id
            );
        } catch (error) {
            console.log(error);
        }
    };

    // Menggunakan useEffect untuk melakukan fetch data tanah bagian 
    useEffect(() => {
        let token = localStorage.getItem("token");

        const fetchInduk = async () => {
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

                setChildren(resData);

                let center = {
                    lng: resData.longitude,
                        lat: resData.latitude
                }
                // const center = {
                //     lng: resData?.longitude,
                //     lat: resData?.latitude
                setPosition(center)
            } catch (error) {
                console.log(error);
            }
        };

        fetchInduk().catch(console.error);
    }, []);

    const markerRef = useRef(null);


  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
          
          setLatitude(marker.getLatLng().lat);
          setLongitude(marker.getLatLng().lng);

          setChildren({
            ...children,
            latitude: marker.getLatLng().lat,
            longitude: marker.getLatLng().lng,
          })
          
        }
      },
    }),
    [latitude, longitude, children]
  );

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
                    <button onClick={handleSubmit} className="primary-btn">
                        Edit Data
                    </button>
                </div>
            </div>
            <div className="mx-5">
                <h5 style={{ paddingBottom: "20px", paddingTop: "10px" }}>
                    Edit Tanah Bagian
                </h5>

                {/* <div className="error-text-container w-100">
                    {message.map((item, key) => {
                        return (
                            <div className="text-danger" key={key}>
                                {item}
                            </div>
                        );
                    })}
                </div> */}

                <form className="d-flex form-tambah-tanah gap-5">
                    <div className="left-form d-flex flex-col gap-3  w-100">
                        <div>
                            <label htmlFor="sertifikat-jenispemanfaatan">
                                Jenis Perikatan
                            </label>
                            <select
                                className="form-select"
                                value={children.utilization_engagement_type}
                                onChange={(e) =>
                                    setChildren({
                                        ...children,
                                        utilization_engagement_type:
                                            e.target.value,
                                    })
                                }
                            >
                                <option value="" disabled>
                                    -- Pilih --
                                </option>
                                <option value="pakai_sendiri">
                                    Pakai Sendiri
                                </option>
                                <option value="pinjam_pakai">
                                    Pinjam Pakai
                                </option>
                            </select>
                        </div>
                        {/* <div>
                            <label htmlFor="berlaku-dari">Nilai Asset</label>
                            <input
                                type="text"
                                className="w-100"
                                name="nilai-aset"
                                value={children.assets_value}
                                onChange={(e) =>
                                    setChildren({
                                        ...children,
                                        assets_value: e.target.value,
                                    })
                                }
                            />
                        </div> */}
                        <div>
                            <label htmlFor="peruntukan-pemanfaatan">
                                Peruntukan Pemanfaatan
                            </label>
                            <input
                                type="text"
                                className="w-100"
                                name="peruntukan-pemanfaatan"
                                value={children.allotment_of_use}
                                onChange={(e) =>
                                    setChildren({
                                        ...children,
                                        allotment_of_use: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="luas-bagian">Luas Bagian (m²)</label>
                            <input
                                type="text"
                                className="w-100"
                                name="luas-bagian"
                                value={children.large}
                                onChange={(e) =>
                                    setChildren({
                                        ...children,
                                        large: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="kondisi">Kondisi Saat Ini</label>
                            <input
                                type="text"
                                className="w-100"
                                name="kondisi"
                                value={children.present_condition}
                                onChange={(e) =>
                                    setChildren({
                                        ...children,
                                        present_condition: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="keterangan">Keterangan</label>
                            <textarea
                                name="keterangan"
                                className="w-100"
                                value={children.description}
                                onChange={(e) =>
                                    setChildren({
                                        ...children,
                                        description: e.target.value,
                                    })
                                }
                            ></textarea>
                        </div>
                    </div>
                    <div className="right-form d-flex flex-col gap-3  w-100">
                    <div>
            <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
            <ChangeView center={position} zoom={12} /> 

                        <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
  <Marker  draggable
              eventHandlers={eventHandlers}
              position={position}
              ref={markerRef} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
   
  </Marker>
</MapContainer>
            </div>
                        <div>
                            <label htmlFor="latitude">Latitude (LS BT)</label>
                            <input
                            disabled
                                type="text"
                                className="w-100"
                                name="latitude"
                                value={children.latitude}
                                onChange={(e) =>
                                    setChildren({
                                        ...children,
                                        latitude: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="longitude">longitude (LS BT)</label>
                            <input
                            disabled
                                type="text"
                                className="w-100"
                                name="longitude"
                                value={children.longitude}
                                onChange={(e) =>
                                    setChildren({
                                        ...children,
                                        longitude: e.target.value,
                                    })
                                }
                            />
                        </div>
                      
                    </div>
                </form>
            </div>
        </LayoutAdmin>
    );
};

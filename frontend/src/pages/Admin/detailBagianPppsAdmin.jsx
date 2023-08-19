import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ButtonDelete } from "../../components/Button/ButtonDelete";
import { MapContainer, Marker, Popup, TileLayer, useMap  } from 'react-leaflet'
import {Icon, latLng} from 'leaflet'

import markerIconPng from "leaflet/dist/images/marker-icon.png"

import LayoutAdmin from "../../components/Layout/layoutAdmin";

const center = {
    lng: 112.73635667066236,
    lat: -7.246854784171441,
  };
export const DetailBagianPppsAdmin = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();
    const params = useParams();

    const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    });

    const mapType = (str) => {
        if (str === "pinjam_pakai") return "Pinjam Pakai";
        else if (str === "pakai_sendiri") return "Pakai Sendiri";

        return "";
    };

    const [children, setChildren] = useState({});
    const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

const [centers, setCenters] = useState(center)
//   const [centers, setCenters] = useState({lng:0,lat:0});

// eslint-disable-next-line react-hooks/exhaustive-deps
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

        if (res.status !== 200) {
            return console.log(resJson.message);
        }

        let resData = resJson.data;
        // console.log(resJson.data)
        setChildren(resData);
        // setChildren(resData);
        setLatitude(resData?.latitude);
        setLongitude(resData?.longitude);
        // setCenters(lng:resData?.longitude, lat:resData?.latitude})

       let center = {
            lng: resData.longitude,
                lat: resData.latitude
        }
        // const center = {
        //     lng: resData?.longitude,
        //     lat: resData?.latitude
        setCenters(center)
        // }
        // const center = {
        //     lng: resData?.longitude,
        //     lat: resData?.latitude
        
        // }
        // setCenters({lat:resData?.latitude, lng:resData?.longitude});
        // console.log({resData})
    } catch (error) {
        console.log(error);
    }
};

// console.log({children})
//         console.log({center})
// const center ={}
    useEffect(() => {
        let token = localStorage.getItem("token");

       fetchInduk(token)
    //    console.log('long', typeof children.longitude)
    //    console.log('lat', typeof children.latitude)
        // console.log({children})
        // console.log({center})
        // setCenters({lng:children.longitude, lat:children.latitude})

        // fetchInduk().catch(console.error);
    }, []);
    // const center = {
    //     lng: children.longitude,
    //     lat: children.latitude
    
    // }
    // const myIcon = L.icon({
    //     iconUrl: 'myIcon.png',
    //     // ...
    //  });
//     let center = [
//          longitude,
//   latitude,
//     ]
    // console.log("tes",children.latitude)
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
                            <h5>{children.latitude}</h5>
                        </div>
                        <div>
                            <label htmlFor="koordinat">Longitude (LS BT)</label>
                            <h5>{children.longitude}</h5>
                        </div>
                        <div>
                            <label htmlFor="keterangan">Keterangan</label>
                            <h5>{children.description}</h5>
                        </div>
                       
                        <div className="">
                        <MapContainer center={[-7.246854784171441,112.73635667066236]}  zoom={13} scrollWheelZoom={false}>
                        <ChangeView center={centers} zoom={12} /> 

                        <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
  <Marker position={[latitude, longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
   
  </Marker>
</MapContainer>
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

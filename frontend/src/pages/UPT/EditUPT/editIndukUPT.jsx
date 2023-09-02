import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LayoutUPT from "../../../components/Layout/layoutUPT";
import { MapContainer, Marker, Popup, TileLayer, useMap,Circle  } from 'react-leaflet'
import {Icon} from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import Swal from "sweetalert2";

// Mendefinisikan titik pusat peta
const center = {
   lng: 112.1716087070837,
  lat: -7.516677410514516,
};
export const EditIndukUPT = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const params = useParams();
  const navigate = useNavigate();

  const [induk, setInduk] = useState({});
  const [message, setMessage] = useState([]);
  const [position, setPosition] = useState(center);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [itemName, setItemName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let token = localStorage.getItem("token");

      let res = await fetch(apiUrl + "parent/update/" + params.induk_id, {
        method: "POST",
        body: JSON.stringify({
          ...induk,
          token,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      let resJson = await res.json();

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

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: resJson.message,
        timer: 1000,
      });

      return navigate("/upt/" + params.id + "/upt");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let token = localStorage.getItem("token");

    const fetchInduk = async () => {
      try {
        let res = await fetch(apiUrl + "parent/" + params.induk_id, {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + token,
          },
        });

        let resJson = await res.json();

        if (res.status !== 200) {
          return console.log(resJson.message);
        }

        let resData = resJson.data;
        setItemName(resJson.data.item_name)
        setInduk(resJson?.data);
        let center = {
          lng: resData.longitude,
          lat: resData.latitude
        }
        setPosition(center)
      } catch (error) {
        console.log(error);
      }
    };

    fetchInduk().catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markerRef = useRef(null);


  // Mendefinisikan event handler untuk marker pada peta
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

  // Fungsi untuk mengubah view peta
  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }
  // Render komponen
  return (
    <LayoutUPT>
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
          <button onClick={handleSubmit} className="primary-btn">
            Simpan
          </button>
        </div>
      </div>
      <div className="m-3">
        <h5 style={{ paddingBottom: "20px" }}>Edit Tanah Induk</h5>

        {/* <div className="error-text-container w-100">
          {message.map((item, key) => {
            return (
              <div className="text-danger" key={key}>
                {item}
              </div>
            );
          })}
        </div> */}

        <form className="form-tambah-tanah d-flex flex-col gap-3 px-5">
          <div>
            <label htmlFor="nama-jenis-barang">Nama/Jenis Barang</label>
            <input
              type="text"
              className="w-100"
              name="nama-jenis-barang"
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
                <label htmlFor="sertifikat-tanggal">Tanggal</label>
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
            <label htmlFor="sertifikat-luas">Luas Induk</label>
            <input
              type="text"
              className="w-100"
              name="sertifikat-luas"
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
            <ChangeView center={position} zoom={18} /> 

                        <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
  <Marker  draggable
              eventHandlers={eventHandlers}
              position={position}
              ref={markerRef} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
         <Circle center={position} radius={induk.large ? induk.large : 0 } icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}/>

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
                                value={induk.latitude}
                                onChange={(e) =>
                                    setInduk({
                                        ...induk,
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
                                value={induk.longitude}
                                onChange={(e) =>
                                    setInduk({
                                        ...induk,
                                        longitude: e.target.value,
                                    })
                                }
                            />
                        </div>
          {/* <div>
                        <label htmlFor="sertifikat-nilai">Nilai Aset</label>
                        <input
                            type="text"
                            className="w-100"
                            name="sertifikat-nilai"
                        />
                    </div> */}
        </form>
      </div>
    </LayoutUPT>
  );
};

import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "../../../components/Layout/layoutAdmin";
import { MapContainer, Marker, Popup, TileLayer, useMap,  } from 'react-leaflet'
import {Icon} from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"


import Swal from "sweetalert2";


const center = {
   lng: 112.1716087070837,
  lat: -7.516677410514516,
};
export const TambahBagianPppsAdmin = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();
  const params = useParams();

  const [children, setChildren] = useState({
    parent_id: params.induk_id,
    utilization_engagement_type: "",
    allotment_of_use: "",
    large: "",
    present_condition: "",
    coordinate: "",
    latitude:"",
    longitude:"",
    description: "",
  });

  const [message, setMessage] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let token = localStorage.getItem("token");

      let res = await fetch(apiUrl + "childer/create", {
        method: "POST",
        body: JSON.stringify({
          ...children,
          token,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
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

      return navigate("/upt/" + params.id + "/admin/detail/" + params.induk_id);
    } catch (error) {
      console.log(error);
    }
  };

  const markerRef = useRef(null);

  const [position, setPosition] = useState(center);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

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

  console.log(latitude, longitude);
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
            Tambah Data
          </button>
        </div>
      </div>
      <div className="mx-5">
        <h5 style={{ paddingBottom: "20px", paddingTop: "10px" }}>
          Tambah Tanah Bagian
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

        <form className="d-flex form-tambah-tanah gap-5 mb-4 ">
          <div className="left-form d-flex flex-col gap-3 w-100">
            <div>
              <label htmlFor="sertifikat-jenispemanfaatan">
                Penggunaan/Pemanfaatan
              </label>
              <select
                className="form-select"
                value={children.utilization_engagement_type}
                onChange={(e) =>
                  setChildren({
                    ...children,
                    utilization_engagement_type: e.target.value,
                  })
                }
              >
                <option value="" disabled>
                  -- Pilih --
                </option>
                <option value="pakai_sendiri">Pakai Sendiri</option>
                <option value="pinjam_pakai">Pinjam Pakai</option>
              </select>
            </div>
            <div>
              <label htmlFor="peruntukan-pemanfaatan">
                Peruntukan Pemanfaatan
              </label>
              <input
                type="text"
                className="w-100"
                name="peruntukan-pemanfaatan"
                placeholder="Masukkan peruntukan pemanfaatan"
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
                placeholder="Masukan luas bagian"
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
                placeholder="Masukkan kondisi tanah"
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
                placeholder="Masukkan keterangan"
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
          <div className="right-form d-flex flex-col gap-3 w-100">
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
                // onChange={(e) =>
                //   setChildren({
                //     ...children,
                //     latitude: latitude,
                //   })
                // }
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
                // onChange={(e) =>
                //   setChildren({
                //     ...children,
                //     longitude: longitude,
                //   })
                // }
              />
            </div>
           
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
};

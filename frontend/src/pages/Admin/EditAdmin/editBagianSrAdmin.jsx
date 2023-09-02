import { useState, useEffect, useRef, useMemo } from "react";
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
export const EditBagianSrAdmin = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const apiUrl = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();
  const params = useParams();

  const [children, setChildren] = useState({
    parent_id: params.induk_id,
    rental_retribution: "",
    utilization_engagement_type: "",
    utilization_engagement_name: "",
    allotment_of_use: "",
    coordinate: "",
    large: "",
    validity_period_of: "",
    validity_period_until: "",
    engagement_number: "",
    engagement_date: "",
    description: "",
    application_letter: null,
    agreement_letter: null,
  });

  const [message, setMessage] = useState([]);

  const [position, setPosition] = useState(center);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
// console.log({children})
    try {
      let token = localStorage.getItem("token");
      const formData = new FormData();

      for (const key in children) {
        formData.append(key, children[key]);
      }
      formData.append("token", token);

      let res = await fetch(apiUrl + "childer/update/" + params.children_id, {
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

      return navigate(
        "/upt/" +
          params.id +
          "/admin/detail/" +
          params.induk_id +
          "/tanah-bagian-sr/" +
          params.children_id
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

  /* 2222 */
  const [file2, setFile2] = useState();
  const uploadRef2 = useRef();
  const statusRef2 = useRef();
  const loadTotalRef2 = useRef();
  const progressRef2 = useRef();

  const UploadFile2 = () => {
    const file = uploadRef2.current.files[0];
    setFile2(URL.createObjectURL(file));
    var formData = new FormData();
    formData.append("image", file2);
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", ProgressHandler2, false);
    xhr.addEventListener("load", SuccessHandler2, false);
    xhr.addEventListener("error", ErrorHandler2, false);
    xhr.addEventListener("abort", AbortHandler2, false);
    xhr.open("POST", "fileupload.php");
    xhr.send(formData);
  };

  const ProgressHandler2 = (e) => {
    loadTotalRef2.current.innerHTML = `${uploadRef2.current.files[0].name} uploaded ${e.loaded} bytes of ${e.total} bytes`;
    var percent = (e.loaded / e.total) * 100;
    progressRef2.current.value = Math.round(percent);
    statusRef2.current.innerHTML = Math.round(percent) + "% uploaded...";
  };

  const SuccessHandler2 = (e) => {
    // statusRef2.current.innerHTML = e.target.responseText;
    progressRef2.current.value = 0;
  };

  const ErrorHandler2 = () => {
    statusRef2.current.innerHTML = "upload failed!!";
  };
  const AbortHandler2 = () => {
    statusRef2.current.innerHTML = "upload aborted!!";
  };

  useEffect(() => {
    let token = localStorage.getItem("token");

    const fetchInduk = async () => {
      try {
        let res = await fetch(apiUrl + "childer/" + params.children_id, {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + token,
          },
        });

        let resJson = await res.json();

        if (res.status != 200) {
          return console.log(resJson.message);
        }

        let resData = resJson.data;

        setChildren(resData);
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
          <div className="left-form d-flex flex-col gap-3 w-100">
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
                    utilization_engagement_type: e.target.value,
                  })
                }
              >
                <option value="" disabled>
                  -- Pilih --
                </option>
                <option value="sewa_sip_bmd">Sewa/SIP BMD</option>
                <option value="retribusi">Retribusi</option>
              </select>
            </div>
            <div>
              <label htmlFor="berlaku-dari">Atas Nama</label>
              <input
                type="text"
                className="w-100"
                name="atas-nama"
                value={children.utilization_engagement_name}
                onChange={(e) =>
                  setChildren({
                    ...children,
                    utilization_engagement_name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="nilai-sewa">
                Nilai Sewa/Retribusi (Rp/Tahun)
              </label>
              <input
                type="text"
                className="w-100"
                name="nilai-sewa"
                value={children.rental_retribution}
                onChange={(e) =>
                  setChildren({
                    ...children,
                    rental_retribution: e.target.value,
                  })
                }
              />
            </div>
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
            <MapContainer center={center} zoom={8} scrollWheelZoom={false}>
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
          <div className="right-form d-flex flex-col gap-3 w-100">
          <div>
              <label htmlFor="luas-bagian">Luas Bagian</label>
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
              <h5
                className="font-semibold"
                style={{
                  fontSize: "16px",
                  margin: "0 0 5px 0",
                }}
              >
                Masa Berlaku
              </h5>
              <label htmlFor="atas-nama">Dari</label>
              <input
                type="date"
                className="w-100"
                name="berlaku-dari"
                value={children.validity_period_of}
                onChange={(e) =>
                  setChildren({
                    ...children,
                    validity_period_of: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="atas-nama">Sampai</label>
              <input
                type="date"
                className="w-100"
                name="berlaku-dari"
                value={children.validity_period_until}
                onChange={(e) =>
                  setChildren({
                    ...children,
                    validity_period_until: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="nomor-perikatan">Nomor Perikatan</label>
              <input
                type="text"
                className="w-100"
                name="nomor-perikatan"
                value={children.engagement_number}
                onChange={(e) =>
                  setChildren({
                    ...children,
                    engagement_number: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="tanggal-perikatan">Tanggal Perikatan</label>
              <input
                type="date"
                className="w-100"
                name="tanggal-perikatan"
                value={children.engagement_date}
                onChange={(e) =>
                  setChildren({
                    ...children,
                    engagement_date: e.target.value,
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
            <div className="d-flex flex-col ">
              <label className="font-semibold">Surat Perjanjian</label>
              <label
                htmlFor="surat-perjanjian"
                className="font-semibold file-input d-flex flex-col justify-content-center align-items-center"
              >
                <p className="">
                  Drag & drop files or{" "}
                  <span style={{ color: "#483EA8" }}>Browse</span>
                </p>
                <p className="secondary-text ">
                Supported formates: PDF

                </p>
              </label>
              <input
                type="file"
                accept="application/pdf"
                className="d-none "
                id="surat-perjanjian"
                // value={ backendUrl + `agreementletter/` + children.agreement_letter}
                ref={uploadRef}
                onChange={(e) => { 
                  setChildren({
                    ...children,
                    agreement_letter: e.target.files[0],
                  });
                  UploadFile();
                }}
              />
              <p ref={loadTotalRef}></p>
            </div>
            <div className="d-flex flex-col">
              <label className="font-semibold">Surat Permohonan</label>
              <label
                htmlFor="surat-permohonan"
                className="font-semibold file-input d-flex flex-col justify-content-center align-items-center"
              >
                <p className="p-0 m-0">
                  Drag & drop files or{" "}
                  <span style={{ color: "#483EA8" }}>Browse</span>
                </p>
                <p className="secondary-text">
                Supported formates: PDF

                </p>
              </label>
              <input
                type="file"
                accept="application/pdf"
                className="d-none"
                ref={uploadRef2}
                // value={ backendUrl + `applicationletter/` + children.application_letter}
                id="surat-permohonan"
                onChange={(e) => {
                  setChildren({
                    ...children,
                    application_letter: e.target.files[0],
                  });
                  UploadFile2();
                }}
              />
              <p ref={loadTotalRef2}></p>
            </div>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
};

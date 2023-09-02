// Mengimpor modul yang diperlukan
import {useState, useEffect, useRef, useMemo} from "react";
import { useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "../../../components/Layout/layoutAdmin";
import { MapContainer, Marker, Popup, TileLayer, useMap,  } from 'react-leaflet'
import {Icon} from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"

// Mengimpor modul untuk menampilkan popup
import Swal from "sweetalert2";

// Mendefinisikan koordinat pusat peta
const center = {
   lng: 112.1716087070837,
  lat: -7.516677410514516,
};

// Mendefinisikan komponen TambahBagianSrAdmin
export const TambahBagianSrAdmin = () => {
  // Mendapatkan URL API dari variabel lingkungan
  const apiUrl = process.env.REACT_APP_API_URL;

  // Menggunakan hook dari react-router-dom untuk navigasi
  const navigate = useNavigate();
  // Menggunakan hook dari react-router-dom untuk mendapatkan parameter URL
  const params = useParams();

  // Mendefinisikan state untuk menyimpan data anak
  const [children, setChildren] = useState({
    parent_id: params.induk_id,
    rental_retribution: "",
    utilization_engagement_type: "",
    utilization_engagement_name: "",
    allotment_of_use: "",
    coordinate: "",
    latitude:"",
    longitude:"",
    large: "",
    validity_period_of: "",
    validity_period_until: "",
    engagement_number: "",
    engagement_date: "",
    description: "",
    application_letter: null,
    agreement_letter: null,
  });

  // Mendefinisikan state untuk menyimpan pesan error
  const [message, setMessage] = useState([]);

  // Mendefinisikan fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    // Mencegah perilaku default form
    e.preventDefault();

    // Mencoba mengirim data ke server
    try {
      // Mendapatkan token dari local storage
      let token = localStorage.getItem("token");
      // Membuat objek FormData untuk mengirim data dalam bentuk multipart/form-data
      const formData = new FormData();

      // Menambahkan setiap properti dari objek children ke formData
      for (const key in children) {
        formData.append(key, children[key]);
      }
      // Menambahkan token ke formData
      formData.append("token", token);

      // Mengirim request ke server
      let res = await fetch(apiUrl + "childer/create", {
        method: "POST",
        body: formData,
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

        // Menampilkan pesan error dengan SweetAlert2
        return Swal.fire({
          icon: "error",
          title: "Oops...",
          html: messageList,
        });

        // Mengubah state message
        // return setMessage(message);
      }

      // Menampilkan pesan sukses dengan SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: resJson.message,
        timer: 1000,
      });

      // Mengarahkan user ke halaman detail
      return navigate("/upt/" + params.id + "/admin/detail/" + params.induk_id);
    } catch (error) {
      // Menampilkan pesan error di console
      console.log(error);
    }
  };

  // Mendefinisikan state untuk menyimpan file
  const [file, setFile] = useState();
  // Mendefinisikan ref untuk input file
  const uploadRef = useRef();
  // Mendefinisikan ref untuk status upload
  const statusRef = useRef();
  // Mendefinisikan ref untuk total load
  const loadTotalRef = useRef();
  // Mendefinisikan ref untuk progress upload
  const progressRef = useRef();

  // Mendefinisikan fungsi untuk mengupload file
  const UploadFile = () => {
    // Mendapatkan file dari input
    const file = uploadRef.current.files[0];
    // Mengubah state file
    setFile(URL.createObjectURL(file));
    // Membuat objek FormData
    var formData = new FormData();
    // Menambahkan file ke formData
    formData.append("image", file);
    // Membuat objek XMLHttpRequest
    var xhr = new XMLHttpRequest();
    // Menambahkan event listener untuk progress upload
    xhr.upload.addEventListener("progress", ProgressHandler, false);
    // Menambahkan event listener untuk load
    xhr.addEventListener("load", SuccessHandler, false);
    // Menambahkan event listener untuk error
    xhr.addEventListener("error", ErrorHandler, false);
    // Menambahkan event listener untuk abort
    xhr.addEventListener("abort", AbortHandler, false);
    // Membuka koneksi ke server
    xhr.open("POST", "fileupload.php");
    // Mengirim formData
    xhr.send(formData);
  };

  // Mendefinisikan fungsi untuk menangani progress upload
  const ProgressHandler = (e) => {
    // Menampilkan total load
    loadTotalRef.current.innerHTML = `${uploadRef.current.files[0].name} uploaded ${Math.round(e.loaded/1024)}K bytes of ${Math.round(e.total/1024)}K    bytes`;
    // Menghitung persentase upload
    var percent = (e.loaded / e.total) * 100;
    // Mengubah value progress bar
    progressRef.current.value = Math.round(percent);
    // Menampilkan persentase upload
    statusRef.current.innerHTML = Math.round(percent) + "% uploaded...";
  };

  // Mendefinisikan fungsi untuk menangani load
  const SuccessHandler = (e) => {
    // Menampilkan response dari server
    statusRef.current.innerHTML = e.target.responseText;
    // Mengubah value progress bar menjadi 0
    progressRef.current.value = 0;
  };

  // Mendefinisikan fungsi untuk menangani error
  const ErrorHandler = () => {
    // Menampilkan pesan error
    statusRef.current.innerHTML = "upload failed!!";
  };
  // Mendefinisikan fungsi untuk menangani abort
  const AbortHandler = () => {
    // Menampilkan pesan abort
    statusRef.current.innerHTML = "upload aborted!!";
  };

  // Mendefinisikan state untuk menyimpan file kedua
  const [file2, setFile2] = useState();
  // Mendefinisikan ref untuk input file kedua
  const uploadRef2 = useRef();
  // Mendefinisikan ref untuk status upload kedua
  const statusRef2 = useRef();
  // Mendefinisikan ref untuk total load kedua
  const loadTotalRef2 = useRef();
  // Mendefinisikan ref untuk progress upload kedua
  const progressRef2 = useRef();

  // Mendefinisikan fungsi untuk mengupload file kedua
  const UploadFile2 = () => {
    // Mendapatkan file dari input
    const file = uploadRef2.current.files[0];
    // Mengubah state file
    setFile2(URL.createObjectURL(file));
    // Membuat objek FormData
    var formData = new FormData();
    // Menambahkan file ke formData
    formData.append("image", file2);
    // Membuat objek XMLHttpRequest
    var xhr = new XMLHttpRequest();
    // Menambahkan event listener untuk progress upload
    xhr.upload.addEventListener("progress", ProgressHandler2, false);
    // Menambahkan event listener untuk load
    xhr.addEventListener("load", SuccessHandler2, false);
    // Menambahkan event listener untuk error
    xhr.addEventListener("error", ErrorHandler2, false);
    // Menambahkan event listener untuk abort
    xhr.addEventListener("abort", AbortHandler2, false);
    // Membuka koneksi ke server
    xhr.open("POST", "fileupload.php");
    // Mengirim formData
    xhr.send(formData);
  };

  // Mendefinisikan fungsi untuk menangani progress upload kedua
  const ProgressHandler2 = (e) => {
    // Menampilkan total load
    loadTotalRef2.current.innerHTML = `${uploadRef2.current.files[0].name} uploaded ${e.loaded} bytes of ${e.total} bytes`;
    // Menghitung persentase upload
    var percent = (e.loaded / e.total) * 100;
    // Mengubah value progress bar
    progressRef2.current.value = Math.round(percent);
    // Menampilkan persentase upload
    statusRef2.current.innerHTML = Math.round(percent) + "% uploaded...";
  };

  // Mendefinisikan fungsi untuk menangani load kedua
  const SuccessHandler2 = (e) => {
    // Menampilkan response dari server
    // statusRef2.current.innerHTML = e.target.responseText;
    // Mengubah value progress bar menjadi 0
    progressRef2.current.value = 0;
  };

  // Mendefinisikan fungsi untuk menangani error kedua
  const ErrorHandler2 = () => {
    // Menampilkan pesan error
    statusRef2.current.innerHTML = "upload failed!!";
  };
  // Mendefinisikan fungsi untuk menangani abort kedua
  const AbortHandler2 = () => {
    // Menampilkan pesan abort
    statusRef2.current.innerHTML = "upload aborted!!";
  };

  // Mendefinisikan ref untuk marker
  const markerRef = useRef(null);

  // Mendefinisikan state untuk posisi marker
  const [position, setPosition] = useState(center);
  // Mendefinisikan state untuk latitude
  const [latitude, setLatitude] = useState("");
  // Mendefinisikan state untuk longitude
  const [longitude, setLongitude] = useState("");

  // Mendefinisikan event handler untuk marker
  const eventHandlers = useMemo(
    () => ({
      // Fungsi untuk menangani event dragend
      dragend() {
        // Mendapatkan marker
        const marker = markerRef.current;
        // Jika marker ada
        if (marker != null) {
          // Mengubah posisi marker
          setPosition(marker.getLatLng());
          
          // Mengubah latitude
          setLatitude(marker.getLatLng().lat);
          // Mengubah longitude
          setLongitude(marker.getLatLng().lng);

          // Mengubah state children
          setChildren({
            ...children,
            latitude: marker.getLatLng().lat,
            longitude: marker.getLatLng().lng,
          })
          
        }
      },
    }),
    // Dependensi useMemo
    [latitude, longitude, children]
  );
  // Mengembalikan komponen
 

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

        <form className="d-flex form-tambah-tanah gap-5 mb-4">
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
                placeholder="Masukkan nama"
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
                placeholder="Masukkan nilai sewa"
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
            {/* <div>
              <label htmlFor="koordinat">Koordinat (LS BT)</label>
              <input
                type="text"
                className="w-100"
                name="koordinat"
                placeholder="Masukkan koordinat"
                value={children.coordinate}
                onChange={(e) =>
                  setChildren({
                    ...children,
                    coordinate: e.target.value,
                  })
                }
              />
            </div> */}
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
              <label htmlFor="longitude">Longitude</label>
              <input
              disabled
                type="number"
                className="w-100"
                name="longitude"
                placeholder="Masukkan longitude"
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
              <label htmlFor="luas-bagian">Luas Bagian  (m²)</label>
              <input
                type="text"
                className="w-100"
                name="luas-bagian"
                placeholder="Masukkan luas bagian"
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
                placeholder="Contoh : xxx/zzz/104.5/2022"
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
            <div className="d-flex flex-col">
              <label className="font-semibold">Surat Perjanjian</label>
              <label
                htmlFor="surat-perjanjian"
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
                id="surat-perjanjian"
                ref={uploadRef}
                onChange={(e) =>
                {
                    setChildren({
                        ...children,
                        agreement_letter: e.target.files[0],
                    });
                    UploadFile()
                }
                }
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
                id="surat-permohonan"
                onChange={(e) =>
                {
                    setChildren({
                        ...children,
                        application_letter: e.target.files[0],
                    })
                    UploadFile2();
                }
                }
              />
                <p ref={loadTotalRef2}></p>
            </div>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
};

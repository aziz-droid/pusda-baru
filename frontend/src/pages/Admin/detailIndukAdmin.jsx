import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import LayoutAdmin from "../../components/Layout/layoutAdmin";
import { ModalTambahBagian } from "../../components/Modal/ModalTambahBagian";
import { ButtonDelete } from "../../components/Button/ButtonDelete";
import { TableBagian } from "../../components/Table/TableBagian";
import { TableBagianPinjamPakai } from "../../components/Table/TabelBagianPinjamPakai";
import ReactPaginate from "react-paginate";
import {
  MapContainer,
  Marker,
  Circle,
  Popup,
  TileLayer,
  useMap,
  Polygon,
} from "react-leaflet";
import { Icon, latLng } from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

import Swal from "sweetalert2";
// Mendefinisikan koordinat pusat peta
const center = {
  lng: 112.1716087070837,
  lat: -7.516677410514516,
};
// Mendefinisikan komponen DetailIndukAdmin dengan properti induk_id
export const DetailIndukAdmin = ({ induk_id }) => {
  // Mendapatkan URL API dari environment variable
  const apiUrl = process.env.REACT_APP_API_URL;

  // Menggunakan hook useNavigate untuk navigasi
  const navigate = useNavigate();
  // Menggunakan hook useState untuk menampilkan dan menyembunyikan modal
  const [show, setShow] = useState(false);
  // Menggunakan hook useParams untuk mendapatkan parameter URL
  const params = useParams();

  // Fungsi untuk menutup modal
  const handleClose = () => setShow(false);
  // Fungsi untuk menampilkan modal
  const handleShow = () => setShow(true);

  // Fungsi untuk memformat tanggal menjadi format yyyy-mm-dd
  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return [year, month, day].join("-");
  };

  // Membuat formatter untuk format mata uang Indonesia
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  // Mendefinisikan state untuk latitude dan longitude
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [centers, setCenters] = useState(center);

  // Fungsi untuk menangani klik halaman
  const handlePageClick = (e) => {
    if (e.selected >= 0) {
      setPageNum(e.selected + 1);
    }
  };

  // Mendefinisikan state untuk induk, anak, pencarian, halaman, jumlah halaman, titik awal, dan pesan kosong
  const [induk, setInduk] = useState({});
  const [children, setChildren] = useState([]);
  const [search, setSearch] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [startingPoint, setStartingPoint] = useState(0);
  const [emptyMsg, setEmptyMsg] = useState("");

  // Menggunakan hook useEffect untuk melakukan fetch data tanah bidang dan tanah bagian
  useEffect(() => {
    let token = localStorage.getItem("token");

    // Fungsi untuk fetch data induk
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
        setInduk(resData);
        setLatitude(resData?.latitude);
        setLongitude(resData?.longitude);
        let center = {
          lng: resData.longitude,
          lat: resData.latitude,
        };

        setCenters(center);
      } catch (error) {
        console.log(error);
      }
    };

    // Fungsi untuk fetch data tanah bagian
    const fetchChildren = async () => {
      try {
        let res = await fetch(
          apiUrl +
            "childer/all?page=" +
            pageNum +
            "&parent_id=" +
            params.induk_id +
            "&keyword=" +
            search,
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

        // Check if result is from search
        if (Array.isArray(resJson.data)) {
          setPageCount(1);
          setStartingPoint(1);
        } else {
          setPageCount(resJson.data.last_page);
          setStartingPoint(
            resJson.data.per_page * resJson.data.current_page -
              (resJson.data.per_page - 1)
          );
        }

        let resData = Array.isArray(resJson.data)
          ? resJson.data
          : resJson.data.data;
        if (resData.length === 0) return setEmptyMsg("Tidak ada data");

        setEmptyMsg("");

        setChildren(resData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInduk().catch(console.error);
    fetchChildren().catch(console.error);
  }, [pageNum, search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fungsi untuk import data tanah bagian
  const importDetailIndukAdmin = () => {
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

        return fetch(apiUrl + "import/file/children/" + induk.id, {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .catch((error) => {
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

  // Render komponen
  return (
    <LayoutAdmin>
      <ModalTambahBagian
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
      />
      <div className="mx-3">
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
        </div>
        <div
          className="d-flex justify-content-between mx-3"
          style={{ paddingBottom: "20px", paddingTop: "10px" }}
        >
          <h5>Informasi Tanah Bidang</h5>
          <div className="d-flex gap-2">
            {/* komponen button hapus data tanah bidang yang berisi props yang berisi endpoint hapus data tanah bidang*/}
            <ButtonDelete
              urlDelete={apiUrl + "parent/delete/" + params.induk_id}
              urlRedirect={"/upt/" + params.id + "/admin"}
            />
            <Link
              to={"/upt/" + params.id + "/admin/edit-induk/" + params.induk_id}
              className="primary-btn px-4"
            >
              Ubah Data
            </Link>
          </div>
        </div>
        <div className="informasi-tanah">
          <div className="d-flex mx-4">
            <div className="left w-50">
              <div>
                <p className="title p-0 m-0">Nama/Jenis Barang</p>
                <p className="font-semibold">{induk.item_name}</p>
              </div>
              <div>
                <p className="title p-0 m-0">Nilai Aset</p>
                <p className="font-semibold">
                  {formatter.format(induk.asset_value)}
                </p>
              </div>
              <h6>Sertifikat</h6>
              <div className="d-flex gap-5">
                <div className="left">
                  <p className="title p-0 m-0">Nomor</p>
                  <p className="font-semibold">{induk.certificate_number}</p>
                </div>
                <div className="right">
                  <p className="title p-0 m-0">Tanggal</p>
                  <p className="font-semibold">
                    {formatDate(induk.certificate_date)}
                  </p>
                </div>
              </div>
            </div>
            <div className="right w-100">
              <div>
                <p className="title p-0 m-0">Luas Tanah Bidang (m²)</p>
                <p className="font-semibold">{induk.large}</p>
              </div>
              <div>
                <p className="title p-0 m-0">Alamat</p>
                <p className="font-semibold">{induk.address}</p>
              </div>
              <div className="">
                <label htmlFor="koordinat">Peta Lokasi</label>
                {induk.latitude && induk.longitude !== null ? (
                  <>
                    <MapContainer
                      center={[-7.246854784171441, 112.73635667066236]}
                      zoom={8}
                      scrollWheelZoom={false}
                    >
                      <ChangeView center={centers} zoom={16} />

                      <TileLayer
                        attribution="&copy; OpenStreetMap"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        position={centers}
                        icon={
                          new Icon({
                            iconUrl: markerIconPng,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                          })
                        }
                      />
                      <Circle
                        center={[latitude, longitude]}
                        radius={induk.large ? induk.large : 0}
                        icon={
                          new Icon({
                            iconUrl: markerIconPng,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                          })
                        }
                      ></Circle>
                    </MapContainer>
                  </>
                ) : (
                  <h6 className=" fw-light fst-italic">Belum Di Tentukan</h6>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="d-flex justify-content-between align-items-center mx-3 py-3"
          style={{
            borderBottom: "#BCBCBC 1px solid",
          }}
        ></div>
        <div className="mx-3">
          <div
            className="d-flex flex-row justify-content-between px-3 py-3"
            style={{ marginTop: "30px" }}
          >
            <h5>Rincian Penggunaan/Pemanfaatan</h5>
            <div className="d-flex">
              <input
                className="form-control me-2 bg-none"
                style={{ width: "200px" }}
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></input>
              <div
                onClick={importDetailIndukAdmin}
                className="secondary-btn d-flex align-items-center me-2"
                style={{ padding: "0 15px" }}
              >
                Import
              </div>
              <div
                className="primary-btn d-flex justify-content-center align-items-center"
                onClick={() => {
                  setShow(true);
                }}
              >
                Tambah Data
              </div>
            </div>
          </div>
          <div className="table-tanah-bagian">
            {emptyMsg === "" ? (
              children.map((item, key) => {
                if (
                  item.utilization_engagement_type === "pinjam_pakai" ||
                  item.utilization_engagement_type === "pakai_sendiri"
                ) {
                  return (
                    <TableBagianPinjamPakai
                      iterator={startingPoint + key}
                      upt={params.id}
                      children={item}
                      key={key}
                    />
                  );
                } else if (
                  item.utilization_engagement_type === "sewa_sip_bmd" ||
                  item.utilization_engagement_type === "retribusi"
                ) {
                  return (
                    <TableBagian
                      iterator={startingPoint + key}
                      upt={params.id}
                      children={item}
                      key={key}
                    />
                  );
                }
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

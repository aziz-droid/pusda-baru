import { useState, useEffect } from "react";
import { DashboardTableRow } from "../../components/Dashboard/DashboardTableRow";
import LayoutAdmin from "../../components/Layout/layoutAdmin";

import { ExportExcel } from "../../components/ExportExcel";

export const DashboardAdmin = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: currentYear - 1945 + 6}, (v, k) => k + 1945).reverse();
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  // Pembuatan beberapa state / variable
  const [dataKeseluruhan, setDataKeseluruhan] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [total, setTotal] = useState({
    total_tanah_induk: 0,
    total_tanah_pinjam_pakai: 0,
    total_tanah_pakai_sendiri: 0,
    total_tanah_sewa_sip_bmd: 0,
    total_rupiah_tanah_sewa_sip_bmd: 0,
    total_tanah_retribusi: 0,
    total_rupiah_tanah_retribusi: 0,
  });
  const [filterYear, setFilterYear] = useState(currentYear);
  const [emptyMsg, setEmptyMsg] = useState("");

  // use effect pada react adalah function yang dieksekusi setelah render.
  useEffect(() => {

    // function untuk mengambil data yang akan di tampilkan pada tabel UPT
    const fetchData = async () => {
      let token = localStorage.getItem("token");

      try {
        // variabel res berisi fungsi await untuk memanggil endpoint api DashboardController dengan filter tahun
        let res = await fetch(apiUrl + "dashboard/all/" + filterYear, {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + token,
          },
        });


        // response di simpan ke beberapa variabel 
        let resJson = await res.json();

        if (res.status !== 200) {
          return console.log(resJson.message);
        }

        let resData = resJson.data;
        let resDataKeseluruhan = resJson.keseluruhan;
        // console.log(resData);
        // console.log(resDataKeseluruhan);

        setDataKeseluruhan(resDataKeseluruhan);

        if (resData.length === 0) {
          return setEmptyMsg("Tidak ada data.");
        }

        setEmptyMsg("");

        // pembuatan variabel untuk menampung data total dari tiap kolom
        let totalTanahInduk = 0;
        let tanahPinjamPakai = 0;
        let tanahPakaiSendiri = 0;
        let tanahSewaSipBmd = 0;
        let rupiahTanahSewaSipBms = 0;
        let tanahRetribusi = 0;
        let rupiahTanahRetribusi = 0;

        // proses perhitungan total dari tiap kolom data
        resData.forEach((item, key) => {
          totalTanahInduk += item.total_tanah_induk;
          tanahPinjamPakai += item.total_tanah_pinjam_pakai;
          tanahPakaiSendiri += item.total_tanah_pakai_sendiri;
          tanahSewaSipBmd += item.total_tanah_sewa_sip_bmd;
          rupiahTanahSewaSipBms += item.total_rupiah_tanah_sewa_sip_bmd;
          tanahRetribusi += item.total_tanah_retribusi;
          rupiahTanahRetribusi += item.total_rupiah_tanah_retribusi;
        });

        // lalu hasil perhitungan total dimasukkan pada State Total
        setTotal({
          total_tanah_induk: totalTanahInduk,
          total_tanah_pinjam_pakai: tanahPinjamPakai,
          total_tanah_pakai_sendiri: tanahPakaiSendiri,
          total_tanah_sewa_sip_bmd: tanahSewaSipBmd,
          total_rupiah_tanah_sewa_sip_bmd: rupiahTanahSewaSipBms,
          total_tanah_retribusi: tanahRetribusi,
          total_rupiah_tanah_retribusi: rupiahTanahRetribusi,
        });

        setDashboardData(resData);
      } 
      // jika terjadi error, maka akan tampilkan pesan error melalui console
      catch (error) {
        console.log(error);
      }
    };

    // fungsi getExportData digunakan untuk mengambil data dari endpoint export/all/data/upt
    const getExportData = async () => {
      let token = localStorage.getItem("token");

      try {
        let res = await fetch(apiUrl + "export/all/data/upt", {
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

        setExportData(resJson.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData().catch(console.error);
    getExportData().catch(console.error);
  }, [filterYear]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LayoutAdmin>
      <div className="d-flex justify-content-between px-3 py-3">
        <select
          value={filterYear}
          id="year-select"
          onChange={(e) => {
            setFilterYear(e.target.value);
          }}
          className="h-100 rounded text-cyanblue px-3 py-1 font-semibold bg-white border-cyanblue"
        >
            {years.map((year) => (
              <option value={year}>{year}</option>
            ))}
          </select>
        <div className="d-flex gap-2 align-items-center">
          <ExportExcel excelData={exportData} fileName="Semua Data UPT" />
          {/* <div onClick={() => exportData()} className="bg-cyanblue px-3 py-1 font-semibold text-white rounded primary-btn">
                        EXPORT DATA
                    </div> */}
        </div>
      </div>

      {/* table yang berisi menampilkan data total tiap UPT */}
      <div className="dashboard-table mx-3 p-2 pb-0 border-cyanblue bg-white">
        <div className="d-flex justify-content-between py-2 px-2">
          <h5 className="font-semibold">Informasi Total Data UPT</h5>
        </div>
        <div className="">
          <div className="row row-header">
            <div className="col d-flex align-items-center justify-content-center">
              NAMA UPT
            </div>
            <div className="col d-flex align-items-center justify-content-center">
              Jumlah Bidang Tanah
            </div>
            <div className="col d-flex flex-col align-items-center justify-content-center">
              TOTAL PINJAM PAKAI
              <br />
            </div>
            <div className="col d-flex flex-col align-items-center justify-content-center">
              TOTAL PAKAI SENDIRI
              <br />
            </div>
            <div className="col d-flex flex-col align-items-center justify-content-center">
              TOTAL SEWA/SIP BMD
              <br />
              <div className="row py-2">
                <div className="col">TANAH(M)</div>
                <div className="col">RUPIAH</div>
              </div>
            </div>
            <div className="col d-flex flex-col align-items-center justify-content-center py-2">
              TOTAL RETRIBUSI
              <br />
              <div className="row py-2">
                <div className="col">TANAH(M)</div>
                <div className="col">RUPIAH</div>
              </div>
            </div>
          </div>
          {emptyMsg === "" ? (
            <>
              {dashboardData.slice(0, 7).map((item) => {
                return (
                  <DashboardTableRow
                    key={item.id}
                    title={item.name}
                    dashboardItem={item}
                  />
                );
              })}
            </>
          ) : (
            <>
              <div class="text-center">{emptyMsg}</div>
            </>
          )}
        </div>
        {dataKeseluruhan.map((item) => {
          return (
            <div
              className="row row-content col-footer border-none"
              style={{
                background: "#EDF9FB",
              }}
            >
              <div className="col d-flex align-items-center justify-content-center">
                TOTAL KESELURUHAN
              </div>
              <div className="col d-flex align-items-center justify-content-center">
                {item.total_tanah}
              </div>
              <div className="col d-flex flex-col align-items-center justify-content-center">
                <div className="row py-2">
                  <div className="col">{item.total_tanah_pinjam_pakai}</div>
                </div>
              </div>
              <div className="col d-flex flex-col align-items-center justify-content-center">
                <div className="row py-2">
                  <div className="col">{item.total_tanah_pakai_sendiri}</div>
                </div>
              </div>
              <div className="col d-flex flex-col align-items-center justify-content-center">
                <div className="row py-2">
                  <div className="col">{item.total_tanah_sewa}</div>
                  <div className="col">
                    {formatter.format(item.total_rupiah_sewa)}
                  </div>
                </div>
              </div>
              <div className="col d-flex flex-col align-items-center justify-content-center">
                <div className="row py-2">
                  <div className="col">{item.total_tanah_retribusi}</div>
                  <div className="col">
                    {formatter.format(item.total_rupiah_retribusi)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </LayoutAdmin>
  );
};

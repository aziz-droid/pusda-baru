import { useState, useEffect } from "react";
import { DashboardTableRow } from "../../components/Dashboard/DashboardTableRow";
import LayoutUPT from "../../components/Layout/layoutUPT";

import { ExportExcel } from "../../components/ExportExcel";
import { Table } from "react-bootstrap";

export const DashboardUPT = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const userRoles = localStorage.getItem("user_roles");
  const userName = localStorage.getItem("user_name");

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: currentYear - 1945 + 6}, (v, k) => k + 1945).reverse();
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

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

  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem("token");

      try {
        let res = await fetch(apiUrl + "dashboard/" + filterYear, {
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

        if (resData.length === 0) {
          return setEmptyMsg("Tidak ada data.");
        }

        setEmptyMsg("");

        setTotal({
          total_tanah_induk: resData[0].total_tanah_induk,
          total_tanah_pinjam_pakai: resData[0].total_tanah_pinjam_pakai,
          total_tanah_pakai_sendiri: resData[0].total_tanah_pakai_sendiri,
          total_tanah_sewa_sip_bmd: resData[0].total_tanah_sewa_sip_bmd,
          total_rupiah_tanah_sewa_sip_bmd:
            resData[0].total_rupiah_tanah_sewa_sip_bmd,
          total_tanah_retribusi: resData[0].total_tanah_retribusi,
          total_rupiah_tanah_retribusi: resData[0].total_rupiah_tanah_retribusi,
        });

        setDashboardData(resData);
        console.log({resData})
      } catch (error) {
        console.log(error);
      }
    };

    const getExportData = async () => {
      let token = localStorage.getItem("token");

      try {
        let res = await fetch(apiUrl + "export/data", {
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
    <LayoutUPT>
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
          <ExportExcel excelData={exportData} fileName="File Download" />
          {/* <div className="bg-cyanblue px-3 py-1 font-semibold text-white rounded primary-btn">
                        EXPORT DATA
                    </div> */}
        </div>
      </div>

      {/* table */}
      <div className="dashboard-table mx-3 p-2 pb-0 border-cyanblue bg-white">
        <div className="d-flex justify-content-between py-2 px-2">
          <h5 className="font-semibold">Informasi Total Data UPT</h5>
        </div>
        <Table responsive bordered striped>
          <thead>
            <tr>
              <th rowSpan={2} className=" align-middle text-center">
                NAMA UPT
              </th>

              <th rowSpan={2} className=" align-middle text-center">
                Jumlah Bidang Tanah
              </th>
              <th rowSpan={2} className=" align-middle text-center">
                TOTAL PINJAM PAKAI
              </th>
              <th rowSpan={2} className=" align-middle text-center">
                TOTAL PAKAI SENDIRI
              </th>

              <th colSpan={2} className="text-center">
                TOTAL SEWA/SIP BMD
              </th>
              <th colSpan={2} className="text-center">
                TOTAL RETRIBUSI
              </th>
            </tr>
            <tr>
              <th className="text-center">TANAH(M)</th>
              <th className="text-center">RUPIAH</th>
              <th className="text-center">TANAH(M)</th>
              <th className="text-center">RUPIAH</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.slice(0, 7).map((item) => {
              return (
                <tr>
                  <td>{userRoles}</td>
                  <td className="text-center"> {item.total_tanah_induk}</td>
                  <td className="text-center"> {item.total_tanah_pinjam_pakai}</td>
                  <td className="text-center"> {item.total_tanah_pakai_sendiri}</td>
                  <td className="text-center"> {item.total_tanah_sewa_sip_bmd}</td>
                  <td className="text-center">
                    {formatter.format(item.total_rupiah_tanah_sewa_sip_bmd)}
                  </td>
                  <td className="text-center"> {item.total_tanah_retribusi}</td>
                  <td className="text-center">
                    {formatter.format(
                      typeof item.total_rupiah_tanah_retribusi !== "undefined"
                        ? item.total_rupiah_tanah_retribusi
                        : item.total_rupiah_retribusi
                    )}
                  </td>
                </tr>
              );
            })}
          
          </tbody>
          {/* <thead>
        <tr  style={{ width:'100%' }}>
          <th  style={{ width:'5%' }}>#</th>
          <th  style={{ width:'20%' }}>First Name</th>
          <th  style={{ width:'25%' }}>Last Name</th>
          <th  style={{ width:'50%' }}>
          <tr>
          <th colSpan={2}>TOTAL SEWA/SIP BMD
</th>
          </tr>
          <tr className="text-center">
          <th>TANAH</th>
          <th>RUPIAH</th>
          </tr>
          </th>
        </tr>
       
      </thead>
      <tbody>
        <tr style={{ width:'100%' }}>
          <td  style={{ width:'5%' }}>1</td>
          <td  style={{ width:'20%' }}>Mark</td>
          <td  style={{ width:'25%' }}>Otto</td>
          <td  style={{ width:'25%', backgroundColor:'red' }}>
            <span style={{ textAlign:'center', backgroundColor:'orange', paddingRight:'50px' }}>fatik</span>
            <span style={{ textAlign:'center' }}>fatik</span>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <td>3</td>
          <td colSpan={2}>Larry the Bird</td>
          <td>@twitter</td>
        </tr>
      </tbody> */}
        </Table>
      </div>
    </LayoutUPT>
  );
};

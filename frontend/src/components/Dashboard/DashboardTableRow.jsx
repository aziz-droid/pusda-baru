export const DashboardTableRow = ({ title, dashboardItem }) => {
    const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    });

    return (
        <div className="row row-content flex-nowrap">
            <div className="col-2 d-flex py-2">
                {title}
            </div>
            <div className="col-2 d-flex align-items-center justify-content-center">
                <div className="row">
                    {dashboardItem.total_tanah_induk}
                </div>
            </div>
            <div className="col-2 d-flex flex-col align-items-center justify-content-center " style={{ width:'20%' }}>
                {/* <div className="row py-2"> */}
                    {/* <div className="col"> */}
                        {dashboardItem.total_tanah_pinjam_pakai}
                    {/* </div> */}
                {/* </div> */}
            </div>
            <div className="col-2 d-flex flex-col align-items-center justify-content-center " style={{ width:'17%' }}>
                {/* <div className="row py-2">
                    <div className="col"> */}
                        {dashboardItem.total_tanah_pakai_sendiri}
                    {/* </div>
                </div> */}
            </div>
            <div className="col-2 d-flex flex-col " style={{ width:'20%' }}>
                <div className="row py-2">
                    <div className="col-6  d-flex justify-content-center">
                        {dashboardItem.total_tanah_sewa_sip_bmd}
                    </div>
                    <div className="col-6">
                        {formatter.format(
                            dashboardItem.total_rupiah_tanah_sewa_sip_bmd
                        )}
                    </div>
                </div>
            </div>
            <div className="col-2 d-flex flex-col  " style={{ width:'20%' }}>
                <div className="row py-2 flex-nowrap">
                    <div className="col-6  d-flex justify-content-center">
                        {dashboardItem.total_tanah_retribusi}
                    </div>
                    <div className="col-6">
                        {formatter.format(
                            typeof(dashboardItem.total_rupiah_tanah_retribusi) !== 'undefined' ? dashboardItem.total_rupiah_tanah_retribusi : dashboardItem.total_rupiah_retribusi
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

<?php

namespace App\Imports;

use App\Models\Childer;
use App\Models\Parents;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\Importable;

class AnakImport implements ToModel, WithHeadingRow
{
    use Importable;

    protected $parent;

    public function __construct($id)
    {
        //QUERY UNTUK MENGAMBIL SELURUH DATA USER
        $this->id = $id;
    }

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        if (!isset($row['jenis_pemanfaatan'])) {
            return null;
        }

        $induk = Parents::where('id', $this->id)->first();

        // return $row['tahun'];
        // if ($row['tahun'] == null || $row['jumlah_pembayaran'] == null) {
        Childer::create([
            'parent_id' => $induk->id ?? NULL,
            'utilization_engagement_type' => $row['jenis_pemanfaatan'],
            'utilization_engagement_name' => $row['nama_pemanfaatan'],
            'allotment_of_use'  => $row['peruntukan_penggunaan'],
            'large'  => $row['luas'],
            'rental_retribution' => $row['nilai_sewa_retribusi'],
            'validity_period_of'  => $row['masa_berlaku_dari'],
            'validity_period_until'  => $row['masa_berlaku_sampai'],
            'engagement_date'  => $row['tanggal_perikatan'],
            'engagement_number'  => $row['nomor_perikatan'],
            // 'coordinate'  => $row['koordinat'],
            'present_condition'  => $row['kondisi_saat_ini'] ?? NULL,
            'description'  => $row['keterangan'],
            'application_letter' => 'null',
            'agreement_letter' => 'null',
            'latitude'=> $row['latitude'] ? $row['latitude'] : null ,
            'longitude'=> $row['longitude'] ? $row['longitude'] : null,
        ]);
        // } else {
        // $children = new Childer([
        //     'parent_id' => $induk->id ?? NULL,
        //     'utilization_engagement_type' => $row['jenis_pemanfaatan'],
        //     'utilization_engagement_name' => $row['nama_pemanfaatan'],
        //     'allotment_of_use'  => $row['peruntukan_penggunaan'],
        //     'large'  => $row['luas'],
        //     'rental_retribution' => $row['nilai_sewa_retribusi'],
        //     'validity_period_of'  => $row['masa_berlaku_dari'],
        //     'validity_period_until'  => $row['masa_berlaku_sampai'],
        //     'engagement_date'  => $row['tanggal_perikatan'],
        //     'engagement_number'  => $row['nomor_perikatan'],
        //     'coordinate'  => $row['koordinat'],
        //     'present_condition'  => $row['kondisi_sekarang'] ?? NULL,
        //     'description'  => $row['keterangan'],
        //     'application_letter' => 'null',
        //     'agreement_letter' => 'null'
        // ]);
        // if ($children) {
        // $data = Childer::latest()->first();
        // Payment::create([
        //     'childrens_id' => [28, 29, 30],
        //     'year' => $row['tahun'],
        //     'payment_amount' => $row['jumlah_pembayaran'],
        // ]);
        // return 0;
    }
    // }
    // }
}

<?php

namespace App\Imports;

use App\Models\Childer;
use App\Models\Parents;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\Importable;

class PembayaranImport implements ToModel, WithHeadingRow
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
        // if (!isset($row['jenis_pemanfaatan'])) {
        //     return null;
        // }

        $induk = Childer::where('id', $this->id)->first();

        // return $row['tahun'];
        // if ($row['tahun'] == null || $row['jumlah_pembayaran'] == null) {
        Payment::create([
            'childrens_id' => $induk->id ?? NULL,
            'year' => $row['tahun'],
            'payment_amount' => $row['jumlah_pembayaran'],
        ]);
    }
    // }
    // }
}

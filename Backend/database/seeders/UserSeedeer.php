<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeedeer extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = User::create([
            'name' => 'PU SDA Admin',
            'slug' => 'pu-sda-admin',
            'email' => 'fulanabduh@gmail.com',
            'password' => bcrypt('admin@1234'),
        ]);
        $admin->attachRole('admin');

        $upt_kediri = User::create([
            'name' => 'UPT PSDA Kediri',
            'slug' => 'upt-psda-kediri',
            'email' => 'hendrosetiawan482@gmail.com',
            'password' => bcrypt('userkediri@1234'),
        ]);
        $upt_kediri->attachRole('upt_psda_kediri');

        $upt_lumajang = User::create([
            'name' => 'UPT PSDA Lumajang',
            'slug' => 'upt-psda-lumajang',
            'email' => 'psdalumajang@gmail.com',
            'password' => bcrypt('userlumajang@1234'),
        ]);
        $upt_lumajang->attachRole('upt_psda_lumajang');

        $upt_bondowoso = User::create([
            'name' => 'UPT PSDA Bondowoso',
            'slug' => 'upt-psda-bondowoso',
            'email' => 'sunarjiagus2018@gmail.com',
            'password' => bcrypt('userbondowoso@1234'),
        ]);
        $upt_bondowoso->attachRole('upt_psda_bondowoso');

        $upt_pasuruan = User::create([
            'name' => 'UPT PSDA Pasuruan',
            'slug' => 'upt-psda-pasuruan',
            'email' => 'pasuruan.pusda@jatimprov.go.id',
            'password' => bcrypt('userpasuruan@1234'),
        ]);
        $upt_pasuruan->attachRole('upt_psda_pasuruan');

        $upt_bojonegoro = User::create([
            'name' => 'UPT PSDA Bojonegoro',
            'slug' => 'upt-psda-bojonegoro',
            'email' => 'dita111191@gmail.com',
            'password' => bcrypt('userbojonegoro@1234'),
        ]);
        $upt_bojonegoro->attachRole('upt_psda_bojonegoro');

        $upt_pamekasan = User::create([
            'name' => 'UPT PSDA Pamekasan',
            'slug' => 'upt-psda-pamekasan',
            'email' => 'rahmatsetiawan0125@gmail.com',
            'password' => bcrypt('userpamekasan@1234'),
        ]);
        $upt_pamekasan->attachRole('upt_psda_pamekasan');



    }
}

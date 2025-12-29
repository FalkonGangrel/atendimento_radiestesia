<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ListModel;
use App\Models\ListItem;

class ListItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aspectos = ListModel::where('slug', 'aspectos')->first();

        $aspectosItems = [
            'Obsessores',
            'Parceiros de Afinidade',
            'Formas de Pensamento',
            'Votos',
            'Contratos',
            'Pactos',
            'Pragas/Maldições',
            'Magismos Feitos',
            'Magismos Recebidos',
        ];

        foreach ($aspectosItems as $index => $item) {
            ListItem::create([
                'list_id' => $aspectos->id,
                'name' => $item,
                'has_quantity' => true,
                'order' => $index,
            ]);
        }

        $diretivas = ListModel::where('slug', 'diretivas')->first();

        $diretivasItems = [
            'Contratos de Venda de Alma',
            'Personalidades: Trabalhavam/Faziam Magia',
            'Personalidades: Presas/Torturadas (igreja)',
            'Personalidades: Presas/Torturadas (outros)',
            'Personalidades: Enlouquecidas',
            'Personalidades: com Problemas de Mediunidade',
            'Personalidades: Religiosas (Cristã/Católica)',
            'Personalidades: Religiosas (Outros)',
            'Personalidades: Errantes',
            'Personalidades: Prostitutas',
            'Personalidades: Cafetinas',
            'Personalidades: Jogadoras',
            'Personalidades: Viciadas',
            'Personalidades: Donas',
            'Personalidades: Escravizadas',
            'Personalidades: Influentes (Ricas, Donas de terras, Políticas, Realezas)',
            'Personalidades: Abortadas',
            'Personalidades: Órfãs',
        ];

        foreach ($diretivasItems as $index => $item) {
            ListItem::create([
                'list_id' => $diretivas->id,
                'name' => $item,
                'has_quantity' => true,
                'order' => $index,
            ]);
        }
    }
}

// app/api/get-profile/route.ts
import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

// Definimos a interface para os dados que esperamos do banco
interface ProfileRow {
  data: string; // A coluna 'data' contém um JSON como string
}

const db = new Database('emotional_profile.db'); // Caminho correto do banco

export async function GET() {
  try {
    const stmt = db.prepare(
      'SELECT data FROM profiles ORDER BY id DESC LIMIT 1',
    );
    const row = stmt.get() as ProfileRow; // Garantimos que TypeScript saiba que 'row' tem a estrutura esperada

    if (!row) {
      return NextResponse.json(
        { message: 'Nenhum dado encontrado.' },
        { status: 404 },
      );
    }

    const profileData = JSON.parse(row.data); // Convertemos a string JSON em um objeto

    return NextResponse.json(profileData, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar dados do perfil:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar dados.' },
      { status: 500 },
    );
  }
}

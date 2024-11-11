import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const db = new Database('emotional_profile.db'); // Cria ou abre o banco de dados

// Cria a tabela se não existir
db.prepare(
  `CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL
  )`,
).run();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = JSON.stringify(body);

    const stmt = db.prepare('INSERT INTO profiles (data) VALUES (?)');
    stmt.run(data);

    return NextResponse.json(
      { message: 'Dados salvos com sucesso!' },
      { status: 201 },
    );
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
    return NextResponse.json(
      { message: 'Erro ao salvar os dados' },
      { status: 500 },
    );
  }
}

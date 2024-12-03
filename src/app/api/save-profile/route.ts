import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

// Caminho absoluto para o banco de dados, para evitar problemas de localização
const dbPath = path.resolve(process.cwd(), 'emotional_profile.db');
const db = new Database(dbPath); // Cria ou abre o banco de dados

// Cria a tabela se não existir e adiciona a coluna score
db.prepare(
  `CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    score REAL
  )`,
).run();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, score } = body; // Obtenha os dados e a pontuação
    const data = JSON.stringify(formData);

    // Garantir que o valor de `score` seja arredondado para duas casas decimais
    const roundedScore = Math.round(score * 100) / 100;

    const stmt = db.prepare('INSERT INTO profiles (data, score) VALUES (?, ?)');
    stmt.run(data, roundedScore);

    // Verifica o último registro para garantir que foi salvo corretamente
    const lastInserted = db
      .prepare('SELECT * FROM profiles ORDER BY id DESC LIMIT 1')
      .get();
    console.log('Último registro salvo:', lastInserted);

    return NextResponse.json(
      { message: 'Dados salvos com sucesso!', data: lastInserted },
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

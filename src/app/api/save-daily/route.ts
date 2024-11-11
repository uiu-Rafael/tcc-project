import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';

// Conexão com o banco de dados
const db = new Database('emotional_profile.db');

// Criação da tabela, se necessário
const createTable = `
  CREATE TABLE IF NOT EXISTS daily_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    familyInteraction TEXT,
    friendsInteraction TEXT,
    physicalExercise TEXT,
    sleepQuality TEXT,
    stressLevel TEXT,
    overallMood TEXT,
    moodScore INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    date TEXT, 
    time TEXT 
  )
`;
db.prepare(createTable).run();

// Manipulador POST
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Corpo recebido:', body);

    const {
      familyInteraction = '',
      friendsInteraction = '',
      physicalExercise = '',
      sleepQuality = '',
      stressLevel = '',
      overallMood = '',
      moodScore = 0,
      date = '', // Data fornecida
      time = '', // Hora fornecida
    } = body;

    const stmt = db.prepare(`
        INSERT INTO daily_responses (
          familyInteraction, friendsInteraction, physicalExercise,
          sleepQuality, stressLevel, overallMood, moodScore, date, time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

    stmt.run(
      familyInteraction,
      friendsInteraction,
      physicalExercise,
      sleepQuality,
      stressLevel,
      overallMood,
      moodScore,
      date, // Insere a data
      time, // Insere o horário
    );

    return NextResponse.json(
      { message: 'Respostas diárias salvas com sucesso!' },
      { status: 201 },
    );
  } catch (error) {
    console.error('Erro ao salvar respostas diárias:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar respostas.' },
      { status: 500 },
    );
  }
}

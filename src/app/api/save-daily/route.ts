import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';

// Conexão com o banco de dados
const db = new Database('emotional_profile.db');

// Criação ou atualização da tabela para incluir novas colunas
const createOrUpdateTable = `
  CREATE TABLE IF NOT EXISTS daily_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    familyInteraction TEXT,
    friendsInteraction TEXT,
    physicalExercise TEXT,
    sleepQuality TEXT,
    stressLevel TEXT,
    overallMood TEXT,
    moodScore INTEGER,
    studyHabits TEXT, -- Nova coluna para hábitos de estudo
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    date TEXT,
    time TEXT
  )
`;
db.prepare(createOrUpdateTable).run();

// Verifica e adiciona a coluna `studyHabits` caso não exista
const checkAndAddColumn = `
  PRAGMA table_info(daily_responses)
`;
// Tipando explicitamente o retorno de `tableInfo` como um array de objetos com a propriedade `name`
const tableInfo = db.prepare(checkAndAddColumn).all() as { name: string }[]; // Asserção de tipo

// Verifica se a coluna 'studyHabits' já existe na tabela
const columnExists = tableInfo.some((column) => column.name === 'studyHabits');
if (!columnExists) {
  db.prepare(`ALTER TABLE daily_responses ADD COLUMN studyHabits TEXT`).run();
  console.log('Coluna studyHabits adicionada com sucesso.');
}

// Manipulador POST
export async function POST(request: NextRequest) {
  try {
    // Converte o corpo da requisição para JSON
    const body = await request.json();
    console.log('Corpo recebido:', body);

    // Desestrutura os dados do corpo da requisição com valores padrão
    const {
      familyInteraction = '',
      friendsInteraction = '',
      physicalExercise = '',
      sleepQuality = '',
      stressLevel = '',
      overallMood = '',
      moodScore = 0,
      studyHabits = '', // Novo campo para hábitos de estudo
      date = '', // Data fornecida
      time = '', // Hora fornecida
    } = body;

    // Validação básica (opcional)
    if (!date || !time) {
      return NextResponse.json(
        { error: 'A data e o horário são obrigatórios.' },
        { status: 400 },
      );
    }

    // Prepara a query para inserção dos dados no banco
    const stmt = db.prepare(`
        INSERT INTO daily_responses (
          familyInteraction, friendsInteraction, physicalExercise,
          sleepQuality, stressLevel, overallMood, moodScore, studyHabits, date, time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

    // Executa a query
    stmt.run(
      familyInteraction,
      friendsInteraction,
      physicalExercise,
      sleepQuality,
      stressLevel,
      overallMood,
      moodScore,
      studyHabits, // Insere o novo campo
      date, // Insere a data
      time, // Insere o horário
    );

    // Retorna a resposta de sucesso
    return NextResponse.json(
      { message: 'Respostas diárias salvas com sucesso!' },
      { status: 201 },
    );
  } catch (error) {
    console.error('Erro ao salvar respostas diárias:', error);

    // Retorna a resposta de erro
    return NextResponse.json(
      { error: 'Erro ao salvar respostas.' },
      { status: 500 },
    );
  }
}

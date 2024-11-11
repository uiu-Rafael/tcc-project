import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

// Conexão com o banco de dados
const db = new Database('emotional_profile.db');

// Definindo o tipo para o retorno da consulta
interface TableExistsResult {
  count: number;
}

// Manipulador GET
export async function GET() {
  try {
    // Verifica se a tabela existe
    const checkTableStmt = db.prepare(`
      SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='daily_responses';
    `);

    // Tipando corretamente a resposta e verificando se existe
    const tableExists = checkTableStmt.get() as TableExistsResult | undefined;

    if (!tableExists || tableExists.count === 0) {
      // Se a tabela não existir ou estiver vazia, retorna uma resposta vazia sem erro
      return NextResponse.json([], { status: 200 });
    }

    const stmt = db.prepare(`
      SELECT id, familyInteraction, friendsInteraction, physicalExercise,
             sleepQuality, stressLevel, overallMood, moodScore, createdAt, date, time 
      FROM daily_responses
    `);
    const dailyResponses = stmt.all(); // Obtém todos os registros

    // Se a tabela existir mas estiver vazia, ainda retorna uma resposta vazia
    if (dailyResponses.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(dailyResponses, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar respostas diárias:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar respostas.' },
      { status: 500 },
    );
  }
}

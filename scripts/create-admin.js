#!/bin/bash
# Inicialização do primeiro administrador
# Execute após o deploy inicial para criar o usuário admin no Firebase Auth
#
# Uso: node scripts/create-admin.js

const admin = require('firebase-admin');
const readline = require('readline');

// Inicializar Firebase Admin SDK
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ? require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  : JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'gdm-live-radio',
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

async function createAdmin() {
  console.log('\n=== GDM Live Radio — Criação de Administrador ===\n');

  const email = await question('Email do administrador: ');
  const password = await question('Senha (mínimo 8 caracteres): ');

  if (password.length < 8) {
    console.error('Senha muito curta. Mínimo 8 caracteres.');
    process.exit(1);
  }

  try {
    // Verificar se usuário já existe
    let user;
    try {
      user = await admin.auth().getUserByEmail(email);
      console.log(`\nUsuário encontrado: ${user.uid}`);
    } catch {
      // Criar usuário
      user = await admin.auth().createUser({ email, password, emailVerified: true });
      console.log(`\nUsuário criado: ${user.uid}`);
    }

    // Definir custom claim de admin
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    console.log('\n✅ Administrador configurado com sucesso!');
    console.log(`   Email: ${email}`);
    console.log(`   UID: ${user.uid}`);
    console.log('\nAcesse o painel em: https://gdmlive.web.app/admin');
  } catch (error) {
    console.error('\n❌ Erro ao criar administrador:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    process.exit(0);
  }
}

createAdmin();


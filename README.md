# GDM Live Radio

<div align="center">
  <h3>🎵 Graça Digital — GDM</h3>
  <p><em>Música autoral cristã tocando no seu coração</em></p>
  
  [![Deploy Status](https://img.shields.io/badge/deploy-Firebase%20Hosting-orange)](https://gdmlive.web.app)
  [![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
</div>

---

## 1. Visão Geral

A **GDM Live Radio** é uma rádio online cristã contemporânea que transmite exclusivamente músicas autorais da **Graça Digital (GDM)**. O sistema oferece:

- 🎵 Transmissão contínua e automatizada das músicas da biblioteca local
- 📻 Interface moderna e responsiva acessível em qualquer dispositivo
- 🎛️ Painel administrativo protegido para gerenciar a programação
- 🔴 Streaming de áudio em tempo real via URL pública
- 📱 Experiência otimizada para dispositivos móveis

**URL pública:** https://gdmlive.web.app

---

## 2. Funcionalidades

### Interface Pública
- Player de áudio ao vivo com controles de play/pause/volume
- Exibição da música atual com capa, título e artista
- Histórico das últimas músicas tocadas
- Próximas músicas da programação (quando disponível)
- Estados de conexão claros (conectando, tocando, reconectando, indisponível)
- Biblioteca musical navegável
- Reconexão automática em caso de queda

### Motor de Programação
- Seleção aleatória inteligente (evita repetições prematuras)
- Modo sequencial
- Lista de reprodução customizada
- Transições configuráveis entre faixas
- Recuperação automática após falhas

### Biblioteca Musical
- Leitura automática de arquivos MP3/FLAC/WAV/OGG/M4A/AAC
- Extração de metadados ID3 (título, artista, álbum, duração, capa)
- Sincronização automática com monitoramento de alterações
- Relatório de arquivos inválidos ou inacessíveis
- Nunca modifica os arquivos originais

### Painel Administrativo
- Autenticação via Firebase Auth (email/senha)
- Dashboard com status em tempo real
- Gerenciamento da biblioteca (sincronizar, reprocessar)
- Controle da programação
- Visualização de logs
- Configurações da rádio

---

## 3. Arquitetura

```
┌─────────────────────────────────────────────────┐
│              Usuário (Navegador/Mobile)          │
└───────────────────┬─────────────────────────────┘
                    │ HTTPS
                    ▼
┌─────────────────────────────────────────────────┐
│         Firebase Hosting (gdmlive.web.app)       │
│         React 18 + TypeScript + Vite             │
└───────┬──────────────────────┬───────────────────┘
        │ Firestore/Auth       │ HTTP Stream + REST API
        ▼                      ▼
┌───────────────┐   ┌──────────────────────────────┐
│   Firebase    │   │    Cloud Run (Streaming)      │
│   Firestore   │   │    Node.js + FFmpeg           │
│   Auth        │   │    Motor de programação       │
│   Storage     │   │    API REST + WebSocket       │
└───────────────┘   └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │   Cloud Storage              │
                    │   (Arquivos de música MP3)   │
                    └──────────────────────────────┘
```

### Componentes

| Componente | Tecnologia | Hospedagem |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Firebase Hosting |
| Autenticação | Firebase Auth | Firebase |
| Banco de dados | Cloud Firestore | Firebase |
| Arquivos de música | MP3 originais | Google Cloud Storage |
| Streaming + API | Node.js + FFmpeg | Cloud Run |
| CI/CD | GitHub Actions | GitHub → Firebase/GCP |

---

## 4. Tecnologias

### Frontend
- **React 18** com TypeScript
- **Vite** para bundling
- **Tailwind CSS** para estilos
- **Zustand** para gerenciamento de estado
- **React Router v6** para navegação
- **Firebase SDK** para auth e Firestore
- **Lucide React** para ícones

### Backend
- **Node.js** com TypeScript
- **Express** para API REST
- **FFmpeg** para transcodificação e streaming de áudio
- **music-metadata** para leitura de tags ID3
- **Firebase Admin SDK** para auth e banco de dados
- **Chokidar** para monitoramento de diretório
- **Winston** para logging

### Infraestrutura
- **Firebase Hosting** (frontend)
- **Cloud Firestore** (dados)
- **Google Cloud Storage** (músicas)
- **Cloud Run** (servidor de streaming)
- **GitHub Actions** (CI/CD)

---

## 5. Pré-requisitos

- Node.js v20 ou superior
- npm v10 ou superior
- Firebase CLI (`npm install -g firebase-tools`)
- Google Cloud SDK (para deploy do servidor)
- FFmpeg instalado no sistema (Windows: `winget install ffmpeg`)
- Conta no Firebase com projeto `gdm-live-radio` configurado

---

## 6. Instalação no Windows

### 6.1. Clonar o repositório

```powershell
git clone https://github.com/vitorhugopetro/gdm_live E:\GDM_LIVE_RADIO
cd E:\GDM_LIVE_RADIO
```

### 6.2. Instalar FFmpeg

```powershell
winget install ffmpeg
# Ou baixe de https://ffmpeg.org/download.html e adicione ao PATH
ffmpeg -version  # verificar instalação
```

### 6.3. Configurar variáveis de ambiente

```powershell
# Copiar o arquivo de exemplo
Copy-Item .env.example .env

# Editar o .env com suas configurações reais
notepad .env
```

### 6.4. Instalar dependências

```powershell
# Frontend
cd frontend
npm install

# Servidor
cd ..\server
npm install
```

---

## 7. Configuração da Biblioteca Musical

A biblioteca musical padrão está configurada para:
```
E:\GDM_LIVE_RADIO\Minhas_Musicas
```

Para alterar o caminho, edite a variável `MUSIC_LIBRARY_PATH` no arquivo `.env`.

**Formatos suportados:** MP3, FLAC, WAV, OGG, M4A, AAC

O sistema lê automaticamente os metadados (ID3 tags) dos arquivos. Se um arquivo não tiver tags, o nome do arquivo é usado como título.

**⚠️ O sistema NUNCA modifica, move ou exclui seus arquivos originais.**

---

## 8. Inicialização do Sistema

### Modo de desenvolvimento local

```powershell
# Terminal 1 — Servidor de streaming
cd E:\GDM_LIVE_RADIO\server
npm run dev

# Terminal 2 — Frontend
cd E:\GDM_LIVE_RADIO\frontend
npm run dev
```

O frontend estará disponível em: http://localhost:5173  
O servidor estará disponível em: http://localhost:3001  
O stream de áudio em: http://localhost:3001/stream  

### Criar o primeiro administrador

```powershell
cd E:\GDM_LIVE_RADIO
node scripts/create-admin.js
```

---

## 9. Configuração do Streaming

### Desenvolvimento local
O servidor em `server/` usa FFmpeg para ler os MP3 e servir o stream HTTP em `/stream`.

O player no frontend conecta a `VITE_STREAM_URL` (definido no `.env`).

### Produção (Cloud Run)
1. As músicas devem ser enviadas ao Cloud Storage:
   ```powershell
   .\scripts\upload-music.ps1
   ```
2. O servidor Cloud Run lê as músicas do bucket `gdm-live-radio-music`
3. O stream é servido via URL do Cloud Run, configurada em `VITE_STREAM_URL`

---

## 10. Painel Administrativo

Acesse em: `/admin` (ou `/admin/login` se não autenticado)

**Primeira vez:**
1. Execute `node scripts/create-admin.js`
2. Use o email e senha criados para fazer login

**Funcionalidades:**
- Sincronizar biblioteca de músicas
- Visualizar faixas indexadas
- Controlar modo de programação
- Monitorar transmissão em tempo real
- Visualizar logs do sistema

---

## 11. Variáveis de Ambiente

Consulte o arquivo [`.env.example`](.env.example) para a lista completa.

### Variáveis essenciais do servidor

| Variável | Descrição | Padrão |
|---|---|---|
| `MUSIC_LIBRARY_PATH` | Caminho da pasta de músicas | `E:\GDM_LIVE_RADIO\Minhas_Musicas` |
| `PORT` | Porta do servidor | `3001` |
| `FIREBASE_PROJECT_ID` | ID do projeto Firebase | `gdm-live-radio` |
| `ADMIN_EMAILS` | Emails de admin (separados por vírgula) | — |
| `SCHEDULER_MODE` | Modo de programação (`random`/`sequential`) | `random` |
| `AVOID_REPEAT_MINUTES` | Minutos antes de repetir uma música | `60` |

### Variáveis essenciais do frontend (prefixo `VITE_`)

| Variável | Descrição |
|---|---|
| `VITE_API_BASE_URL` | URL da API do servidor |
| `VITE_STREAM_URL` | URL do stream de áudio |
| `VITE_FIREBASE_API_KEY` | Chave API do Firebase |
| `VITE_FIREBASE_PROJECT_ID` | ID do projeto Firebase |

---

## 12. Testes

### Backend
```powershell
cd server
npm test
```

### Frontend
```powershell
cd frontend
npm run lint
npx tsc --noEmit
```

---

## 13. Deploy

### 13.1. Configurar GitHub Secrets

No GitHub, acesse Settings > Secrets and variables > Actions e adicione:

| Secret | Descrição |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | JSON da conta de serviço Firebase (para Actions) |
| `GCP_SA_KEY` | JSON da conta de serviço GCP (para Cloud Run) |
| `VITE_API_BASE_URL` | URL da API de produção |
| `VITE_STREAM_URL` | URL do stream de produção |
| `VITE_FIREBASE_API_KEY` | Chave API Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domínio auth Firebase |
| `VITE_FIREBASE_PROJECT_ID` | ID projeto Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket Storage Firebase |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID Firebase |
| `VITE_FIREBASE_APP_ID` | App ID Firebase |

### 13.2. Deploy manual do frontend

```powershell
cd E:\GDM_LIVE_RADIO\frontend
npm run build
firebase deploy --only hosting --project gdm-live-radio
```

### 13.3. Deploy do servidor (Cloud Run)

```powershell
cd E:\GDM_LIVE_RADIO\server
gcloud builds submit --tag gcr.io/gdm-live-radio/gdm-radio-server
gcloud run deploy gdm-radio-server \
  --image gcr.io/gdm-live-radio/gdm-radio-server \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 1
```

### 13.4. Deploy automático

Todo push na branch `main` dispara o workflow do GitHub Actions que:
1. Executa type checking
2. Compila o frontend
3. Faz deploy no Firebase Hosting
4. Faz build e deploy do servidor no Cloud Run

---

## 14. Solução de Problemas

### Música não aparece na programação
1. Verifique se o caminho `MUSIC_LIBRARY_PATH` está correto
2. Acesse o painel admin > Biblioteca > Sincronizar
3. Verifique os logs em admin > Logs
4. Confirme que os arquivos são MP3 válidos

### Player não conecta ao stream
1. Verifique se o servidor está rodando: `GET /api/status`
2. Confirme `VITE_STREAM_URL` no `.env`
3. Verifique CORS: o frontend e o servidor precisam ter origens compatíveis
4. Verifique se o FFmpeg está instalado: `ffmpeg -version`

### Erro de autenticação no painel admin
1. Execute `node scripts/create-admin.js` para criar o admin
2. Confirme que as variáveis Firebase estão corretas
3. Verifique se o usuário tem a custom claim `admin: true`

### Servidor para de transmitir
1. Verifique os logs do servidor
2. Confirme que há músicas válidas na biblioteca
3. Execute a sincronização manual pelo painel admin
4. Reinicie o serviço (Cloud Run restarting automático)

---

## 15. Segurança

- ✅ Segredos em variáveis de ambiente (nunca no código)
- ✅ Arquivo `.env` no `.gitignore`
- ✅ Chaves de serviço fora do repositório
- ✅ Autenticação Firebase para rotas administrativas
- ✅ CORS restrito às origens autorizadas
- ✅ Rate limiting nas rotas de autenticação
- ✅ Senhas com hash via Firebase Auth
- ✅ Regras do Firestore protegem dados administrativos
- ✅ Acesso à biblioteca restrito ao diretório configurado
- ✅ Sem execução de comandos arbitrários do SO via API

---

## 16. Licenças das Dependências

Este projeto usa software de código aberto. Principais licenças:

- React, Vite: MIT
- Express: MIT
- music-metadata: MIT
- fluent-ffmpeg: MIT
- Firebase SDK: Apache 2.0
- FFmpeg: LGPL 2.1+ / GPL 2+ (dependendo dos codecs)
- Tailwind CSS: MIT
- Zustand: MIT

Consulte o arquivo `LICENSE` e `node_modules/*/LICENSE` para detalhes completos.

---

## 17. Limitações Conhecidas

### Streaming contínuo com Cloud Run
Cloud Run foi projetado para requests de curta duração. Para streaming de áudio de longa duração, é necessário configurar:
- `--timeout 3600` (máximo 1 hora por request)
- O player reconecta automaticamente ao expirar

**Alternativa mais robusta para 24/7**: Google Compute Engine (VM e2-micro, ~\$5/mês) com Icecast2 + Liquidsoap como serviços systemd.

### Dependência do Cloud Storage
Se as músicas estiverem apenas no computador local, o servidor Cloud Run não terá acesso. Use `scripts/upload-music.ps1` para enviar ao Cloud Storage.

### Custos de egress
A transmissão de áudio gera tráfego de saída (egress). Estime ~0.7 GB/ouvinte/hora a 128kbps. Configure alertas de orçamento no GCP.

### Número de ouvintes simultâneos
O Cloud Run pode escalar horizontalmente, mas cada instância serve um número limitado de streams simultâneos. Monitore o uso.

### Transmissão offline
O service worker não armazena o stream para reprodução offline. A rádio requer conectividade ativa.

---

## 18. Estimativa de Custos

| Ouvintes simultâneos | Custo estimado/mês |
|---|---|
| 0-10 (low traffic) | ~\$0-5 (mostly free tier) |
| 10-50 | ~\$10-30 |
| 50-200 | ~\$30-100 |

Configure alertas em: [console.cloud.google.com/billing](https://console.cloud.google.com/billing)

---

## 19. Contribuição e Versionamento

- Branch principal: `main`
- Commits em português seguindo o padrão: `tipo: descrição`
- Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 20. Serviços que Precisam Estar Ativos

Para a rádio funcionar continuamente:

| Serviço | Responsabilidade | Reinicialização automática |
|---|---|---|
| Firebase Hosting | Serve o site | Automática (Google) |
| Cloud Run (servidor) | Streaming + API | Automática (min-instances=1) |
| Cloud Storage | Armazena músicas | Automática (Google) |
| Firestore | Dados e configurações | Automática (Google) |

**Não é necessário manter o computador pessoal ligado** após o upload das músicas ao Cloud Storage.

---

<div align="center">
  <p>Desenvolvido com ❤️ para a <strong>Graça Digital — GDM</strong></p>
  <p><a href="https://gdmlive.web.app">gdmlive.web.app</a></p>
</div>


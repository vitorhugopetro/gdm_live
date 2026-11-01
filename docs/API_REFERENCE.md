# Referência da API — GDM Live Radio Backend

O servidor backend é implementado em Node.js com Express e gerencia a transmissão contínua e as consultas de catálogo.

Porta padrão de desenvolvimento: `http://localhost:3001`

---

## 1. Endpoints de Transmissão

### `GET /stream`
Retorna o fluxo contínuo de áudio codificado em tempo real pelo FFmpeg.

- **Content-Type:** `audio/mpeg`
- **Transfer-Encoding:** `chunked`
- **Bitrate:** 128 kbps CBR
- **Taxa de Amostragem:** 44.1 kHz Estéreo
- **Comportamento:** Novos clientes conectam-se imediatamente ao ponto atual de reprodução do loop da rádio (live edge).

---

## 2. Endpoints de Metadados

### `GET /api/now-playing`
Retorna as informações completas da música em reprodução no momento.

**Resposta de Sucesso (HTTP 200):**
```json
{
  "success": true,
  "data": {
    "track": {
      "id": "uuid-da-faixa",
      "title": "A Cruz e o Sacrifício de Jesus",
      "artist": "Graça Digital (GDM)",
      "album": "Louvores de Fé & Esperança",
      "duration": 320,
      "format": "mp3",
      "fileSize": 5482486
    },
    "startedAt": "2026-11-01T15:30:00.000Z",
    "streamUrl": "/stream",
    "listenerCount": 142,
    "isLive": true,
    "programMode": "random"
  },
  "timestamp": "2026-11-01T15:30:05.000Z"
}
```

---

### `GET /api/history`
Retorna o histórico das últimas músicas transmitidas pela rádio.

**Parâmetros de Consulta (Query):**
- `limit` (opcional, padrão `10`): Número de faixas a retornar.

---

### `GET /api/library`
Pesquisa e paginação de todo o acervo de 402 louvores da rádio.

**Parâmetros de Consulta (Query):**
- `page` (padrão `1`): Número da página.
- `pageSize` (padrão `20`): Quantidade de itens por página.
- `search` (opcional): Filtro textual por título, artista ou álbum.

---

### `GET /api/banner`
Retorna o aviso ou mensagem pastoral em destaque para exibição na barra de avisos da rádio.


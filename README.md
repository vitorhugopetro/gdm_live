# GDM Live Radio — Graça Digital (GDM)

<div align="center">
  <h2>🎵 A rádio cristã que toca sua fé o tempo todo!</h2>
  <p><em>Músicas autorais da Graça Digital, criadas com fé, criatividade e propósito para levar esperança e renovação.</em></p>

  [![Website Oficial](https://img.shields.io/badge/site-https%3A%2F%2Fgdmlr.web.app-7000FF?style=for-the-badge&logo=google-chrome&logoColor=white)](https://gdmlr.web.app)
  [![Firebase Hosting](https://img.shields.io/badge/hosting-Firebase%20CDN-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://gdmlr.web.app)
  [![Status](https://img.shields.io/badge/status-online%2024%2F7-10B981?style=for-the-badge)](https://gdmlr.web.app)
  [![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
</div>

---

## 🌐 Endereços Oficiais

- ⭐️ **Endereço Principal:** **[https://gdmlr.web.app/](https://gdmlr.web.app/)**
- 🔁 **Espelho Secundário:** [https://gdm-live-radio.web.app/](https://gdm-live-radio.web.app/)
- 🗺️ **Sitemap XML:** [https://gdmlr.web.app/sitemap.xml](https://gdmlr.web.app/sitemap.xml)
- 🤖 **Robots.txt:** [https://gdmlr.web.app/robots.txt](https://gdmlr.web.app/robots.txt)

---

## 📚 Documentação Completa do Projeto

Para garantir excelência profissional, o projeto possui documentação aprofundada organizada em:

| Documento | Descrição |
| :--- | :--- |
| 🏛️ **[Arquitetura do Sistema](docs/ARCHITECTURE.md)** | Visão técnica do Smart Hybrid Audio Engine, diagramas e pipeline. |
| 🔍 **[Manual Completo de SEO](docs/SEO_GUIDE.md)** | Schema.org JSON-LD, Open Graph, Twitter Cards, Sitemap e Google Search Console. |
| 🚀 **[Guia de Deploy & Operações](docs/DEPLOYMENT.md)** | Procedimento multi-site do Firebase Hosting, Service Accounts e SSL. |
| 📡 **[Referência da API](docs/API_REFERENCE.md)** | Documentação dos endpoints REST e streaming contínuo chunked HTTP. |
| 📖 **[Manual do Usuário](docs/USER_MANUAL.md)** | Guia prático para ouvintes, instalação PWA no celular e pedidos de oração. |

---

## ✨ Destaques da Plataforma

- **Smart Hybrid Streaming Engine:** Áudio garantido sob qualquer condição. Inicia instantaneamente com os melhores louvores autorais da GDM na CDN da Google, alternando suavemente sem interrupção.
- **Design Hiper-Realista:** Identidade visual inspirada na presença divina: arte 3D dourada, cruz sagrada em destaque, adorador na montanha, Bíblia aberta com raios celestiais e fones neon profissionais.
- **Catálogo de 402 Músicas:** Sistema de indexação rápida com cache local em milissegundos para mais de quatrocentas composições autorais.
- **SEO & Redes Sociais de Nível Máximo:** Metadados estruturados para qualificação em Rich Snippets do Google e cartões visuais para WhatsApp, Instagram, Facebook e Twitter/X.
- **PWA (Progressive Web App):** Instalação nativa em Android e iOS com suporte a Media Session API (capa e controles na tela de bloqueio do celular).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, Zustand, Lucide Icons, Canvas Audio Visualizer
- **Áudio & Transmissão:** HTML5 Audio Singleton, Web Audio API, FFmpeg (transcodificação 128 kbps CBR)
- **Backend:** Node.js, Express, Music-Metadata
- **Hospedagem & Nuvem:** Firebase Hosting (Multi-Site CDN Global), Google Cloud Platform

---

## 🚀 Como Executar Localmente

### 1. Clonar o Repositório
```bash
git clone https://github.com/vitorhugopetro/gdm_live.git
cd gdm_live
```

### 2. Instalar Dependências
```bash
# Na raiz
npm install

# No backend
npm --prefix server install

# No frontend
npm --prefix frontend install
```

### 3. Iniciar em Desenvolvimento
```bash
# Iniciar o servidor de streaming backend (porta 3001)
npm --prefix server run dev

# Em outro terminal, iniciar o frontend Vite (porta 5173)
npm --prefix frontend run dev
```

Acesse `http://localhost:5173/` no seu navegador.

---

## 📦 Como Compilar e Fazer Deploy

```powershell
# 1. Compilar o frontend com otimizações de produção
npm --prefix frontend run build

# 2. Publicar nos domínios oficiais (gdmlr.web.app e gdm-live-radio.web.app)
node tools/deploy_firebase.js
```

---

## 📄 Licença
Distribuído sob a licença MIT. Consulte `LICENSE` para mais detalhes.

© 2026 Graça Digital (GDM) — Todos os direitos reservados.

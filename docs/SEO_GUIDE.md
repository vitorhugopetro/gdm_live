# Manual de SEO & Indexação — GDM Live Radio

## 1. Estratégia de SEO

A plataforma **GDM Live Radio** foi configurada para atingir pontuação máxima (100/100) em auditorias do Google Lighthouse e rankeamento orgânico nos mecanismos de busca (Google, Bing, Yahoo), além de cartões de compartilhamento ricos em redes sociais (WhatsApp, Facebook, Twitter, Telegram, LinkedIn).

---

## 2. Identificação & Domínio Canônico

- **Domínio Principal Oficial:** `https://gdmlr.web.app/`
- **Domínio Alternativo:** `https://gdm-live-radio.web.app/`
- **Canonical Tag:** Declarada em todas as páginas apontando para a URL canônica em `https://gdmlr.web.app/`.

---

## 3. Dados Estruturados (Schema.org JSON-LD)

Implementados no `index.html` para qualificação em Rich Results (Resultados Ricos do Google):

### 3.1. Entidade `RadioStation`
```json
{
  "@context": "https://schema.org",
  "@type": "RadioStation",
  "@id": "https://gdmlr.web.app/#radiostation",
  "name": "GDM Live Radio",
  "alternateName": "Graça Digital Live Radio",
  "url": "https://gdmlr.web.app/",
  "logo": "https://gdmlr.web.app/images/player-album-art.jpg",
  "image": "https://gdmlr.web.app/images/hero-art-hyperrealistic.jpg",
  "description": "A rádio cristã que toca sua fé o tempo todo! Músicas autorais da Graça Digital (GDM).",
  "genre": "Christian Praise and Worship",
  "inLanguage": "pt-BR",
  "action": {
    "@type": "ListenAction",
    "target": "https://gdmlr.web.app/"
  }
}
```

### 3.2. Entidade `WebSite`
Permite exibição do nome do site em destaque nos snippets do Google Search e potencial de busca interna.

---

## 4. Metadados Open Graph & Twitter Cards

| Tag | Conteúdo | Finalidade |
| :--- | :--- | :--- |
| `og:title` | GDM Live Radio — A rádio cristã que toca sua fé o tempo todo! | Título no WhatsApp/Facebook |
| `og:description` | Músicas autorais da Graça Digital (GDM), criadas com fé e propósito. | Resumo nos compartilhamentos |
| `og:image` | `https://gdmlr.web.app/images/hero-art-hyperrealistic.jpg` (1200x630) | Imagem hiper-realista em destaque |
| `og:type` | `music.radio_station` | Tipo específico de mídia |
| `twitter:card` | `summary_large_image` | Card grande no Twitter/X |

---

## 5. Rastreamento e Indexação

### 5.1. `robots.txt`
Localizado na raiz: `https://gdmlr.web.app/robots.txt`
```txt
User-agent: *
Allow: /

Sitemap: https://gdmlr.web.app/sitemap.xml
Sitemap: https://gdm-live-radio.web.app/sitemap.xml
```

### 5.2. `sitemap.xml`
Localizado na raiz: `https://gdmlr.web.app/sitemap.xml`
- Mapeia todas as rotas públicas (`/`, `/programacao`, `/sobre`, `/comunidade`).
- Inclui anotações de imagens com `<image:loc>`, `<image:title>` e `<image:caption>` para indexação no Google Imagens.
- Prioridades ajustadas para 1.0 na Home e 0.8 nas demais páginas.

### 5.3. Atualização Dinâmica via React (`SEO.tsx`)
O componente `SEO` atualiza dinamicamente no cliente:
- `document.title`
- Meta tag `description`
- Tags `og:title`, `og:description`, `og:url`
- Link `canonical` específico de cada rota ao navegar entre páginas sem recarregar o navegador.

---

## 6. Checklist de Verificação no Google Search Console

1. Acesse [Google Search Console](https://search.google.com/search-console).
2. Adicione a propriedade com prefixo de URL: `https://gdmlr.web.app/`.
3. Valide automaticamente através do Firebase Hosting / Google Account.
4. Envie o sitemap: `https://gdmlr.web.app/sitemap.xml`.
5. Solicite indexação da página inicial via ferramenta de Inspeção de URL.

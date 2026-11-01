# Guia de Deploy & Operações — GDM Live Radio

## 1. Ambientes e URLs

O projeto utiliza a infraestrutura de CDN global da Google via **Firebase Hosting Multi-Site**:

| Site / Alvo | URL Principal | Finalidade |
| :--- | :--- | :--- |
| **`gdmlr`** | [https://gdmlr.web.app](https://gdmlr.web.app) | **Endereço Principal Oficial da Rádio** |
| **`gdm-live-radio`** | [https://gdm-live-radio.web.app](https://gdm-live-radio.web.app) | Endereço legado / espelho secundário |

Ambos os sites recebem exatamente o mesmo build otimizado com cabeçalhos HTTP de cache agressivo e suporte a streaming de áudio com `Accept-Ranges: bytes`.

---

## 2. Configuração do `firebase.json`

O arquivo `firebase.json` define a estratégia multi-site para deploy simultâneo em ambos os destinos:

```json
{
  "hosting": [
    {
      "site": "gdmlr",
      "public": "frontend/dist",
      "rewrites": [{ "source": "**", "destination": "/index.html" }],
      "headers": [
        {
          "source": "**/*.@(mp3)",
          "headers": [
            { "key": "Content-Type", "value": "audio/mpeg" },
            { "key": "Accept-Ranges", "value": "bytes" },
            { "key": "Cache-Control", "value": "public, max-age=86400" }
          ]
        }
      ]
    },
    {
      "site": "gdm-live-radio",
      "public": "frontend/dist",
      ...
    }
  ]
}
```

---

## 3. Como Realizar Deploy em Produção

### Método 1: Script Automatizado (Recomendado)
Um script de autenticação OAuth2 segura via Service Account está disponível na pasta `tools/`:

```powershell
# 1. Compilar o frontend com TypeScript e Vite
npm --prefix frontend run build

# 2. Executar o deploy automatizado para gdmlr.web.app e gdm-live-radio.web.app
node tools/deploy_firebase.js
```

O script:
1. Lê as credenciais da conta de serviço Google Cloud.
2. Gera e assina o JWT criptográfico via RSA-SHA256.
3. Troca o JWT por um token OAuth2 válido no Google Identity.
4. Invoca o `firebase-tools deploy` publicando em ambos os sites em menos de 30 segundos.

---

## 4. Configuração de Domínio Personalizado (Ex: `www.gdmliveradio.com.br`)

Para conectar um domínio próprio com certificado SSL grátis emitido pelo Google:
1. Acesse o Console do Firebase: [https://console.firebase.google.com/project/gdm-live-radio/hosting/sites/gdmlr](https://console.firebase.google.com/project/gdm-live-radio/hosting/sites/gdmlr).
2. Clique em **Adicionar domínio personalizado**.
3. Insira o domínio desejado.
4. Adicione os registros `A` ou `CNAME` indicados na sua zona de DNS (ex: Registro.br ou Cloudflare).
5. O Firebase provisionará o certificado SSL automaticamente em até 24 horas.


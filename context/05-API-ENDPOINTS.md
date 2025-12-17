# Guía de APIs y Endpoints

## 🌐 Base URL

```
http://localhost:3000
```

---

## 📡 Endpoints Disponibles

### 1. GPT Module

#### **Basic Prompt**

```http
POST /gpt/basic-prompt
Content-Type: application/json
```

**Request Body:**

```json
{
  "prompt": "Tu pregunta o instrucción aquí"
}
```

**Validaciones:**

- `prompt`: String, no vacío, requerido

**Response (200 OK):**

```json
"La respuesta del modelo GPT"
```

**Response (400 Bad Request):**

```json
{
  "statusCode": 400,
  "message": "Prompt cannot be empty",
  "error": "Bad Request"
}
```

**Response (500 Internal Server Error):**

```json
{
  "statusCode": 500,
  "message": "Error processing the prompt",
  "error": "Internal Server Error"
}
```

**Ejemplo con cURL:**

```bash
curl -X POST http://localhost:3000/gpt/basic-prompt \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "¿Qué es TypeScript?"
  }'
```

---

#### **Improve Resume**

```http
POST /gpt/improve-resume
Content-Type: application/json
```

**Request Body:**

```json
{
  "cv": "Tu CV completo aquí...",
  "form": "Información adicional opcional...",
  "goal": "Tu objetivo profesional"
}
```

**Validaciones:**

- `cv`: String, requerido, máximo 15,000 caracteres
- `form`: String, opcional, máximo 10,000 caracteres
- `goal`: String, requerido, máximo 500 caracteres

**Response (200 OK):**

```json
{
  "success": true,
  "improvedCV": "# Datos de Contacto\n\n...",
  "metadata": {
    "tokensUsed": 2450,
    "model": "gpt-4o-mini"
  }
}
```

**Response (400 Bad Request):**

```json
{
  "statusCode": 400,
  "message": [
    "The CV must be a valid text",
    "The CV is required",
    "The CV cannot exceed 15000 characters"
  ],
  "error": "Bad Request"
}
```

**Response (500 Internal Server Error):**

```json
{
  "statusCode": 500,
  "message": "OpenAI error (429): Rate limit exceeded",
  "error": "Internal Server Error"
}
```

**Ejemplo con cURL:**

```bash
curl -X POST http://localhost:3000/gpt/improve-resume \
  -H "Content-Type: application/json" \
  -d '{
    "cv": "Juan Pérez\nDesarrollador Full Stack\n...",
    "form": "Conocimientos adicionales en Docker...",
    "goal": "Conseguir puesto de Senior Developer en startup tech"
  }'
```

**Ejemplo con Fetch (JavaScript):**

```javascript
const response = await fetch('http://localhost:3000/gpt/improve-resume', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    cv: 'Tu CV aquí...',
    form: 'Info adicional...',
    goal: 'Tu objetivo profesional',
  }),
});

const data = await response.json();
console.log(data.improvedCV);
```

---

### 2. SAM Agent Module

#### **Developer Agent**

```http
POST /sam-agent/developer-agent
Content-Type: application/json
```

**Request Body:**

```json
{
  "prompt": "Tu pregunta técnica aquí",
  "conversationId": "user-123-session-1",
  "model": "gpt-4o-mini",
  "tools": []
}
```

**Validaciones:**

- `prompt`: String, requerido
- `conversationId`: String, requerido
- `model`: String, opcional (default: "gpt-4o-mini")
- `tools`: Array de strings, opcional

**Response (200 OK):**

```json
"La respuesta del agente con contexto conversacional..."
```

Nota: El endpoint devuelve directamente el string de respuesta, no un objeto JSON.

**Response (500 Internal Server Error):**

```json
{
  "statusCode": 500,
  "message": "Failed to process developer request: ...",
  "error": "Internal Server Error"
}
```

**Ejemplo con cURL (Primera interacción):**

```bash
curl -X POST http://localhost:3000/sam-agent/developer-agent \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "¿Cómo implemento un middleware en NestJS?",
    "conversationId": "user-123-session-1"
  }'
```

**Ejemplo con cURL (Segunda interacción - mismo contexto):**

```bash
curl -X POST http://localhost:3000/sam-agent/developer-agent \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "¿Puedes mostrarme un ejemplo?",
    "conversationId": "user-123-session-1"
  }'
```

**Ejemplo con Axios:**

```javascript
import axios from 'axios';

const conversationId = `user-${userId}-${Date.now()}`;

// Primera pregunta
const response1 = await axios.post(
  'http://localhost:3000/sam-agent/developer-agent',
  {
    prompt: '¿Qué es un DTO en NestJS?',
    conversationId,
  },
);

console.log(response1.data);

// Pregunta de seguimiento
const response2 = await axios.post(
  'http://localhost:3000/sam-agent/developer-agent',
  {
    prompt: '¿Puedes mostrarme un ejemplo?',
    conversationId, // Mismo ID para mantener contexto
  },
);

console.log(response2.data);
```

---

## 🔒 Seguridad y Headers

### CORS

El servidor tiene CORS habilitado para todos los orígenes:

```typescript
app.enableCors();
```

Para producción, se recomienda configurar orígenes específicos:

```typescript
app.enableCors({
  origin: ['https://tu-frontend.com'],
  methods: ['GET', 'POST'],
  credentials: true,
});
```

### Content-Type

Todos los endpoints esperan y devuelven JSON:

```
Content-Type: application/json
```

### Límites de Payload

- Máximo: 10MB
- Configurado en `main.ts` con body-parser

---

## ⚠️ Códigos de Error Comunes

| Código | Significado           | Causa                         |
| ------ | --------------------- | ----------------------------- |
| 400    | Bad Request           | Validación fallida en DTO     |
| 500    | Internal Server Error | Error de OpenAI API o interno |
| 429    | Too Many Requests     | Rate limit de OpenAI excedido |

---

## 📊 Límites y Cuotas

### Límites de Longitud

| Campo    | Límite                | Endpoint                     |
| -------- | --------------------- | ---------------------------- |
| `prompt` | Sin límite específico | `/gpt/basic-prompt`          |
| `cv`     | 15,000 caracteres     | `/gpt/improve-resume`        |
| `form`   | 10,000 caracteres     | `/gpt/improve-resume`        |
| `goal`   | 500 caracteres        | `/gpt/improve-resume`        |
| `prompt` | Sin límite específico | `/sam-agent/developer-agent` |

### Límites de Conversación

- **Historial máximo:** 10 mensajes por `conversationId`
- **Rotación:** Mensajes más antiguos se eliminan automáticamente

### Límites de Tokens (OpenAI)

| Modelo       | Max Output Tokens | Uso             |
| ------------ | ----------------- | --------------- |
| gpt-4.1-nano | 150               | Basic Prompt    |
| gpt-4o-mini  | 3,000             | Improve Resume  |
| gpt-4o-mini  | Variable          | Developer Agent |

---

## 🧪 Testing de Endpoints

### Con Postman

**Colección de ejemplo:**

```json
{
  "info": {
    "name": "Nest Job Hub API"
  },
  "item": [
    {
      "name": "Basic Prompt",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": "http://localhost:3000/gpt/basic-prompt",
        "body": {
          "mode": "raw",
          "raw": "{\"prompt\": \"Test\"}"
        }
      }
    },
    {
      "name": "Improve Resume",
      "request": {
        "method": "POST",
        "header": [],
        "url": "http://localhost:3000/gpt/improve-resume",
        "body": {
          "mode": "raw",
          "raw": "{\"cv\": \"...\", \"goal\": \"...\"}"
        }
      }
    },
    {
      "name": "Developer Agent",
      "request": {
        "method": "POST",
        "header": [],
        "url": "http://localhost:3000/sam-agent/developer-agent",
        "body": {
          "mode": "raw",
          "raw": "{\"prompt\": \"...\", \"conversationId\": \"...\"}"
        }
      }
    }
  ]
}
```

### Con HTTPie

```bash
# Basic Prompt
http POST localhost:3000/gpt/basic-prompt prompt="Test"

# Improve Resume
http POST localhost:3000/gpt/improve-resume \
  cv="..." \
  goal="..." \
  form="..."

# Developer Agent
http POST localhost:3000/sam-agent/developer-agent \
  prompt="¿Cómo usar decoradores?" \
  conversationId="test-123"
```

---

## 🔄 Rate Limiting

Actualmente **no hay rate limiting** implementado en el servidor. Las únicas limitaciones son:

1. Rate limits de OpenAI API (depende de tu tier)
2. Rate limits de Google Custom Search API (100 búsquedas/día en tier gratuito)

**Recomendación para producción:**
Implementar rate limiting con `@nestjs/throttler`:

```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    })
  ]
})
```

---

## 📱 Ejemplos de Integración Frontend

### React

```typescript
import { useState } from 'react';

function CVImprover() {
  const [cv, setCv] = useState('');
  const [goal, setGoal] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const improveCV = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/gpt/improve-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cv, goal })
      });

      const data = await response.json();
      setResult(data.improvedCV);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea value={cv} onChange={e => setCv(e.target.value)} />
      <input value={goal} onChange={e => setGoal(e.target.value)} />
      <button onClick={improveCV} disabled={loading}>
        {loading ? 'Mejorando...' : 'Mejorar CV'}
      </button>
      <div>{result}</div>
    </div>
  );
}
```

### Vue

```vue
<script setup>
import { ref } from 'vue';

const prompt = ref('');
const conversationId = ref(`session-${Date.now()}`);
const messages = ref([]);

async function sendMessage() {
  const response = await fetch(
    'http://localhost:3000/sam-agent/developer-agent',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt.value,
        conversationId: conversationId.value,
      }),
    },
  );

  const answer = await response.json();
  messages.value.push({
    user: prompt.value,
    assistant: answer,
  });

  prompt.value = '';
}
</script>

<template>
  <div>
    <div v-for="msg in messages" :key="msg">
      <p><strong>Tú:</strong> {{ msg.user }}</p>
      <p><strong>Agente:</strong> {{ msg.assistant }}</p>
    </div>
    <input v-model="prompt" @keyup.enter="sendMessage" />
    <button @click="sendMessage">Enviar</button>
  </div>
</template>
```

---

## 🌐 Despliegue y URLs

### Desarrollo

```
http://localhost:3000
```

### Producción (ejemplo)

```
https://api.nest-job-hub.com
```

### Health Check

Actualmente no hay endpoint de health check. Recomendación:

```typescript
@Get('health')
health() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

---

**Nota:** Todos los ejemplos asumen que el servidor está corriendo localmente en el puerto 3000. Ajusta la URL según tu configuración.

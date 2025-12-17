# Features y Funcionalidades del Proyecto

## 🎯 Módulo GPT - Funcionalidades

### 1. **Basic Prompt** ✅ IMPLEMENTADO

**Endpoint:** `POST /gpt/basic-prompt`

**Descripción:** Envía un prompt simple a GPT y recibe una respuesta directa.

**DTO:**

```typescript
{
  prompt: string; // Requerido, no vacío
}
```

**Use Case:** `basicPromptUseCase`

- Modelo: `gpt-4.1-nano`
- Max tokens: 150
- Uso: Consultas rápidas y simples

**Ejemplo de uso:**

```json
POST /gpt/basic-prompt
{
  "prompt": "Explica qué es TypeScript"
}
```

---

### 2. **Improve Resume (Mejorar CV)** ✅ IMPLEMENTADO

**Endpoint:** `POST /gpt/improve-resume`

**Descripción:** Optimiza un CV profesional usando IA, considerando un objetivo profesional y formulario adicional opcional.

**DTO:**

```typescript
{
  cv: string,      // Max 15000 caracteres
  form?: string,   // Opcional, max 10000 caracteres
  goal: string     // Max 500 caracteres
}
```

**Use Case:** `improveResumeUseCase`

- Modelo: `gpt-4o-mini`
- Max tokens: 3000
- Temperature: 0.3 (más determinístico)
- Formato de salida: Markdown

**Características:**

- ✅ Optimización ATS-friendly
- ✅ Palabras clave relevantes
- ✅ Logros medibles destacados
- ✅ Verbos de acción
- ✅ Formato profesional estructurado
- ✅ Sistema de prompts especializado

**Secciones del CV generado:**

1. Datos de Contacto
2. Resumen Profesional
3. Experiencia Profesional
4. Educación
5. Habilidades Técnicas
6. Idiomas

**Respuesta:**

```json
{
  "success": true,
  "improvedCV": "...",
  "metadata": {
    "tokensUsed": 1234,
    "model": "gpt-4o-mini"
  }
}
```

---

### 3. **Otros Casos de Uso Disponibles** 🔄 PARCIALMENTE IMPLEMENTADOS

Los siguientes casos de uso están implementados pero **no expuestos en el controlador**:

#### a) **Orthography (Ortografía)**

- Archivo: `orthography.use-case.ts`
- DTO: `orthography.dto.ts`
- Propósito: Corrección ortográfica y gramatical

#### b) **Pros-Cons Discusser**

- Archivo: `pros-cons-discusser.use-case.ts`
- DTO: `pros-cons-discusser.dto.ts`
- Propósito: Análisis de pros y contras de temas

#### c) **Pros-Cons Stream**

- Archivo: `pros-cons-stream.use-case.ts`
- Propósito: Streaming de análisis pros/contras

#### d) **Translate**

- Archivo: `translate.use-case.ts`
- DTO: `translate.dto.ts`
- Propósito: Traducción de textos

#### e) **Text to Audio**

- Archivo: `text-to-audio.use-case.ts`
- DTO: `text-to-audio.dto.ts`
- Propósito: Conversión de texto a audio (TTS)

#### f) **Text to Audio Getter**

- Archivo: `text-to-audio-getter.use-case.ts`
- Propósito: Recuperación de archivos de audio generados

#### g) **Audio to Text**

- Archivo: `audio-to-text.use-case.ts`
- DTO: `audio-to-text.dto.ts`
- Validator: `audio-file.validator.ts`
- Propósito: Transcripción de audio a texto (STT)

#### h) **Image Generation**

- Archivo: `image-generation.use-case.ts`
- DTO: `image-generation.dto.ts`
- Propósito: Generación de imágenes con DALL-E

#### i) **Image Generation Getter**

- Archivo: `image-generation-getter.use-case.ts`
- Propósito: Recuperación de imágenes generadas

#### j) **Image Variation**

- Archivo: `image-variation.use-case.ts`
- DTO: `image-variation.dto.ts`
- Propósito: Variaciones de imágenes existentes

#### k) **JavaScript Developer Assistant**

- Archivo: `javascript-developer.use-case.ts`
- DTO: `javascript-developer.dto.ts`
- Propósito: Asistente especializado en JavaScript

---

## 🤖 Módulo SAM Agent - Funcionalidades

### 1. **Developer Agent** ✅ IMPLEMENTADO

**Endpoint:** `POST /sam-agent/developer-agent`

**Descripción:** Agente conversacional inteligente especializado en desarrollo de software con capacidad de búsqueda web.

**DTO:**

```typescript
{
  prompt: string,           // Requerido
  conversationId: string,   // Requerido - ID único de conversación
  model?: string,           // Opcional, default: "gpt-4o-mini"
  tools?: string[]          // Opcional - herramientas adicionales
}
```

**Use Case:** `developerUseCase`

**Características principales:**

- ✅ **Historial conversacional persistente**
  - Límite: 10 mensajes por conversación
  - Gestión automática de memoria
  - Context window optimizado

- ✅ **Búsqueda web inteligente**
  - Integración con Google Custom Search API
  - Búsqueda automática cuando falta información
  - Top 3 resultados relevantes

- ✅ **Sistema de herramientas extensible**
  - Framework: `@openai/agents`
  - Herramientas actuales: `webSearchToolGoogle`
  - Arquitectura preparada para más herramientas

- ✅ **Respuestas contextuales**
  - Considera todo el historial
  - Respuestas técnicas precisas
  - Código limpio y mejores prácticas

**Instrucciones del agente:**

```
You are an expert software development assistant.
Your role is to help developers with their technical queries,
providing clean code, best practices, and clear explanations.

If you don't have enough information to respond, search the web.
```

**Respuesta:**

```json
{
  "output": "...",
  "conversationId": "abc-123",
  "messageCount": 4,
  "timestamp": "2025-12-17T..."
}
```

**Ejemplo de uso:**

```json
POST /sam-agent/developer-agent
{
  "prompt": "¿Cómo implemento un middleware en NestJS?",
  "conversationId": "user-123-session-1"
}
```

---

## 🔗 Vinculaciones entre Funcionalidades

### 1. **GptService ↔ Use Cases**

```
GptService
  ├─→ basicPromptUseCase
  └─→ improveResumeUseCase
```

**Relación:**

- El servicio orquesta y maneja errores
- Los use cases contienen lógica pura
- Separación de responsabilidades clara

---

### 2. **SamAgentService ↔ Developer Use Case ↔ Tools**

```
SamAgentService
  └─→ developerUseCase
       └─→ Agent (@openai/agents)
            └─→ webSearchToolGoogle
                 └─→ GoogleSearchService
                      └─→ Google Custom Search API
```

**Flujo de vinculación:**

1. El servicio recibe la solicitud
2. El use case crea el agente con instrucciones
3. El agente puede usar herramientas automáticamente
4. La herramienta llama al servicio de búsqueda
5. El servicio consulta la API externa
6. Resultados se integran en la respuesta del agente

---

### 3. **Conversación Multi-turno**

```
Estado de Conversación (Map)
  ├─→ conversationId: "session-1"
  │    └─→ Message[]
  │         ├─→ { role: 'user', content: '...', timestamp: '...' }
  │         ├─→ { role: 'assistant', content: '...', timestamp: '...' }
  │         └─→ ... (max 10 mensajes)
  │
  └─→ conversationId: "session-2"
       └─→ Message[]
```

**Características:**

- Cada `conversationId` mantiene su propio historial
- Límite de 10 mensajes evita context overflow
- Mensajes más antiguos se descartan automáticamente
- Timestamp en cada mensaje

---

### 4. **Validación Multi-capa**

```
Request HTTP
  │
  ├─→ [1] Class-validator (DTO)
  │    └─→ @IsString(), @MaxLength(), etc.
  │
  ├─→ [2] Service Layer
  │    └─→ Validación de negocio
  │
  └─→ [3] Use Case Layer
       └─→ Validación específica de caso
```

**Ejemplo completo (Improve Resume):**

```typescript
// [1] DTO Validation
@MaxLength(15000)
cv: string;

// [2] Service Validation
if (cv.length > MAX_CV_LENGTH) {
  throw new BadRequestException(...);
}

// [3] Use Case Validation
if (!cv?.trim() || !goal?.trim()) {
  throw new Error(...);
}
```

---

## 📤 Helpers y Utilidades

### 1. **download-image-as-png**

- Ubicación: `src/helpers/download-image-as-png.ts`
- Propósito: Descarga y convierte imágenes a PNG
- Uso: Casos de uso de generación de imágenes

---

## 🔄 Extensibilidad

### Agregar nuevos casos de uso al módulo GPT:

1. Crear archivo en `src/gpt/use-cases/`
2. Crear DTO en `src/gpt/dtos/`
3. Exportar en archivos `index.ts`
4. Agregar método en `GptService`
5. Agregar endpoint en `GptController`

### Agregar nuevas herramientas a SAM Agent:

1. Crear archivo en `src/sam-agent/tools/`
2. Definir con `tool()` de `@openai/agents`
3. Usar esquema Zod para parámetros
4. Agregar al array `tools` en `developerUseCase`

---

## 📊 Resumen de Features

| Feature            | Estado          | Endpoint                     | Tecnología           |
| ------------------ | --------------- | ---------------------------- | -------------------- |
| Basic Prompt       | ✅ Activo       | `/gpt/basic-prompt`          | GPT-4.1-nano         |
| Improve Resume     | ✅ Activo       | `/gpt/improve-resume`        | GPT-4o-mini          |
| Developer Agent    | ✅ Activo       | `/sam-agent/developer-agent` | Agents + GPT-4o-mini |
| Web Search Tool    | ✅ Activo       | (Herramienta interna)        | Google Custom Search |
| Orthography        | 🔄 Implementado | ❌ No expuesto               | -                    |
| Translate          | 🔄 Implementado | ❌ No expuesto               | -                    |
| Text to Audio      | 🔄 Implementado | ❌ No expuesto               | -                    |
| Audio to Text      | 🔄 Implementado | ❌ No expuesto               | -                    |
| Image Generation   | 🔄 Implementado | ❌ No expuesto               | -                    |
| Image Variation    | 🔄 Implementado | ❌ No expuesto               | -                    |
| Pros-Cons Analysis | 🔄 Implementado | ❌ No expuesto               | -                    |
| JS Developer       | 🔄 Implementado | ❌ No expuesto               | -                    |

---

**Total de features implementadas pero no expuestas:** 10  
**Potencial de expansión:** Alto - Solo requiere agregar endpoints en controladores

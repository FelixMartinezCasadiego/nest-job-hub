# Tecnologías y Dependencias del Proyecto

## 📚 Stack Completo

### Core Framework

#### **NestJS** v11.0.1

- **Categoría:** Framework Backend
- **Descripción:** Framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables
- **Características usadas:**
  - Módulos (@Module)
  - Controladores (@Controller)
  - Servicios (@Injectable)
  - Inyección de dependencias
  - Decoradores de ruta (@Post, @Body)
  - Pipes de validación

**Módulos de NestJS:**

- `@nestjs/core` - Core del framework
- `@nestjs/common` - Decoradores y utilidades comunes
- `@nestjs/platform-express` - Adaptador para Express
- `@nestjs/config` - Gestión de configuración y variables de entorno
- `@nestjs/mapped-types` - Utilidades para transformación de DTOs

---

### Lenguaje y Runtime

#### **TypeScript** v5.7.3

- **Categoría:** Lenguaje de programación
- **Características usadas:**
  - Tipado estático
  - Interfaces
  - Decoradores
  - Async/await
  - Generics
  - Type inference

**Archivos de configuración:**

- `tsconfig.json` - Configuración principal
- `tsconfig.build.json` - Configuración para build

---

## 🤖 Inteligencia Artificial

### **OpenAI SDK** v5.10.2

- **Categoría:** SDK de IA
- **Descripción:** Cliente oficial de OpenAI para Node.js
- **Características usadas:**
  - Chat completions API
  - Responses API
  - Error handling (APIError)
  - Streaming (preparado)

**Modelos utilizados:**

- `gpt-4.1-nano` - Modelo ligero para prompts simples
- `gpt-4o-mini` - Modelo optimizado para tareas complejas

**Configuración:**

```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

---

### **@openai/agents** v0.0.16

- **Categoría:** Sistema de agentes de IA
- **Descripción:** Framework para crear agentes con herramientas
- **Características usadas:**
  - Agent creation
  - Tool system
  - Conversational context
  - Run function

**Ejemplo de uso:**

```typescript
import { Agent, run, tool } from '@openai/agents';

const agent = new Agent({
  name: 'Developer Agent',
  model: 'gpt-4o-mini',
  tools: [webSearchTool],
  instructions: '...',
});

const result = await run(agent, prompt);
```

---

## 🔍 APIs Externas

### **Google Custom Search API**

- **Categoría:** API de búsqueda web
- **Endpoint:** `https://www.googleapis.com/customsearch/v1`
- **Configuración requerida:**
  - `GOOGLE_API_KEY` - API key de Google Cloud
  - `GOOGLE_SEARCH_ENGINE_ID` - ID del motor de búsqueda personalizado

**Características:**

- Máximo 3 resultados por búsqueda
- Resultados incluyen: title, snippet, link
- Manejo de errores de API

---

## ✅ Validación y Transformación

### **class-validator** v0.14.2

- **Categoría:** Validación de datos
- **Descripción:** Validación basada en decoradores
- **Decoradores usados:**
  - `@IsString()` - Validar string
  - `@IsNotEmpty()` - No vacío
  - `@MaxLength()` - Longitud máxima
  - `@IsOptional()` - Campo opcional
  - `@IsArray()` - Validar array

**Ejemplo:**

```typescript
export class ImproveResumeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(15000)
  cv: string;
}
```

---

### **class-transformer** v0.5.1

- **Categoría:** Transformación de objetos
- **Descripción:** Transforma objetos planos a instancias de clase y viceversa
- **Uso:** Integrado con ValidationPipe de NestJS

---

## 📁 Procesamiento de Archivos

### **Multer** v2.0.2

- **Categoría:** Middleware de uploads
- **Descripción:** Manejo de multipart/form-data
- **Uso potencial:** Upload de CVs, imágenes, audio
- **Tipos de TypeScript:** `@types/multer` v2.0.0

**Configuración:**

```typescript
// Preparado para uploads en casos de uso
import { FileInterceptor } from '@nestjs/platform-express';
```

---

### **Sharp** v0.34.3

- **Categoría:** Procesamiento de imágenes
- **Descripción:** Librería de alto rendimiento para manipulación de imágenes
- **Uso:** Conversión de imágenes a PNG, redimensionamiento
- **Formatos soportados:** JPEG, PNG, WebP, AVIF, TIFF, GIF, SVG

**Casos de uso:**

- Generación de imágenes
- Variaciones de imágenes
- Conversión de formatos

---

## 🌐 HTTP y Middleware

### **body-parser** v2.2.0

- **Categoría:** Middleware HTTP
- **Descripción:** Parseo de cuerpos de peticiones HTTP
- **Configuración:**

```typescript
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
```

**Características:**

- Límite de 10MB para payloads
- Soporte JSON y URL-encoded

---

## 🧪 Testing

### **Jest** v29.7.0

- **Categoría:** Framework de testing
- **Descripción:** Framework completo para testing en JavaScript/TypeScript
- **Configuración:**
  - Root: `src`
  - Test regex: `.*\.spec\.ts$`
  - Transform: `ts-jest`
  - Coverage directory: `coverage`

**Archivos de test existentes:**

- `sam-agent.controller.spec.ts`
- `sam-agent.service.spec.ts`

---

### **ts-jest** v29.2.5

- **Categoría:** Preset de Jest para TypeScript
- **Descripción:** Permite ejecutar tests escritos en TypeScript

---

### **Supertest** v7.0.0

- **Categoría:** Testing de APIs HTTP
- **Descripción:** Librería para testing de endpoints HTTP
- **Tipos:** `@types/supertest` v6.0.2

---

## 🛠️ Herramientas de Desarrollo

### **ESLint** v9.18.0

- **Categoría:** Linter
- **Descripción:** Herramienta de análisis estático de código
- **Plugins:**
  - `eslint-plugin-prettier` v5.2.2
  - `eslint-config-prettier` v10.0.1
  - `typescript-eslint` v8.20.0

**Configuración:** `eslint.config.mjs`

---

### **Prettier** v3.4.2

- **Categoría:** Formateador de código
- **Descripción:** Formateador de código opinado
- **Script:** `npm run format`

---

### **SWC** v1.10.7

- **Categoría:** Compilador
- **Descripción:** Compilador súper rápido de TypeScript/JavaScript
- **Paquetes:**
  - `@swc/core` - Core del compilador
  - `@swc/cli` - CLI de SWC

**Ventaja:** Compilación mucho más rápida que TSC

---

### **NestJS CLI** v11.0.0

- **Categoría:** CLI de desarrollo
- **Descripción:** Herramienta de línea de comandos para NestJS
- **Comandos usados:**
  - `nest build` - Compilar proyecto
  - `nest start --watch` - Modo desarrollo
  - `nest generate` - Generar recursos

**Configuración:** `nest-cli.json`

---

## 📦 Dependencias Auxiliares

### **reflect-metadata** v0.2.2

- **Categoría:** Polyfill
- **Descripción:** Soporte para metadata reflection API
- **Uso:** Requerido por decoradores de TypeScript

---

### **rxjs** v7.8.1

- **Categoría:** Programación reactiva
- **Descripción:** Librería para programación reactiva usando Observables
- **Uso:** Requerido por NestJS para ciertos patrones

---

## 🔧 Tipos de TypeScript

```typescript
@types/express     v5.0.0    // Tipos para Express
@types/jest        v29.5.14  // Tipos para Jest
@types/multer      v2.0.0    // Tipos para Multer
@types/node        v22.10.7  // Tipos para Node.js
@types/supertest   v6.0.2    // Tipos para Supertest
```

---

## 🚀 Scripts de NPM

```json
{
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/main",
  "build": "nest build",
  "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:e2e": "jest --config ./test/jest-e2e.json"
}
```

---

## 🌍 Variables de Entorno Requeridas

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Google Search
GOOGLE_API_KEY=AIza...
GOOGLE_SEARCH_ENGINE_ID=...

# Server
PORT=3000  # Opcional, default: 3000
```

---

## 📊 Comparativa de Tecnologías Similares

| Necesidad         | Tecnología Usada | Alternativas                       |
| ----------------- | ---------------- | ---------------------------------- |
| Framework Backend | NestJS           | Express, Fastify, Koa              |
| Validación        | class-validator  | Joi, Yup, Zod                      |
| IA                | OpenAI           | Anthropic, Google AI, Azure OpenAI |
| Testing           | Jest             | Vitest, Mocha, Ava                 |
| Compilador        | SWC              | TSC, esbuild, Babel                |
| Imágenes          | Sharp            | Jimp, ImageMagick                  |

---

## 🔄 Actualización y Mantenimiento

### Dependencias Principales Actualizadas Recientemente:

- NestJS v11 (última versión major)
- TypeScript v5.7 (últimas features)
- Node v22 (LTS más reciente)
- ESLint v9 (configuración plana)

### Consideraciones de Seguridad:

- ✅ Todas las dependencias están en versiones actuales
- ✅ No hay dependencias con vulnerabilidades conocidas críticas
- ✅ Uso de operadores `^` permite actualizaciones de parche automáticas

---

## 📈 Peso del Proyecto

**Categorías de dependencias:**

- **Producción:** 13 paquetes
- **Desarrollo:** 25 paquetes
- **Total:** 38 dependencias directas

**Ecosistema:**

- Node.js/TypeScript: 100%
- Framework: NestJS ecosystem
- IA: OpenAI ecosystem

---

**Nota:** El proyecto utiliza tecnologías modernas y bien mantenidas, con un enfoque en TypeScript, NestJS y OpenAI.

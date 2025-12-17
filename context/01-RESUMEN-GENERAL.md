# Resumen General del Proyecto - Nest Job Hub

## 📋 Descripción del Proyecto

**Nest Job Hub** es una aplicación backend desarrollada con NestJS que integra capacidades de Inteligencia Artificial utilizando OpenAI para asistir en procesos relacionados con desarrollo de software y optimización de currículums vitae. El proyecto combina GPT con agentes especializados para ofrecer soluciones inteligentes automatizadas.

## 🎯 Objetivo Principal

Proveer una plataforma API RESTful que facilite:

- Optimización de CVs con IA
- Asistencia técnica en desarrollo de software
- Interacción inteligente con agentes conversacionales
- Búsqueda web integrada para respuestas contextualmente enriquecidas

## 🏗️ Arquitectura General

```
nest-job-hub/
├── src/
│   ├── app.module.ts          # Módulo raíz de la aplicación
│   ├── main.ts                # Punto de entrada de la aplicación
│   ├── gpt/                   # Módulo de funcionalidades GPT
│   ├── sam-agent/             # Módulo de agentes inteligentes
│   └── helpers/               # Utilidades y funciones auxiliares
├── generated/                 # Archivos generados (uploads, etc.)
└── context/                   # Documentación del proyecto
```

## 🔑 Características Principales

### 1. **Módulo GPT** (`/gpt`)

- ✅ Prompts básicos con GPT
- ✅ Optimización de CVs con IA
- 🔄 Múltiples casos de uso implementados (14 en total)
- 📤 Validación de entradas con DTOs

### 2. **Módulo SAM Agent** (`/sam-agent`)

- 🤖 Agente desarrollador conversacional
- 🌐 Integración con búsqueda web (Google Custom Search)
- 💬 Historial de conversación persistente
- 🛠️ Sistema de herramientas extensibles

## 💻 Stack Tecnológico

### Framework y Lenguaje

- **NestJS** v11.x - Framework backend progresivo para Node.js
- **TypeScript** v5.7.3 - Tipado estático y características modernas de JS

### Inteligencia Artificial

- **OpenAI SDK** v5.10.2 - Integración con GPT-4, GPT-4o-mini
- **@openai/agents** v0.0.16 - Sistema de agentes con herramientas

### Validación y Transformación

- **class-validator** v0.14.2 - Validación de DTOs
- **class-transformer** v0.5.1 - Transformación de objetos

### Procesamiento de Archivos

- **Multer** v2.0.2 - Manejo de uploads
- **Sharp** v0.34.3 - Procesamiento de imágenes

### Testing

- **Jest** v29.7.0 - Framework de testing
- **Supertest** v7.0.0 - Testing de APIs HTTP

### Herramientas de Desarrollo

- **ESLint** v9.18.0 - Linting de código
- **Prettier** v3.4.2 - Formateo de código
- **SWC** v1.10.7 - Compilador rápido de TypeScript

## 🌐 APIs Externas Integradas

1. **OpenAI API**
   - GPT-4.1-nano
   - GPT-4o-mini
   - Modelos de chat y responses

2. **Google Custom Search API**
   - Búsqueda web contextual
   - Integración en agentes

## 📊 Métricas del Proyecto

- **Módulos:** 2 principales (GPT, SAM Agent)
- **Controladores:** 2
- **Servicios:** 3 (2 principales + 1 de búsqueda)
- **Casos de Uso:** 16+
- **DTOs:** 10+
- **Herramientas de Agente:** 1 (extensible)

## 🔐 Configuración de Seguridad

- ✅ Validación global de DTOs con whitelist
- ✅ Límites de tamaño de payload (10MB)
- ✅ CORS habilitado
- ✅ Variables de entorno para credenciales
- ✅ Validación de longitud de inputs

## 🚀 Estado del Proyecto

**Estado:** En desarrollo activo  
**Versión:** 0.0.1  
**Licencia:** UNLICENSED (Privado)

## 📝 Notas Importantes

1. El proyecto requiere configuración de variables de entorno:
   - `OPENAI_API_KEY`
   - `GOOGLE_API_KEY`
   - `GOOGLE_SEARCH_ENGINE_ID`
   - `PORT` (opcional, default: 3000)

2. El proyecto tiene capacidades extendidas en el módulo GPT que no están completamente expuestas en los controladores actuales

3. Sistema de historial de conversación con límite de 10 mensajes por conversación

---

**Última actualización:** Diciembre 2025

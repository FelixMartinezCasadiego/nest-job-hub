# Arquitectura Técnica del Proyecto

## 🏛️ Patrón Arquitectónico

El proyecto sigue una **arquitectura modular de NestJS** basada en el patrón MVC (Model-View-Controller) adaptado para APIs:

```
┌─────────────────────────────────────────┐
│          Cliente HTTP/REST              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         main.ts (Bootstrap)             │
│  - ValidationPipe Global                │
│  - CORS                                 │
│  - Body Parser (10MB limit)             │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│           AppModule (Root)              │
│  - ConfigModule                         │
│  - GptModule                            │
│  - SamAgentModule                       │
└────────────────┬────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
┌────────▼─────┐  ┌──────▼──────────┐
│  GptModule   │  │ SamAgentModule  │
└────────┬─────┘  └──────┬──────────┘
         │                │
         │                │
    Controller       Controller
         │                │
         │                │
     Service          Service
         │                │
         │                │
    Use Cases        Use Cases
         │                │
         │                │
    OpenAI API      Agents + Tools
```

## 📦 Estructura de Módulos

### 1. **GptModule**

Responsable de operaciones directas con la API de OpenAI

```typescript
GptModule
├── GptController      // Maneja endpoints HTTP
├── GptService         // Lógica de negocio
├── DTOs/              // Validación de entrada
│   ├── BasicPromptDto
│   ├── ImproveResumeDto
│   └── ... (10+ DTOs)
└── Use Cases/         // Lógica específica de casos de uso
    ├── basicPromptUseCase
    ├── improveResumeUseCase
    └── ... (14+ casos)
```

**Responsabilidades:**

- Comunicación directa con OpenAI SDK
- Validación de longitud de contenido
- Manejo de errores de API
- Formateo de respuestas

### 2. **SamAgentModule**

Sistema de agentes conversacionales con herramientas

```typescript
SamAgentModule
├── SamAgentController    // Endpoints de agentes
├── SamAgentService       // Orquestación de agentes
├── DTOs/
│   └── DeveloperDto      // Validación de mensajes
├── Use Cases/
│   └── developerUseCase  // Lógica de agente desarrollador
├── Tools/
│   └── webSearchToolGoogle  // Herramienta de búsqueda
└── Services/
    └── GoogleSearchService  // Integración con Google API
```

**Responsabilidades:**

- Gestión de conversaciones con historial
- Integración con @openai/agents
- Orquestación de herramientas
- Búsqueda web contextual

## 🔄 Flujo de Datos

### Ejemplo: Mejorar CV

```
Cliente
  │
  │ POST /gpt/improve-resume
  │ Body: { cv, form, goal }
  │
  ▼
GptController.improveResume()
  │
  │ 1. Valida ImproveResumeDto
  │ 2. Extrae parámetros
  │
  ▼
GptService.improveResume(cv, form, goal)
  │
  │ 3. Valida longitudes
  │ 4. Maneja errores
  │
  ▼
improveResumeUseCase(openai, options)
  │
  │ 5. Construye prompts
  │ 6. Llama a OpenAI API
  │ 7. Procesa respuesta
  │
  ▼
OpenAI API (gpt-4o-mini)
  │
  │ 8. Genera CV optimizado
  │
  ▼
Respuesta al Cliente
{
  success: true,
  improvedCV: "...",
  metadata: {
    tokensUsed: 1234,
    model: "gpt-4o-mini"
  }
}
```

### Ejemplo: Agente Desarrollador

```
Cliente
  │
  │ POST /sam-agent/developer-agent
  │ Body: { prompt, conversationId, model?, tools? }
  │
  ▼
SamAgentController.developerAgent()
  │
  │ 1. Valida DeveloperDto
  │
  ▼
SamAgentService.developerAgent(dto)
  │
  ▼
developerUseCase(options)
  │
  │ 2. Recupera historial de conversación
  │ 3. Crea Agent con instrucciones
  │ 4. Agrega herramientas (webSearch)
  │
  ▼
@openai/agents.run(agent, promptWithHistory)
  │
  │ 5. Procesa conversación
  │ 6. Decide usar herramientas
  │     │
  │     ▼
  │   webSearchToolGoogle.execute()
  │     │
  │     ▼
  │   GoogleSearchService.search()
  │     │
  │     ▼
  │   Google Custom Search API
  │
  │ 7. Genera respuesta
  │
  ▼
developerUseCase
  │
  │ 8. Actualiza historial
  │ 9. Limita a MAX_HISTORY_SIZE (10)
  │
  ▼
Respuesta al Cliente
{
  output: "...",
  conversationId: "...",
  messageCount: 4,
  timestamp: "..."
}
```

## 🎨 Patrones de Diseño Utilizados

### 1. **Dependency Injection (DI)**

NestJS gestiona automáticamente las dependencias:

```typescript
@Injectable()
export class GptService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
}
```

### 2. **Data Transfer Objects (DTO)**

Validación y tipado de entradas:

```typescript
export class ImproveResumeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(15000)
  cv: string;

  @IsString()
  @IsOptional()
  @MaxLength(10000)
  form?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  goal: string;
}
```

### 3. **Use Case Pattern**

Separación de lógica de negocio:

```typescript
// Use case puro, independiente del framework
export const basicPromptUseCase = async (openai: OpenAI, options: Options) => {
  // Lógica específica del caso de uso
};
```

### 4. **Tool Pattern (Agentes)**

Herramientas modulares y extensibles:

```typescript
export const webSearchToolGoogle = tool({
  name: 'web_search',
  description: 'Search for information on the web',
  parameters: z.object({ query: z.string() }),
  execute: async (input) => {
    // Lógica de la herramienta
  },
});
```

### 5. **Singleton (Conversación)**

Historial de conversación compartido:

```typescript
const conversationHistory = new Map<string, Message[]>();
```

## 🔧 Configuración y Bootstrap

### main.ts - Punto de Entrada

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS
  app.enableCors();

  // Body parser con límite
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  await app.listen(process.env.PORT ?? 3000);
}
```

### Configuración de Módulos

```typescript
@Module({
  imports: [
    ConfigModule.forRoot(), // Variables de entorno
    GptModule,
    SamAgentModule,
  ],
})
export class AppModule {}
```

## 📊 Capas de la Aplicación

| Capa           | Responsabilidad                        | Ejemplos                                   |
| -------------- | -------------------------------------- | ------------------------------------------ |
| **Controller** | Manejo de HTTP requests/responses      | `GptController`, `SamAgentController`      |
| **Service**    | Lógica de negocio, orquestación        | `GptService`, `SamAgentService`            |
| **Use Case**   | Lógica específica de casos de uso      | `improveResumeUseCase`, `developerUseCase` |
| **DTO**        | Validación y tipado de datos           | `ImproveResumeDto`, `DeveloperDto`         |
| **Tool**       | Funcionalidades extensibles de agentes | `webSearchToolGoogle`                      |
| **Helper**     | Utilidades compartidas                 | `download-image-as-png`                    |

## 🔒 Seguridad y Validación

### Validación en Múltiples Niveles

1. **Nivel de DTO (class-validator)**

```typescript
@MaxLength(15000)
cv: string;
```

2. **Nivel de Servicio**

```typescript
if (!cv || cv.trim().length === 0) {
  throw new BadRequestException('CV cannot be empty');
}
```

3. **Nivel de Use Case**

```typescript
if (!cv?.trim() || !goal?.trim()) {
  throw new Error('El CV y el objetivo son obligatorios');
}
```

### Manejo de Errores

```typescript
try {
  // Lógica
} catch (error) {
  if (error instanceof BadRequestException) {
    throw error;
  }
  if (error instanceof OpenAI.APIError) {
    throw new InternalServerErrorException(
      `OpenAI error (${error.status}): ${error.message}`,
    );
  }
  throw new InternalServerErrorException('Generic error message');
}
```

## 🌐 Integraciones Externas

### OpenAI API

- **SDK:** `openai` v5.10.2
- **Modelos:** GPT-4.1-nano, GPT-4o-mini
- **Métodos:** `chat.completions`, `responses.create`

### Google Custom Search API

- **Endpoint:** `https://www.googleapis.com/customsearch/v1`
- **Parámetros:** `key`, `cx`, `q`
- **Límite de resultados:** 3 por búsqueda

---

**Nota:** Esta arquitectura permite escalabilidad horizontal y facilita el testing mediante inyección de dependencias.

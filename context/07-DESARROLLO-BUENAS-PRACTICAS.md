# Guía de Desarrollo y Buenas Prácticas

## 🏗️ Estructura de Código

### Convenciones de Nomenclatura

#### Archivos

```
kebab-case.ts           // Archivos TypeScript
PascalCase.dto.ts       // Excepción para DTOs (algunos proyectos)
kebab-case.use-case.ts  // Use cases
kebab-case.service.ts   // Services
kebab-case.controller.ts // Controllers
kebab-case.module.ts    // Modules
```

#### Clases e Interfaces

```typescript
// PascalCase para clases
export class GptService {}
export class ImproveResumeDto {}

// PascalCase para interfaces
interface Options {}
interface Message {}
```

#### Funciones y Variables

```typescript
// camelCase para funciones y variables
const basicPromptUseCase = async () => {};
const improveResumeUseCase = async () => {};
const conversationHistory = new Map();
```

#### Constantes

```typescript
// SCREAMING_SNAKE_CASE para constantes
const MAX_HISTORY_SIZE = 10;
const MAX_CV_LENGTH = 15000;
const MAX_FORM_LENGTH = 10000;
```

---

## 📁 Organización de Módulos

### Estructura Estándar de un Módulo

```
mi-modulo/
├── mi-modulo.module.ts       // Definición del módulo
├── mi-modulo.controller.ts   // Endpoints HTTP
├── mi-modulo.service.ts      // Lógica de negocio
├── mi-modulo.controller.spec.ts  // Tests del controller
├── mi-modulo.service.spec.ts     // Tests del service
├── dtos/                     // Data Transfer Objects
│   ├── index.ts
│   ├── create-item.dto.ts
│   └── update-item.dto.ts
├── use-cases/                // Casos de uso
│   ├── index.ts
│   ├── create-item.use-case.ts
│   └── update-item.use-case.ts
├── services/                 // Servicios auxiliares
│   ├── index.ts
│   └── helper.service.ts
└── validators/               // Validadores custom
    ├── index.ts
    └── custom.validator.ts
```

---

## 🎯 Patrones de Diseño Recomendados

### 1. Separation of Concerns

**Responsabilidades claras por capa:**

```typescript
// ❌ MAL: Todo en el controller
@Post()
async create(@Body() dto: CreateDto) {
  // Validación
  if (!dto.name) throw new Error('Name required');

  // Llamada a API
  const result = await openai.chat.completions.create({...});

  // Procesamiento
  const processed = result.choices[0].message.content.trim();

  return { data: processed };
}

// ✅ BIEN: Separación por capas
@Post()
async create(@Body() dto: CreateDto) {
  return await this.service.create(dto);
}

// Service
async create(dto: CreateDto) {
  this.validateInput(dto);
  return await createItemUseCase(this.openai, dto);
}

// Use Case
export const createItemUseCase = async (openai: OpenAI, options: Options) => {
  const result = await openai.chat.completions.create({...});
  return processResult(result);
};
```

---

### 2. Dependency Injection

```typescript
// ✅ BIEN: Usar DI de NestJS
@Injectable()
export class GptService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
}

// ❌ MAL: Crear instancias directamente en use cases
export const badUseCase = async () => {
  const openai = new OpenAI({ apiKey: '...' }); // No hacer esto
};
```

---

### 3. Error Handling

```typescript
// ✅ BIEN: Manejo estructurado de errores
async improveResume(cv: string, goal: string) {
  try {
    // Validación de negocio
    if (!cv || cv.trim().length === 0) {
      throw new BadRequestException('CV cannot be empty');
    }

    // Llamada a use case
    const result = await improveResumeUseCase(this.openai, { cv, goal });

    return {
      success: true,
      data: result
    };

  } catch (error) {
    console.error('Error in improveResume:', error);

    // Errores esperados
    if (error instanceof BadRequestException) {
      throw error;
    }

    // Errores de API externa
    if (error instanceof OpenAI.APIError) {
      throw new InternalServerErrorException(
        `OpenAI error (${error.status}): ${error.message}`
      );
    }

    // Errores inesperados
    throw new InternalServerErrorException(
      'Error improving the CV. Please try again.'
    );
  }
}
```

---

### 4. Validación con DTOs

```typescript
// ✅ BIEN: Validación declarativa
export class ImproveResumeDto {
  @IsString({ message: 'The CV must be a valid text' })
  @IsNotEmpty({ message: 'The CV is required' })
  @MaxLength(15000, { message: 'The CV cannot exceed 15000 characters' })
  cv: string;

  @IsString({ message: 'The goal must be a valid text' })
  @IsNotEmpty({ message: 'The professional goal is required' })
  @MaxLength(500, { message: 'The goal cannot exceed 500 characters' })
  goal: string;

  @IsString()
  @IsOptional()
  @MaxLength(10000)
  form?: string;
}

// Configuración global en main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Elimina propiedades no definidas
    forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
    transform: true, // Transforma a instancias de clase
  }),
);
```

---

### 5. Use Cases Puros

```typescript
// ✅ BIEN: Use case puro, sin dependencias de framework
interface Options {
  prompt: string;
}

export const basicPromptUseCase = async (
  openai: OpenAI,
  options: Options,
): Promise<string> => {
  const completions = await openai.chat.completions.create({
    messages: [{ role: 'user', content: options.prompt }],
    model: 'gpt-4.1-nano',
    max_tokens: 150,
  });

  return completions.choices[0].message.content;
};

// ❌ MAL: Use case con dependencias de NestJS
import { Injectable } from '@nestjs/common';

@Injectable() // No hacer esto en use cases
export class BadUseCase {
  async execute(options: Options) {
    // ...
  }
}
```

---

## 🧪 Testing

### Test de Controllers

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';

describe('GptController', () => {
  let controller: GptController;
  let service: GptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GptController],
      providers: [
        {
          provide: GptService,
          useValue: {
            basicPrompt: jest.fn(),
            improveResume: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GptController>(GptController);
    service = module.get<GptService>(GptService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('basicPrompt', () => {
    it('should call service with correct params', async () => {
      const dto = { prompt: 'test' };
      const expectedResult = 'response';

      jest.spyOn(service, 'basicPrompt').mockResolvedValue(expectedResult);

      const result = await controller.basicPrompt(dto);

      expect(service.basicPrompt).toHaveBeenCalledWith(dto.prompt);
      expect(result).toBe(expectedResult);
    });
  });
});
```

---

### Test de Services

```typescript
describe('GptService', () => {
  let service: GptService;
  let openai: OpenAI;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-key';
    service = new GptService();
  });

  describe('basicPrompt', () => {
    it('should throw BadRequestException for empty prompt', async () => {
      await expect(service.basicPrompt('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return response from OpenAI', async () => {
      // Mock OpenAI API
      const mockResponse = 'mocked response';
      // ... implementar mock

      const result = await service.basicPrompt('test prompt');
      expect(result).toBe(mockResponse);
    });
  });
});
```

---

### Test de Use Cases

```typescript
import { basicPromptUseCase } from './basic-prompt.use-case';
import OpenAI from 'openai';

describe('basicPromptUseCase', () => {
  let mockOpenAI: jest.Mocked<OpenAI>;

  beforeEach(() => {
    mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    } as any;
  });

  it('should call OpenAI with correct parameters', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'response' } }],
    };

    mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse as any);

    const result = await basicPromptUseCase(mockOpenAI, {
      prompt: 'test',
    });

    expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
      messages: [{ role: 'user', content: 'test' }],
      model: 'gpt-4.1-nano',
      max_tokens: 150,
    });

    expect(result).toBe('response');
  });
});
```

---

## 🔒 Seguridad

### 1. Nunca Exponer Secrets

```typescript
// ❌ MAL
const apiKey = 'sk-proj-xxxxx'; // Nunca hardcodear

// ✅ BIEN
const apiKey = process.env.OPENAI_API_KEY;

// ✅ MEJOR: Con validación
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not set');
}
```

---

### 2. Validar Límites

```typescript
// ✅ BIEN: Validación de longitud
const MAX_CV_LENGTH = 15000;

if (cv.length > MAX_CV_LENGTH) {
  throw new BadRequestException(
    `CV exceeds the limit of ${MAX_CV_LENGTH} characters`,
  );
}
```

---

### 3. Sanitización de Inputs

```typescript
// ✅ BIEN: Usar whitelist en ValidationPipe
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Elimina propiedades extra
    forbidNonWhitelisted: true, // Lanza error si hay extras
  }),
);
```

---

## 🚀 Performance

### 1. Caché de Conversaciones

```typescript
// ✅ Actual: Map en memoria
const conversationHistory = new Map<string, Message[]>();

// 🎯 Mejora futura: Redis para persistencia
import { Redis } from 'ioredis';
const redis = new Redis();

async function getHistory(id: string): Promise<Message[]> {
  const cached = await redis.get(`conv:${id}`);
  return cached ? JSON.parse(cached) : [];
}
```

---

### 2. Streaming Responses

```typescript
// 🎯 Para respuestas largas
export const streamingUseCase = async (openai: OpenAI, options: Options) => {
  const stream = await openai.chat.completions.create({
    messages: [{ role: 'user', content: options.prompt }],
    model: 'gpt-4o-mini',
    stream: true,
  });

  return stream;
};
```

---

## 📝 Documentación de Código

### JSDoc para Funciones Complejas

````typescript
/**
 * Mejora un CV usando IA considerando un objetivo profesional
 *
 * @param cv - Curriculum vitae completo (máx 15000 caracteres)
 * @param form - Información adicional opcional (máx 10000 caracteres)
 * @param goal - Objetivo profesional (máx 500 caracteres)
 * @returns Objeto con CV mejorado y metadata
 * @throws {BadRequestException} Si la validación falla
 * @throws {InternalServerErrorException} Si hay error de OpenAI
 *
 * @example
 * ```typescript
 * const result = await service.improveResume(
 *   'Juan Pérez\nDesarrollador...',
 *   'Conocimientos en Docker',
 *   'Senior Developer en startup'
 * );
 * console.log(result.improvedCV);
 * ```
 */
async improveResume(cv: string, form: string, goal: string) {
  // Implementación
}
````

---

## 🔄 Extensibilidad

### Agregar Nuevo Endpoint

**1. Crear DTO:**

```typescript
// src/gpt/dtos/new-feature.dto.ts
export class NewFeatureDto {
  @IsString()
  @IsNotEmpty()
  input: string;
}

// src/gpt/dtos/index.ts
export * from './new-feature.dto';
```

**2. Crear Use Case:**

```typescript
// src/gpt/use-cases/new-feature.use-case.ts
interface Options {
  input: string;
}

export const newFeatureUseCase = async (openai: OpenAI, options: Options) => {
  // Implementación
};

// src/gpt/use-cases/index.ts
export * from './new-feature.use-case';
```

**3. Agregar a Service:**

```typescript
// src/gpt/gpt.service.ts
import { newFeatureUseCase } from './use-cases';

async newFeature(input: string) {
  return await newFeatureUseCase(this.openai, { input });
}
```

**4. Agregar a Controller:**

```typescript
// src/gpt/gpt.controller.ts
import { NewFeatureDto } from './dtos';

@Post('new-feature')
async newFeature(@Body() dto: NewFeatureDto) {
  return await this.gptService.newFeature(dto.input);
}
```

---

### Agregar Nueva Herramienta a Agente

```typescript
// src/sam-agent/tools/new-tool.tool.ts
import { tool } from '@openai/agents';
import { z } from 'zod';

export const newTool = tool({
  name: 'new_tool',
  description: 'Descripción de la herramienta',
  parameters: z.object({
    param: z.string(),
  }),
  execute: async (input) => {
    // Lógica de la herramienta
    return 'resultado';
  },
});

// src/sam-agent/use-cases/developer.use-case.ts
import { newTool } from '../tools';

const agent = new Agent({
  // ...
  tools: [webSearchToolGoogle, newTool],
});
```

---

## 🎨 Estilo de Código

### ESLint y Prettier

**Formatear código:**

```bash
npm run format
```

**Lint y fix:**

```bash
npm run lint
```

**Configuración recomendada VSCode:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 📊 Monitoring y Debugging

### Logs Estructurados

```typescript
// ✅ BIEN: Logs informativos
console.log('Buscando información en internet para:', query);
console.log('results:', results);
console.error('Error in web search:', error);

// 🎯 Mejor: Logger de NestJS
import { Logger } from '@nestjs/common';

@Injectable()
export class GptService {
  private readonly logger = new Logger(GptService.name);

  async improveResume() {
    this.logger.log('Improving resume...');
    // ...
    this.logger.error('Error improving resume', error.stack);
  }
}
```

---

## 📚 Recursos Adicionales

- [NestJS Documentation](https://docs.nestjs.com)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Class Validator](https://github.com/typestack/class-validator)

---

**Nota:** Estas prácticas evolucionan con el proyecto. Mantén la consistencia y documenta cambios importantes.

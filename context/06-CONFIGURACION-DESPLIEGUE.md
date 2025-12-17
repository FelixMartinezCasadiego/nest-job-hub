# Guía de Configuración y Despliegue

## 🔧 Configuración Inicial

### 1. Requisitos Previos

**Software necesario:**

- Node.js >= 18.x (recomendado: v22.x LTS)
- npm >= 9.x o yarn >= 1.22.x
- Git

**Verificar instalación:**

```bash
node --version  # v22.x.x
npm --version   # 10.x.x
git --version   # 2.x.x
```

---

### 2. Clonar el Repositorio

```bash
git clone <repository-url>
cd nest-job-hub
```

---

### 3. Instalar Dependencias

```bash
npm install
```

**Dependencias instaladas:**

- 13 dependencias de producción
- 25 dependencias de desarrollo
- Total: ~400MB en `node_modules`

---

### 4. Configuración de Variables de Entorno

#### Crear archivo `.env`

```bash
cp .env.template .env  # Si existe el template
# O crear manualmente
touch .env
```

#### Variables Requeridas

**`.env`:**

```bash
# OpenAI Configuration (REQUERIDO)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Custom Search (REQUERIDO para Developer Agent)
GOOGLE_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_SEARCH_ENGINE_ID=xxxxxxxxxxxxxxxxxxxx

# Server Configuration (OPCIONAL)
PORT=3000

# Node Environment
NODE_ENV=development
```

---

### 5. Obtener Credenciales

#### OpenAI API Key

1. Ir a [platform.openai.com](https://platform.openai.com)
2. Crear cuenta o iniciar sesión
3. Navegar a **API Keys**
4. Crear nueva API key
5. Copiar y guardar en `.env`

**Formato:**

```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Costos estimados:**

- Basic Prompt: ~$0.0001 por request
- Improve Resume: ~$0.002 por request
- Developer Agent: ~$0.001 por request

---

#### Google Custom Search API

**Paso 1: Habilitar Custom Search API**

1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Crear proyecto o seleccionar uno existente
3. Navegar a **APIs & Services** > **Library**
4. Buscar "Custom Search API"
5. Hacer clic en **Enable**

**Paso 2: Obtener API Key**

1. Ir a **APIs & Services** > **Credentials**
2. Clic en **Create Credentials** > **API Key**
3. Copiar la clave generada
4. Guardar en `.env` como `GOOGLE_API_KEY`

**Paso 3: Crear Search Engine**

1. Ir a [programmablesearchengine.google.com](https://programmablesearchengine.google.com)
2. Clic en **Add**
3. Configurar:
   - Search engine name: "Job Hub Search"
   - What to search: "Search the entire web"
4. Hacer clic en **Create**
5. Copiar el **Search engine ID**
6. Guardar en `.env` como `GOOGLE_SEARCH_ENGINE_ID`

**Cuota gratuita:**

- 100 búsquedas/día
- Para más, considerar plan de pago

---

## 🚀 Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run start:dev
```

**Características:**

- Hot reload activado
- Detecta cambios automáticamente
- Logs detallados en consola
- Puerto por defecto: 3000

**Salida esperada:**

```
[Nest] 12345  - 12/17/2025, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 12/17/2025, 10:00:00 AM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 12/17/2025, 10:00:00 AM     LOG [InstanceLoader] ConfigModule dependencies initialized
[Nest] 12345  - 12/17/2025, 10:00:00 AM     LOG [InstanceLoader] GptModule dependencies initialized
[Nest] 12345  - 12/17/2025, 10:00:00 AM     LOG [InstanceLoader] SamAgentModule dependencies initialized
[Nest] 12345  - 12/17/2025, 10:00:01 AM     LOG [NestApplication] Nest application successfully started
```

---

### Modo Debug

```bash
npm run start:debug
```

**Características:**

- Igual que dev mode
- Puerto de debug: 9229
- Permite adjuntar debugger de VS Code

**VS Code Launch Configuration:**

```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to NestJS",
  "port": 9229,
  "restart": true,
  "stopOnEntry": false
}
```

---

### Modo Producción

#### 1. Build

```bash
npm run build
```

**Salida:**

- Carpeta `dist/` con código compilado
- Archivos `.js` generados
- Source maps incluidos

#### 2. Ejecutar

```bash
npm run start:prod
```

**Características:**

- Sin hot reload
- Optimizado para rendimiento
- Logs mínimos

---

## 📦 Despliegue

### Opción 1: Railway

**1. Instalar Railway CLI:**

```bash
npm i -g @railway/cli
```

**2. Login:**

```bash
railway login
```

**3. Inicializar proyecto:**

```bash
railway init
```

**4. Configurar variables:**

```bash
railway variables set OPENAI_API_KEY=sk-...
railway variables set GOOGLE_API_KEY=AIza...
railway variables set GOOGLE_SEARCH_ENGINE_ID=...
railway variables set NODE_ENV=production
```

**5. Deploy:**

```bash
railway up
```

**railway.json:**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

### Opción 2: Heroku

**1. Instalar Heroku CLI**

**2. Login:**

```bash
heroku login
```

**3. Crear app:**

```bash
heroku create nest-job-hub
```

**4. Configurar variables:**

```bash
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set GOOGLE_API_KEY=AIza...
heroku config:set GOOGLE_SEARCH_ENGINE_ID=...
heroku config:set NODE_ENV=production
```

**5. Crear Procfile:**

```
web: npm run start:prod
```

**6. Deploy:**

```bash
git push heroku main
```

---

### Opción 3: Docker

**Dockerfile:**

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - '3000:3000'
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
      - GOOGLE_SEARCH_ENGINE_ID=${GOOGLE_SEARCH_ENGINE_ID}
      - NODE_ENV=production
    restart: unless-stopped
```

**Construir y ejecutar:**

```bash
docker-compose up --build
```

---

### Opción 4: Vercel (Serverless)

**1. Instalar Vercel CLI:**

```bash
npm i -g vercel
```

**2. Crear vercel.json:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```

**3. Deploy:**

```bash
vercel --prod
```

**4. Configurar variables en dashboard de Vercel**

---

### Opción 5: VPS (DigitalOcean, AWS EC2, etc.)

**1. Conectar al servidor:**

```bash
ssh user@your-server-ip
```

**2. Instalar Node.js:**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**3. Clonar proyecto:**

```bash
git clone <repository-url>
cd nest-job-hub
```

**4. Instalar dependencias:**

```bash
npm ci --only=production
```

**5. Configurar variables:**

```bash
nano .env
# Pegar variables de entorno
```

**6. Build:**

```bash
npm run build
```

**7. Instalar PM2:**

```bash
npm install -g pm2
```

**8. Ejecutar con PM2:**

```bash
pm2 start dist/main.js --name nest-job-hub
pm2 save
pm2 startup
```

**9. Configurar Nginx como reverse proxy:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 Seguridad para Producción

### 1. Variables de Entorno

**No commitear `.env` al repositorio:**

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### 2. Rate Limiting

**Instalar:**

```bash
npm install @nestjs/throttler
```

**Configurar en AppModule:**

```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    // ... otros módulos
  ]
})
```

### 3. Helmet (Security Headers)

**Instalar:**

```bash
npm install helmet
```

**Configurar en main.ts:**

```typescript
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  // ... resto de configuración
}
```

### 4. CORS Específico

```typescript
app.enableCors({
  origin: ['https://tu-frontend.com'],
  methods: ['GET', 'POST'],
  credentials: true,
});
```

---

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage

```bash
npm run test:cov
```

**Reporte en:** `coverage/lcov-report/index.html`

### E2E Tests

```bash
npm run test:e2e
```

---

## 📊 Monitoring y Logs

### Desarrollo

Los logs se muestran directamente en consola.

### Producción con PM2

**Ver logs:**

```bash
pm2 logs nest-job-hub
```

**Monitorear:**

```bash
pm2 monit
```

**Dashboard web:**

```bash
pm2 plus
```

---

## 🔄 CI/CD

### GitHub Actions

**`.github/workflows/deploy.yml`:**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm i -g @railway/cli
          railway up
```

---

## 📝 Checklist de Despliegue

- [ ] Variables de entorno configuradas
- [ ] OpenAI API key válida
- [ ] Google Custom Search configurado
- [ ] Build exitoso (`npm run build`)
- [ ] Tests pasando (`npm test`)
- [ ] CORS configurado correctamente
- [ ] Rate limiting implementado
- [ ] Helmet instalado
- [ ] PM2 o similar para proceso
- [ ] Nginx/reverse proxy configurado
- [ ] SSL/HTTPS habilitado
- [ ] Logs y monitoring configurados
- [ ] Backups automáticos (si aplica)

---

## 🆘 Troubleshooting

### Error: "OPENAI_API_KEY is not set"

**Solución:** Verificar que el archivo `.env` existe y contiene la variable.

### Error: "Google API error: 403"

**Solución:** Verificar que la Custom Search API está habilitada y la API key es correcta.

### Puerto ya en uso

**Solución:**

```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9
```

### Module not found

**Solución:**

```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Nota:** Esta configuración asume un entorno de producción estándar. Ajusta según tus necesidades específicas.

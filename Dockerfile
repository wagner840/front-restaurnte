# Estágio 1: Build da aplicação Vite/React
FROM node:22-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e package-lock.json (ou yarn.lock, etc.)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos da aplicação para o contêiner
COPY . .

# Executa o script de build para gerar os arquivos estáticos, passando as variáveis de ambiente
RUN --mount=type=secret,id=dotenv,target=/app/.env \
    npm run build

# Estágio 2: Servidor de produção com Nginx
FROM nginx:stable-alpine

# Copia os arquivos estáticos da pasta 'dist' do estágio de build para o diretório padrão do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia um arquivo de configuração personalizado do Nginx para lidar com o roteamento do React
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 para acesso externo
EXPOSE 80

# Comando para iniciar o Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]
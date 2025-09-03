# Instruções para Configuração do Banco de Dados

Este documento descreve os passos para configurar e popular o banco de dados PostgreSQL usando Docker, Knex migrations e seeds.

---

## 1. Subir o banco com Docker

Certifique-se de ter o [Docker](https://www.docker.com/get-started) instalado.

No terminal, dentro da pasta do projeto, execute:

```bash
docker-compose up -d
```

Isso irá iniciar o container do PostgreSQL configurado no arquivo docker-compose.yml.

## 2. Executar migrations

As migrations criam as tabelas no banco de dados.

Execute o comando:

```bash
npx knex migrate:latest
```

Esse comando irá aplicar todas as migrations pendentes.

## 3. Rodar seeds

As seeds inserem dados iniciais nas tabelas.

Execute o comando:

```bash
npx knex seed:run
```

Isso vai popular as tabelas com os dados definidos nos arquivos de seeds.

## 4. Recriar tabelas (refazer migrations)

Caso precise desfazer todas as migrations e recriar as tabelas do zero, execute:

```bash
npx knex migrate:rollback
```

### Observações

- Certifique-se que as variáveis de ambiente POSTGRES_USER, POSTGRES_PASSWORD e POSTGRES_DB estejam definidas no seu ambiente ou em um arquivo .env na raiz do projeto.

- O banco estará disponível na porta 5432 do seu localhost.

Pronto! O banco está configurado e com dados iniciais para uso.

# Instruções de Segurança e Autenticação

Descrição de como utilizar os endpoints de autenticação e segurança da API.  

A autenticação é feita com **JWT (JSON Web Token)**, garantindo acesso seguro às rotas protegidas.
___

## 🔐Registro de Usuários:
Endpoint:
```bash
POST /auth/register
```

Exemplo de Body (JSON):

```bash

{
  "nome": "Bernardo Silva",
  "email": "bernardo.silva@email.com",
  "senha": "BebezuLind@1234_"
}
```
**Respostas possíveis:**
- **201 Created** → Usuário criado com sucesso.
- **400 Bad Request** → Email já está em uso ou senha não atende aos requisitos.
- **500 Internal Server Error** → Erro interno do servidor.

## 🔑Login de Usuários:
Endpoint:
```bash
POST /auth/login
```

Exemplo de Body (JSON):

```bash
{
  "email": "bernardo.silva@email.com",
  "senha": "BebezuLind@1234_"
}
```
Resposta (200 OK):

```bash
{
  "access_token": "token_jwt_gerado"
}
```
**Respostas possíveis:**
- **200 OK** → Retorna o token JWT válido.
- **400 Bad Request** → Email não encontrado ou senha incorreta
- **401 Unauthorized** → Credenciais inválidas.
- **500 Internal Server Error** → Erro interno do servidor.

## 🚪Logout de Usuários:
Endpoint:
```bash
POST /auth/logout
```

**Respostas possíveis:**
- **204 No Content** → Usuário criado com sucesso.
- **401 Unauthorized** → Token inválido ou ausente.

## 🔒Autenticação com JWT no Postman
Para acessar rotas protegidas, é necessário incluir o JWT no header da requisição, usando o formato:

Endpoint:
```bash
Authorization: Bearer <seu-token-jwt>
```

Exemplo no Postman:

1. Crie uma requisição para a rota protegida (exemplo: ```GET http://localhost:3000/casos```).
2. Vá até a aba **Authorization**.
3. Em **Auth Type**, escolha **Bearer Token**.
4. Cole o token JWT no campo **Token**.
5. Clique em **Send**.

```bash O Postman irá automaticamente enviar o header correto:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📌 Fluxo de Autenticação Esperado: ##

1. O usuário registra-se em ```/auth/register```.
2. O usuário faz login em ```/auth/login``` e recebe um JWT.
3. O usuário utiliza esse JWT na aba **Authorization → Bearer Token** do Postman (ou envia manualmente no header ```Authorization: Bearer <token>```).
4. O usuário pode realizar logout em ```/auth/logout```.
5. O token possui tempo de expiração. Após expirar, o usuário precisa fazer login novamente (ou usar refresh token).

## ⚙️Variáveis de Ambiente Importantes ##
No arquivo ```.env```, defina a chave secreta usada para assinar os tokens:
```bash
JWT_SECRET=segredo_aqui
```
⚠️ Nunca exponha essa chave no código-fonte.

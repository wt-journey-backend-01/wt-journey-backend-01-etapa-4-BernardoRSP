<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 7 créditos restantes para usar o sistema de feedback AI.

# Feedback para BernardoRSP:

Nota final: **34.5/100**

```markdown
# Olá, BernardoRSP! 👋🚀

Primeiramente, parabéns pelo esforço e dedicação até aqui! Você já tem uma base muito boa montada, com uma estrutura clara, uso correto do Knex, organização dos controllers, repositories e rotas, além da implementação dos principais endpoints para agentes, casos e autenticação. Isso é essencial para construir uma API robusta e escalável! 🎉

Além disso, você conseguiu passar vários testes importantes, incluindo a criação e login de usuários, proteção das rotas com JWT, logout, exclusão de usuários, e validações básicas de autenticação. Isso mostra que você compreendeu bem os conceitos fundamentais da segurança com JWT e hashing de senha. Mandou bem! 👏

---

## 🚦 Pontos Importantes que Precisam de Ajustes (Testes que Falharam)

Os testes que falharam são majoritariamente relacionados à **validação dos dados de cadastro do usuário** (usuário com nome vazio, email vazio, senha inválida, etc) e também alguns testes de filtragem e busca avançada (bônus). Vamos destrinchar os principais problemas para você entender o que está acontecendo e como corrigir:

---

### 1. Falhas nas Validações de Cadastro de Usuário (400 Bad Request)

**Testes que falharam:**

- USERS: Recebe erro 400 ao tentar criar um usuário com nome vazio
- USERS: Recebe erro 400 ao tentar criar um usuário com email vazio / nulo
- USERS: Recebe erro 400 ao tentar criar um usuário com senha curta, sem número, sem caractere especial, sem letra maiúscula, sem letras, senha nula
- USERS: Recebe erro 400 ao tentar criar um usuário com campo faltante

**Análise da causa raiz:**

No seu `authController.js`, na função `registrarUsuario`, não há nenhuma validação explícita para os campos `nome`, `email` e `senha` antes de tentar criar o usuário:

```js
async function registrarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (await usuariosRepository.encontrar(email)) {
      return res.status(400).json({ status: 400, mensagem: "Parâmetros inválidos", erros: { email: "O usuário já está cadastrado" } });
    }

    const hashed = await bcrypt.hash(senha, 10);

    const novoUsuario = { nome, email, senha: hashed };
    const [usuarioCriado] = await usuariosRepository.registrar(novoUsuario);
    return res.status(201).json(usuarioCriado);
  } catch (error) {
    console.log("Erro referente a: registrarUsuarios\n");
    console.log(error);
    res.status(500).json({ status: 500, mensagem: "Erro interno do servidor" });
  }
}
```

Você só verifica se o email já está cadastrado, mas não verifica se os campos são nulos, vazios ou se a senha atende ao regex que você definiu (`testeSenha`). Isso faz com que, quando um campo obrigatório está ausente ou inválido, o sistema aceite e tente criar o usuário, o que quebra os testes que esperam erro 400.

**Como corrigir?**

Você precisa adicionar validações explícitas antes de tentar criar o usuário, por exemplo:

```js
if (!nome || nome.trim() === "") {
  erros.nome = "O nome é obrigatório";
}
if (!email || email.trim() === "") {
  erros.email = "O email é obrigatório";
}
if (!senha) {
  erros.senha = "A senha é obrigatória";
} else if (!testeSenha.test(senha)) {
  erros.senha = "A senha deve ter no mínimo 8 caracteres, com pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial";
}

if (Object.keys(erros).length > 0) {
  return res.status(400).json({ status: 400, mensagem: "Parâmetros inválidos", erros });
}
```

Assim, você garante que o cadastro só prossegue se os dados forem válidos.

---

### 2. Erro de Digitação e Retorno Incorreto no `deletarUsuario`

No método `deletarUsuario` do `authController.js`, você tem:

```js
const usuarioDeletado = usuariosRepository.deletar(id);
if (!usuarioDeletado) {
  return res.status(404).json({ statu: 404, message: "Usuário não encontrado" });
}
```

Aqui há dois problemas:

- Você esqueceu o `await` na chamada `usuariosRepository.deletar(id)`, que é uma função `async`. Isso faz com que `usuarioDeletado` seja uma Promise, que sempre será truthy, e a checagem não funciona como esperado.
- Há um erro de digitação: `statu` (deveria ser `status`) e `message` (deveria ser `mensagem` para manter padrão).

**Correção sugerida:**

```js
const usuarioDeletado = await usuariosRepository.deletar(id);
if (!usuarioDeletado) {
  return res.status(404).json({ status: 404, mensagem: "Usuário não encontrado" });
}
```

---

### 3. Resposta do Login com Nome da Propriedade do Token Errada

No método `logarUsuario`, você gera o token JWT e retorna:

```js
return res.status(200).json({ access_token: token });
```

Porém, no enunciado do desafio, o token deve ser retornado na propriedade `acess_token` (sem o "c" duplo):

```json
{
  "acess_token": "token aqui"
}
```

Esse detalhe é importante para passar os testes que validam a resposta do login. Então, altere para:

```js
return res.status(200).json({ acess_token: token });
```

---

### 4. Mensagem de Erro com Campo Incorreto no Login

Ainda no `logarUsuario`, quando a senha é inválida, você retorna:

```js
if (!senhaValida) return res.status(401).json({ status: 401, mensage: "Senha e/ou E-mail inválidos" });
```

Note que há um erro de digitação em `mensage` (deveria ser `mensagem`). Isso pode causar falha nos testes que verificam a estrutura da resposta.

Corrija para:

```js
if (!senhaValida) return res.status(401).json({ status: 401, mensagem: "Senha e/ou E-mail inválidos" });
```

---

### 5. Middleware de Autenticação - Erro de Digitação no JSON de Erro

No seu `authMiddleware.js`, no catch:

```js
return res.status(401).json({ staus: 401, mensagem: "Token Inválido" });
```

Você escreveu `staus` ao invés de `status`. Isso pode causar problemas na interpretação da resposta pelo cliente ou testes.

Corrija para:

```js
return res.status(401).json({ status: 401, mensagem: "Token Inválido" });
```

---

### 6. Falta de Implementação do Logout

No `authController.js`, o método `deslogarUsuario` está vazio:

```js
async function deslogarUsuario(req, res) {
  try {
  } catch (erro) {}
}
```

Para passar os testes que verificam logout, você precisa implementar alguma lógica que invalide o token do usuário. Como o JWT é stateless, a maneira comum é implementar uma blacklist ou simplesmente responder com sucesso para o logout (se o token for gerenciado no cliente).

Se preferir, pode responder com status 204 sem corpo, por exemplo:

```js
async function deslogarUsuario(req, res) {
  try {
    // Como JWT é stateless, apenas responder sucesso
    return res.status(204).send();
  } catch (error) {
    console.log("Erro referente a: deslogarUsuario\n", error);
    return res.status(500).json({ status: 500, mensagem: "Erro interno do servidor" });
  }
}
```

---

### 7. Falta de Validação da Senha no Registro

Você definiu o regex `testeSenha` no `authController.js`, mas não o utilizou para validar a senha antes do hash. Isso faz com que senhas inválidas (curtas, sem caracteres especiais, etc) sejam aceitas.

É fundamental validar a senha para garantir a segurança e passar os testes.

---

### 8. Estrutura do Projeto e Documentação

Sua estrutura de pastas está correta e bem organizada, parabéns! Isso ajuda muito na manutenção e escalabilidade do código.

O arquivo `INSTRUCTIONS.md` está bem detalhado para configuração do banco, mas está faltando a documentação da autenticação, como o envio do token JWT no header `Authorization`, exemplos de registro e login, e o fluxo de autenticação esperado, conforme pedido no desafio.

Recomendo que você adicione essa documentação para deixar o projeto mais completo e facilitar o uso da API por outros desenvolvedores.

---

### 9. Bônus: Endpoints de Filtragem e `/usuarios/me`

Os testes bônus relacionados a filtragens e ao endpoint `/usuarios/me` falharam. Isso indica que esses recursos ainda não foram implementados.

Se quiser melhorar sua nota, recomendo implementar esses filtros para casos e agentes, e criar o endpoint para retornar dados do usuário autenticado, usando o `req.user` do middleware de autenticação.

---

## 🎯 Recomendações e Recursos para Você Aprimorar Seu Projeto

- Para entender melhor como fazer validações robustas no cadastro, recomendo fortemente revisar o vídeo **[Authenticação - Conceitos Básicos](https://www.youtube.com/watch?v=Q4LQOfYwujk)** — *esse vídeo, feito pelos meus criadores, fala muito bem sobre como validar dados de usuários e proteger sua API*.

- Para corrigir o uso de JWT, geração e verificação de tokens, dê uma olhada neste vídeo prático: **[JWT na prática](https://www.youtube.com/watch?v=keS0JWOypIU)**.

- Como você usa bcrypt para hash de senha, vale a pena assistir esse conteúdo para entender o uso correto: **[bcrypt e JWT juntos](https://www.youtube.com/watch?v=L04Ln97AwoY)**.

- Se quiser se aprofundar em organização de projetos Node.js com arquitetura MVC (Model-View-Controller), que você já está no caminho certo, recomendo este vídeo: **[Arquitetura MVC em Node.js](https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s)**.

---

## 📝 Resumo dos Principais Pontos para Melhorar

- **Adicionar validações completas para os campos `nome`, `email` e `senha` no registro de usuário**, incluindo regex para senha forte.

- **Corrigir erros de digitação em chaves JSON** (`status`, `mensagem`, `acess_token`).

- **Adicionar `await` nas chamadas async**, especialmente no método de deletar usuário.

- **Implementar a função de logout** para responder adequadamente.

- **Corrigir o nome da propriedade do token JWT no login para `acess_token` conforme esperado**.

- **Documentar no INSTRUCTIONS.md o fluxo de autenticação e exemplos de uso do token JWT no header Authorization**.

- **Considerar implementar os bônus para melhorar sua nota**, como filtros nos endpoints e o `/usuarios/me`.

---

## 💪 Finalizando

Bernardo, você já tem uma base sólida e está no caminho certo para entregar uma API segura e funcional! Com esses ajustes nas validações e pequenos detalhes que comentei, sua aplicação vai ficar muito mais robusta e pronta para produção.

Continue firme, pois cada correção que você fizer vai destravar seu aprendizado e abrir portas para projetos ainda mais complexos. Estou aqui torcendo pelo seu sucesso! 🚀✨

---

Se precisar de ajuda para entender qualquer ponto, me chama! Vamos juntos nessa jornada! 😉

Um abraço e bons códigos! 👨‍💻👩‍💻
```

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>
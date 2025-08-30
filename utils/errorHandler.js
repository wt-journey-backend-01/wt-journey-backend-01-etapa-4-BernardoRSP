class APIError extends Error {
  constructor(status, message, errors) {
    super(status, message, errors);

    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}

class InvalidIdError extends APIError {
  constructor(errors) {
    super(404, "ID inválido", errors);
  }
}

class IdNotFoundError extends APIError {
  constructor(errors) {
    super(404, "ID inexistente", errors);
  }
}

class InvalidFormatError extends APIError {
  constructor(errors) {
    super(400, "Parâmetros inválidos", errors);
  }
}

class InvalidQueryError extends APIError {
  constructor(errors) {
    super(400, "Query inválida", errors);
  }
}

class NotFoundRouteError extends APIError {
  constructor(errors) {
    super(404, "Endpoint inexistente", errors);
  }
}

class EmailExistsError extends APIError {
  constructor(errors) {
    super(400, "Email existente", errors);
  }
}

class UserNotFoundError extends APIError {
  constructor(errors) {
    super(401, "Usuário não encontrado", errors);
  }
}

class InvalidPasswordError extends APIError {
  constructor(errors) {
    super(401, "Senha inválida", errors);
  }
}

class TokenError extends APIError {
  constructor(errors) {
    super(401, "Token inválido", errors);
  }
}

function errorHandler(err, req, res, next) {
  const { status, message, errors } = err;
  res.status(status || 500).send({ status, message, errors });
}

module.exports = {
  errorHandler,
  TokenError,
  InvalidPasswordError,
  UserNotFoundError,
  EmailExistsError,
  NotFoundRouteError,
  InvalidQueryError,
  InvalidFormatError,
  IdNotFoundError,
  InvalidIdError,
};

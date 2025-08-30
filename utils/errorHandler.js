class ApiError extends Error {
  constructor(message, status, errors) {
    super(message, status, errors);

    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}

class InvalidIdError extends ApiError {
  constructor(errors) {
    super("ID inválido", 404, errors);
  }
}

class IdNotFoundError extends ApiError {
  constructor(errors) {
    super("ID inexistente", 404, errors);
  }
}

class InvalidFormatError extends ApiError {
  constructor(errors) {
    super("Parâmetros inválidos", 400, errors);
  }
}

class InvalidQueryError extends ApiError {
  constructor(errors) {
    super("Query inválida", 400, errors);
  }
}

class NotFoundRouteError extends ApiError {
  constructor(errors) {
    super("Endpoint inexistente", 404, errors);
  }
}

class EmailExistsError extends ApiError {
  constructor(errors) {
    super("Email existente", 400, errors);
  }
}

class UserNotFoundError extends ApiError {
  constructor(errors) {
    super("Usuário não encontrado", 401, errors);
  }
}

class InvalidPasswordError extends ApiError {
  constructor(errors) {
    super("Senha inválida", 401, errors);
  }
}

class TokenError extends ApiError {
  constructor(errors) {
    super("Token inválido", 401, errors);
  }
}

function errorHandler(err, req, res, next) {
  const { status, message, errors } = err;
  res.status(status || 500).send({ message, status, errors });
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

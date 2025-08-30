class ApiError extends Error {
  constructor(errors, status, message) {
    super(status, message, errors);

    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}

class InvalidIdError extends ApiError {
  constructor(errors) {
    super(404, "ID inválido", errors);
  }
}

class IdNotFoundError extends ApiError {
  constructor(errors) {
    super(404, "ID inexistente", errors);
  }
}

class InvalidFormatError extends ApiError {
  constructor(errors) {
    super(400, "Parâmetros inválidos", errors);
  }
}

class InvalidQueryError extends ApiError {
  constructor(errors) {
    super(400, "Query inválida", errors);
  }
}

class NotFoundRouteError extends ApiError {
  constructor(errors) {
    super(404, "Endpoint inexistente", errors);
  }
}

class EmailExistsError extends ApiError {
  constructor(errors) {
    super(400, "Email existente", errors);
  }
}

class UserNotFoundError extends ApiError {
  constructor(errors) {
    super(401, "Usuário não encontrado", errors);
  }
}

class InvalidPasswordError extends ApiError {
  constructor(errors) {
    super(401, "Senha inválida", errors);
  }
}

class TokenError extends ApiError {
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

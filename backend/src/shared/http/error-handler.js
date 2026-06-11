function notFoundHandler(_req, res) {
  res.status(404).json({ error: "Rota nao encontrada" });
}

function errorHandler(error, _req, res, _next) {
  const status = error.status || (error.name === "ZodError" ? 400 : 500);
  const details = error.name === "ZodError" ? error.errors : undefined;

  res.status(status).json({
    error: error.message || "Erro interno",
    ...(details ? { details } : {})
  });
}

module.exports = { notFoundHandler, errorHandler };

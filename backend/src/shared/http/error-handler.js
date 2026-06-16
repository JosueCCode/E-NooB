function notFoundHandler(_req, res) {
  res.status(404).json({ error: "Rota nao encontrada" });
}

function errorHandler(error, _req, res, _next) {
  const prismaStatus = error.code === "P2025" ? 404 : ["P2002", "P2003"].includes(error.code) ? 400 : undefined;
  const status = error.status || prismaStatus || (error.name === "ZodError" ? 400 : 500);
  const details = error.name === "ZodError" ? error.errors : undefined;

  res.status(status).json({
    error: error.code === "P2002"
      ? "Registro duplicado"
      : error.code === "P2003"
        ? "Registro relacionado invalido"
        : error.message || "Erro interno",
    ...(details ? { details } : {})
  });
}

module.exports = { notFoundHandler, errorHandler };

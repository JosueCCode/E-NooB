function notFoundHandler(_req, res) {
  res.status(404).json({ error: "Rota nao encontrada" });
}

function errorHandler(error, _req, res, _next) {
  const prismaStatus = error.code === "P2025" ? 404 : ["P2002", "P2003"].includes(error.code) ? 400 : undefined;
  const status = error.status || prismaStatus || (error.name === "ZodError" ? 400 : 500);
  const details = error.name === "ZodError" ? error.errors : undefined;
  const isMissingDatabaseUrl = error.message && error.message.includes("Environment variable not found: DATABASE_URL");

  res.status(status).json({
    error: isMissingDatabaseUrl
      ? "Banco de dados nao configurado. Defina DATABASE_URL na Vercel."
      : error.code === "P2002"
      ? "Registro duplicado"
      : error.code === "P2003"
        ? "Registro relacionado invalido"
        : error.message || "Erro interno",
    ...(details ? { details } : {})
  });
}

module.exports = { notFoundHandler, errorHandler };

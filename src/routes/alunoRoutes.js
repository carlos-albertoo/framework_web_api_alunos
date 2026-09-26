const express = require("express");
const alunoController = require("../controllers/AlunoController");
const validarAluno = require("../middlewares/validarAluno");

const router = express.Router();

router.get("/", (request, response, next)=>{
    console.log("Esse middleware está executando antes do controller!");
    next();
}, alunoController.findMany);
router.get("/:id", alunoController.findUnique);
router.post("/", validarAluno, alunoController.create);

module.exports = router;
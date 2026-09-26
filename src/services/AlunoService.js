const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");

class AlunoService{

    async findMany(page, pageSize, orderBy = "id", order = "asc"){
        const validOrders = ["asc", "desc"];
        const orderDirection = validOrders.includes(order) ? order : "asc";

        const alunos = await prisma.aluno.findMany({
            skip: (page-1)*pageSize,
            take: Number(pageSize),
            orderBy: {
                [orderBy]: orderDirection
            }
        });
        
        const total = await prisma.aluno.count();
        
        return { alunos, total };
    }

    async findUnique(id){
        const aluno = await prisma.aluno.findUnique({
            where: { id: Number(id) }
        });
        
        if(!aluno){
            throw new AlunoNaoEncontradoError();
        }
        
        return aluno;
    }

    async create(aluno){
        const {nome, email} = aluno;
        if(!nome || !email){
            throw new AlunoInvalidoError();
        }

        const novoAluno = await prisma.aluno.create({data: aluno});

        return novoAluno;
    }
}

module.exports = new AlunoService();
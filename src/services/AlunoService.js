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

    async update(id, dados){
        const { nome, email } = dados;

        // Justificativa para reaproveitamento de exceções:
        // - Dados inválidos: Reutilizo AlunoInvalidoError enviando uma mensagem específica, pois continua sendo um erro de validação de dados de entrada do aluno.
        if(!nome && !email){
            throw new AlunoInvalidoError("É necessário informar ao menos um campo (nome ou email) para atualização");
        }

        // - Aluno não encontrado: Reutilizo a busca de findUnique, que já lança AlunoNaoEncontradoError se não existir.
        await this.findUnique(id);

        try {
            const alunoAtualizado = await prisma.aluno.update({
                where: { id: Number(id) },
                data: { nome, email }
            });
            return alunoAtualizado;
        } catch (error) {
            // - Email duplicado: O Prisma lança o erro P2002. Reutilizo AlunoInvalidoError com mensagem específica, pois é uma regra de negócio inválida tentar usar email duplicado.
            if (error.code === 'P2002') {
                throw new AlunoInvalidoError("O email informado já está em uso por outro aluno.");
            }
            throw error;
        }
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
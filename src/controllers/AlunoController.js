const alunoService = require("../services/AlunoService");

class AlunoController{
    
    async findMany(request, response){
        let {page, pageSize, orderBy, order} = request.query;
        page ||= 1;
        pageSize ||= 10;
        orderBy ||= "id";
        order ||= "asc";
        
        try {
            const { alunos, total } = await alunoService.findMany(page, pageSize, orderBy, order);
            return response.status(200).json({ alunos, total });
        } catch(error) {
            return response.status(400).json({error: error.message});
        }
    }

    async findUnique(request, response){
        try{
            const { id } = request.params;
            const aluno = await alunoService.findUnique(id);
            return response.status(200).json({aluno});
        }catch(error){
            return response.status(error.statusCode || 400).json({error: error.message});
        }
    }

    async update(request, response){
        try{
            const { id } = request.params;
            const alunoAtualizado = await alunoService.update(id, request.body);
            return response.status(200).json({aluno: alunoAtualizado});
        }catch(error){
            return response.status(error.statusCode || 400).json({error: error.message});
        }
    }

    async delete(request, response){
        try{
            const { id } = request.params;
            await alunoService.delete(id);
            return response.status(204).send();
        }catch(error){
            return response.status(error.statusCode || 400).json({error: error.message});
        }
    }

    async create(request, response){
        try{
            const aluno = await alunoService.create(request.body);
            return response.status(201).json({aluno});
        }catch(error){
            return response.status(400).json({error: error.message});
        }
    }

}

module.exports = new AlunoController();
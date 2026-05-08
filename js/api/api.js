// URL base da sua API .NET Core (ajuste conforme necessário)
const BASE_URL = 'https://localhost:7041/api';

// LISTAR PESSOAS
const listarPessoas = async () => {
    const endPoint = `${BASE_URL}/Pessoa`;
    try {
        const resp = await fetch(endPoint);
        if (!resp.ok) throw new Error('Erro ao buscar dados');
        const dados = await resp.json();
        return dados;
    } catch (erro) {
        console.error('Erro na requisição:', erro);
        return [];
    }
};

// CADASTRAR PESSOA
const cadastrarPessoa = async (pessoa) => {
    const endPoint = `${BASE_URL}/Pessoa`;
    try {
        const resp = await fetch(endPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pessoa)
        });
        return await resp.json();
    } catch (erro) {
        console.error('Erro ao cadastrar:', erro);
        return null;
    }
};

// REMOVER PESSOA
const removerPessoa = async (id) => {
    const endPoint = `${BASE_URL}/Pessoa/${id}`;
    try {
        const resp = await fetch(endPoint, {
            method: 'DELETE'
        });
        return resp.ok;
    } catch (erro) {
        console.error('Erro ao remover:', erro);
        return false;
    }
};

export { listarPessoas, cadastrarPessoa, removerPessoa };

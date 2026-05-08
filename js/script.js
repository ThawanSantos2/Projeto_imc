import { listarPessoas, cadastrarPessoa, removerPessoa } from './api/api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('form-cadastro');
    const listaPessoasUI = document.getElementById('lista-pessoas');

    // Carregar dados iniciais da API
    const pessoasIniciais = await listarPessoas();
    pessoasIniciais.forEach(pessoa => adicionarPessoaNaLista(pessoa));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Captura de dados
        const nome = document.getElementById('nome').value;
        const sexo = document.querySelector('input[name="sexo"]:checked').value;
        const dataNascimento = document.getElementById('dataNascimento').value;
        const peso = parseFloat(document.getElementById('peso').value);
        const altura = parseFloat(document.getElementById('altura').value);

        // Cálculos
        const idade = calcularIdade(dataNascimento);
        const imc = calcularIMC(peso, altura);
        const situacao = obterSituacaoIMC(imc);

        // Objeto para a API
        const novaPessoa = {
            nome,
            sexo,
            dataNascimento,
            peso,
            altura,
            imc: parseFloat(imc.toFixed(2)),
            situacao: situacao.texto,
            classeCSS: situacao.classe,
            idade // Opcional, o backend pode calcular
        };

        // Enviar para a API
        const resultado = await cadastrarPessoa(novaPessoa);
        
        if (resultado) {
            adicionarPessoaNaLista(resultado);
            form.reset();
        } else {
            alert('Erro ao cadastrar na API. Verifique se o backend está rodando e o CORS está configurado.');
        }
    });

    function calcularIdade(dataNasc) {
        const hoje = new Date();
        const nascimento = new Date(dataNasc);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    }

    function calcularIMC(peso, altura) {
        return peso / (altura * altura);
    }

    function obterSituacaoIMC(imc) {
        if (imc < 18.5) return { texto: 'Abaixo do peso', classe: 'abaixo-peso' };
        if (imc < 25) return { texto: 'Peso normal', classe: 'peso-normal' };
        if (imc < 30) return { texto: 'Sobrepeso', classe: 'sobrepeso' };
        if (imc < 35) return { texto: 'Obesidade grau I', classe: 'obesidade-1' };
        if (imc < 40) return { texto: 'Obesidade grau II', classe: 'obesidade-2' };
        return { texto: 'Obesidade grau III', classe: 'obesidade-3' };
    }

    function adicionarPessoaNaLista(pessoa) {
        const li = document.createElement('li');
        li.className = `pessoa-card ${pessoa.classeCSS}`;
        li.dataset.id = pessoa.id;

        li.innerHTML = `
            <div class="pessoa-info">
                <div class="info-item"><strong>Nome:</strong> ${pessoa.nome}</div>
                <div class="info-item"><strong>Sexo:</strong> ${pessoa.sexo}</div>
                <div class="info-item"><strong>Idade:</strong> ${pessoa.idade || calcularIdade(pessoa.dataNascimento)} anos</div>
                <div class="info-item"><strong>Peso:</strong> ${pessoa.peso} kg</div>
                <div class="info-item"><strong>Altura:</strong> ${pessoa.altura} m</div>
                <div class="info-item"><strong>IMC:</strong> ${pessoa.imc}</div>
            </div>
            <span class="situacao-tag">${pessoa.situacao}</span>
            <button class="btn-remover">Excluir</button>
        `;

        li.addEventListener('click', async (e) => {
            if (e.target.classList.contains('btn-remover')) {
                if (confirm(`Deseja remover ${pessoa.nome}?`)) {
                    const sucesso = await removerPessoa(pessoa.id);
                    if (sucesso) {
                        li.remove();
                    } else {
                        alert('Erro ao remover da API.');
                    }
                }
            }
        });

        listaPessoasUI.appendChild(li);
    }
});

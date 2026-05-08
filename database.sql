-- Criar o banco de dados
CREATE DATABASE ProjetoImcDB;
GO

USE ProjetoImcDB;
GO

-- Criar a tabela de Pessoas
CREATE TABLE Pessoas (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nome VARCHAR(100) NOT NULL,
    Sexo VARCHAR(20) NOT NULL,
    DataNascimento DATE NOT NULL,
    Peso DECIMAL(5,2) NOT NULL,
    Altura DECIMAL(3,2) NOT NULL,
    Imc DECIMAL(5,2) NOT NULL,
    Situacao VARCHAR(50) NOT NULL,
    DataCadastro DATETIME DEFAULT GETDATE()
);
GO

-- Exemplo de inserção para teste
INSERT INTO Pessoas (Nome, Sexo, DataNascimento, Peso, Altura, Imc, Situacao)
VALUES ('Thawan Santos', 'Masculino', '2000-01-01', 75.0, 1.75, 24.49, 'Peso normal');
GO

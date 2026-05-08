# Guia de Implementação do Backend (C# .NET Core API)

Este guia descreve como configurar a API para o Projeto IMC utilizando o Visual Studio 2022.

## 1. Criação do Projeto
1. Abra o **Visual Studio 2022**.
2. Clique em **Criar um novo projeto**.
3. Selecione **ASP.NET Core Web API** e clique em **Próximo**.
4. Nome do Projeto: `ProjetoImc.Api`.
5. Framework: **.NET 6.0** ou **.NET 8.0**.
6. Desmarque "Usar controladores (desmarque para usar APIs mínimas)" se preferir o modelo clássico de Controllers (recomendado para iniciantes).

## 2. Configuração de Pacotes NuGet
No Console do Gerenciador de Pacotes, instale:
```powershell
Install-Package Microsoft.EntityFrameworkCore.SqlServer
Install-Package Microsoft.EntityFrameworkCore.Tools
Install-Package Swashbuckle.AspNetCore
```

## 3. Modelo de Dados (Model)
Crie uma pasta `Models` e adicione a classe `Pessoa.cs`:
```csharp
public class Pessoa
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Sexo { get; set; }
    public DateTime DataNascimento { get; set; }
    public double Peso { get; set; }
    public double Altura { get; set; }
    public double Imc { get; set; }
    public string Situacao { get; set; }
}
```

## 4. Configuração do CORS (Importante!)
Para que o seu frontend consiga acessar a API, você deve configurar o CORS no `Program.cs`:
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// ... resto do código

var app = builder.Build();

app.UseCors("AllowAll"); // Deve vir antes de UseAuthorization

// ... resto do código
```

## 5. Controller
Crie um `PessoaController.cs` na pasta `Controllers`:
```csharp
[ApiController]
[Route("api/[controller]")]
public class PessoaController : ControllerBase
{
    private static List<Pessoa> _pessoas = new List<Pessoa>();

    [HttpGet]
    public IActionResult Get() => Ok(_pessoas);

    [HttpPost]
    public IActionResult Post([FromBody] Pessoa pessoa)
    {
        pessoa.Id = _pessoas.Count + 1;
        _pessoas.Add(pessoa);
        return Ok(pessoa);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var pessoa = _pessoas.FirstOrDefault(p => p.Id == id);
        if (pessoa == null) return NotFound();
        _pessoas.Remove(pessoa);
        return NoContent();
    }
}
```

## 6. Conexão com o Frontend
O arquivo `js/api/api.js` já está configurado para apontar para `https://localhost:7041/api`. Verifique a porta em que seu projeto .NET está rodando no arquivo `launchSettings.json`.

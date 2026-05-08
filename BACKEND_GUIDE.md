# Guia Completo: Backend API WEB ASP.NET Core + SQL Server

Este guia foca no modelo **API WEB do ASP.NET Core** (com Controllers) utilizando o **Visual Studio 2022**.

## 1. Banco de Dados (SQL Server)
1. Abra o **SQL Server Management Studio (SSMS)**.
2. Execute o script contido no arquivo `database.sql` para criar o banco `ProjetoImcDB` e a tabela `Pessoas`.

## 2. Criação do Projeto no Visual Studio 2022
1. **Criar um novo projeto** -> **API WEB do ASP.NET Core**.
2. Nome: `ProjetoImc.Api`.
3. Framework: **.NET 6.0** ou **.NET 8.0**.
4. **IMPORTANTE**: Certifique-se de que a opção "Usar controladores" está **marcada**.

## 3. Configuração do Banco de Dados (Entity Framework)
Instale os pacotes via Console do Gerenciador de Pacotes:
```powershell
Install-Package Microsoft.EntityFrameworkCore.SqlServer
Install-Package Microsoft.EntityFrameworkCore.Design
Install-Package Microsoft.EntityFrameworkCore.Tools
```

No arquivo `appsettings.json`, adicione sua string de conexão:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=SEU_SERVIDOR;Database=ProjetoImcDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

## 4. Model e Contexto
Crie a classe `Pessoa.cs` na pasta `Models`:
```csharp
public class Pessoa
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Sexo { get; set; }
    public DateTime DataNascimento { get; set; }
    public decimal Peso { get; set; }
    public decimal Altura { get; set; }
    public decimal Imc { get; set; }
    public string Situacao { get; set; }
}
```

Crie o arquivo `AppDbContext.cs` na pasta `Data`:
```csharp
using Microsoft.EntityFrameworkCore;
using ProjetoImc.Api.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Pessoa> Pessoas { get; set; }
}
```

## 5. Registro do Contexto e CORS (Program.cs)
```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();
app.UseCors("AllowAll");
```

## 6. Controller (PessoaController.cs)
Crie o Controller com as ações de CRUD para interagir com o banco de dados:
```csharp
[ApiController]
[Route("api/[controller]")]
public class PessoaController : ControllerBase
{
    private readonly AppDbContext _context;
    public PessoaController(AppDbContext context) { _context = context; }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pessoa>>> Get() => await _context.Pessoas.ToListAsync();

    [HttpPost]
    public async Task<ActionResult<Pessoa>> Post(Pessoa pessoa)
    {
        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();
        return Ok(pessoa);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa == null) return NotFound();
        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
```

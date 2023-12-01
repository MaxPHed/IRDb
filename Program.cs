
using IRDb.Database;
using IRDb.Repositories;
using Microsoft.EntityFrameworkCore;

namespace IRDb
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //L�gger till database, h�nvisar till appsettings.json d�r connection string �r
            var connectionString = builder.Configuration.GetConnectionString("MoviesDbConnection");
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));

            //L�gg till Movie Repository connection
            builder.Services.AddScoped<IMoviesRepository, MoviesRepository>();

            //Skapar CORS som till�ter alla anslutningar fr�n �verallt.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: "AllowAll", policy =>
                {
                    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseCors("AllowAll");

            app.MapControllers();

            app.Run();
        }
    }
}
# LabJournal

LabJournal представляет собой современное серверное приложение для управления компьютерным классом, отслеживания выполненных заданий, фиксации посещаемости и работы студентов (включая парную работу), а также автоматической выгрузки отчетов в формат Excel. 

Проект спроектирован в соответствии с принципами чистой архитектуры (**Clean Architecture**) и использует **ASP.NET Core Minimal APIs**, паттерн **CQRS** через библиотеку MediatR и **Entity Framework Core 10**.

## 🛠 Технологический стек

* **Платформа:** .NET 10 / ASP.NET Core Minimal APIs (C# 14)
* **Архитектура:** Clean Architecture с вертикальными слайсами (Domain, Application, Infrastructure, WebApi)
* **База данных и ORM:** Entity Framework Core 10 с MS SQL Server
* **Безопасность:** JWT Bearer Authentication (Role-Based Access Control: Admin / User)
* **Библиотеки:** 
  * `MediatR` — реализация CQRS и разделение бизнес-логики
  * `AutoMapper` — гибкий маппинг сущностей в DTO
  * `FluentValidation` — централизованная валидация входящих данных
  * `EPPlus` — генерация и стилизация Excel-отчетов (.xlsx)

## 📁 Структура проекта

* **LabJournal.Domain:** Ядро приложения. Содержит базовые доменные сущности (Computer, Group, User, TaskRecord) со строгими бизнес-правилами и фабричными методами.
* **LabJournal.Application:** Сценарии использования системы. Включает в себя обработчики команд (Commands) и запросов (Queries), классы DTO, интерфейсы и логику валидации.
* **LabJournal.Infrastructure:** Реализация инфраструктурных задач. Контекст базы данных (`ApplicationDbContext`), Fluent API конфигурации таблиц, хэширование паролей и генерация JWT-токенов.
* **LabJournal.WebApi:** Входная точка приложения. Модули эндпоинтов Minimal API (`IEndpointModule`), глобальный перехват ошибок (`GlobalExceptionHandler`) и регистрация зависимостей (DI).

## 🚀 Начало работы

### Требования

* Среда выполнения и SDK **.NET 10**
* СУБД **MS SQL Server** (LocalDB или SQL Express)
* Глобальные инструменты EF Core CLI (установка: `dotnet tool install --global dotnet-ef`)

### Конфигурация

Перед запуском обновите строку подключения к вашей локальной базе данных и настройки JWT-токена в файле `appsettings.json` в проекте `LabJournal.WebApi`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YourConnectinString"
  },
  "JwtSettings": {
    "Secret": "YourSecretKey",
    "Issuer": "LabJournal.WebApi",
    "Audience": "LabJournal.Clients",
    "ExpiryMinutes": "60"
  }
}
```

### Миграции и создание базы данных

Выполните следующие команды из папки решения или напрямую из директории `LabJournal.WebApi` для генерации таблиц и развертывания базы данных на локальном сервере:

```bash
# Генерируем миграцию на основе сущностей
dotnet ef migrations add InitialCreate --project ../LabJournal.Infrastructure/LabJournal.Infrastructure.csproj

# Применяем миграцию (создаем БД и таблицы)
dotnet ef database update --project ../LabJournal.Infrastructure/LabJournal.Infrastructure.csproj
```

## 🎛 Обзор API Эндпоинтов

### Аутентификация (`Authentication`)
* `POST /api/auth/register` — Регистрация нового пользователя.
* `POST /api/auth/login` — Авторизация и получение JWT-токена доступа с ролями.

### Компьютеры (`Computers`)
* `GET /api/computers` — Получение списка ПК с поддержкой пагинации.
* `POST /api/computers` — Добавление нового ПК в справочник *(Доступ: Admin)*.
* `DELETE /api/computers/{id}` — Удаление ПК из системы *(Доступ: Admin)*.

### Группы (`Groups`)
* `GET /api/groups` — Получение списка учебных групп с пагинацией.
* `POST /api/groups` — Добавление новой группы в справочник *(Доступ: Admin)*.
* `DELETE /api/groups/{id}` — Удаление группы *(Доступ: Admin)*.

### Журнал заданий (`TaskRecords`)
* `GET /api/task-records` — Получение записей журнала с фильтрацией по диапазону дат (`dateFrom`/`dateTo`), группам и пагинацией.
* `POST /api/task-records` — Создание записи в журнале (фиксирует дату, группу, ПК, ФИО студентов и список выполненных задач).
* `PUT /api/task-records` — Изменение выполненных задач или ФИО студентов в ячейке журнала *(Доступ: Admin)*.
* `DELETE /api/task-records/{id}` — Удаление строки журнала *(Доступ: Admin)*.
* `GET /api/task-records/export` — **Генерация и скачивание Excel-отчета** по выбранным фильтрам дат и групп.

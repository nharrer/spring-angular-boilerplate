# Spring API Example

## Description

This is a simple Spring Boot 3 REST server with Spring Security 6 using JSON Web Token (JWT).

## Database

The users are stored in a PostgreSQL database. A `docker-compose.yml` is provided, which spawns a PostgreSQL database and a pgAdmin web app.

Copy `.env.example` to `.env` and configure the desired credentials and ports.

Create a database with pgAdmin (https://localhost:9999/), for example, `springdemo`.

## Spring Configuration

Copy `config/application.properties.example` to `config/application.properties`.

Edit the properties. Don't forget to change the database name in `spring.datasource.url` to the database you created before.
Even though it works to use the PostgreSQL admin user, it is recommended to create a separate user for Spring.

## Issues

There is no user management yet. So you have to create the admin user manually in the datase. For example:

`
INSERT INTO public.users(id, roles, email, first_name, last_name, password)
VALUES (1, 'ROLE_USER,ROLE_ADMIN', 'admin@test.com', 'admin', 'admin', '$2a$10$N1f1.eypqJtCsB.tZBqfL.mqsj42ROYgTI2oaMA1Wxv/e9w4F7YZq');
`

This created a user `admin@test.com` with password `test123`.

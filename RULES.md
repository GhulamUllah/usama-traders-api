# 📘 Project Rules & Best Practices

## 1️⃣ General Principles

- Code must be **readable, maintainable, and scalable**.
- Follow **SOLID principles** and **DRY (Don’t Repeat Yourself)** rule.
- Every new feature should be created in its **own module** under `src/modules/`.
- Prefer **composition over inheritance**.
- Always write **type-safe** code (use TypeScript everywhere).

---

## 2️⃣ Project Structure

- Keep a **feature-based modular structure**:
  - `controller` → Handles HTTP requests/responses.
  - `service` → Contains business logic.
  - `model` → Database schemas/models.
  - `routes` → API route definitions.
  - `types` → Module-specific TypeScript types.
- Common/shared code should live in:
  - `middleware/`, `utils/`, `interfaces/`, `constants/`.
- Do not put business logic in **routes** or **controllers** → it belongs in **services**.

---

## 3️⃣ Code Style

- Use **ESLint + Prettier** for consistent style.
- Naming:
  - **Files** → kebab-case (`user.service.ts`, `auth.controller.ts`).
  - **Classes** → PascalCase (`UserService`).
  - **Functions & variables** → camelCase (`getUserById`).
  - **Constants/Enums** → UPPER_CASE (`MAX_RETRIES`).
- Use **async/await**, never `.then().catch()`.
- Avoid `any` — always use **strict types**.

---

## 4️⃣ Error Handling

- Centralize error handling in `error.middleware.ts`.
- Always return **consistent error responses** (`{ success: false, message, code }`).
- Do not throw raw errors → wrap them in **custom error classes** if needed.
- Log errors with `utils/logger.ts`.

---

## 5️⃣ API & Request Handling

- All routes must be prefixed with `/api/v1/` (versioning).
- Validate request body, params, and query using a **validation middleware** (e.g., Zod, Joi, Yup).
- Follow REST best practices:
  - `GET /users` → list users.
  - `GET /users/:id` → get a single user.
  - `POST /users` → create user.
  - `PUT /users/:id` → update user.
  - `DELETE /users/:id` → delete user.

---

## 6️⃣ Security Best Practices

- Never commit `.env` → always use `.gitignore`.
- Use **Helmet** for HTTP headers security.
- Enable **CORS** only for allowed domains.
- Sanitize input to prevent **SQL Injection / XSS**.
- Store passwords hashed with **bcrypt** (never plain text).
- Use **JWT** for authentication and refresh tokens.
- Rotate secrets regularly.

---

## 7️⃣ Database Practices

- Use **connection pooling**.
- All queries should go through models/services (never directly from controllers).
- Apply **migrations** (if SQL DB).
- Use indexes for frequently queried fields.

---

## 8️⃣ Git & Commit Rules

- Use **feature branches**: `feature/login`, `bugfix/user-validation`.
- Commit messages must follow convention:
  - `feat: add user login endpoint`
  - `fix: resolve validation error in signup`
  - `refactor: improve error handling middleware`
  - `test: add unit tests for auth service`
- Always run lint & tests before PR.

---

## 9️⃣ Testing

- Use **Jest** or **Mocha + Chai** for testing.
- Write **unit tests** for services & utils.
- Write **integration tests** for routes.
- Aim for **80%+ coverage**.

---

## 🔟 Deployment

- Use **Docker** for containerization.
- Store secrets in environment variables, never in code.
- Use CI/CD pipeline with linting & tests before deploy.
- Log using a centralized logger (Winston / Pino).
- Always run production with `NODE_ENV=production`.

---

✅ Following these rules ensures this project stays **clean, secure, and scalable**.

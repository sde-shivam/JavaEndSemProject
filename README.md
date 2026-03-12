# 🛒 QuickBill - Full-Stack Point of Sale (POS) System

QuickBill is a comprehensive, full-stack Point of Sale application engineered to streamline billing, inventory management, and role-based operations. 

This project was built to demonstrate proficiency in **RESTful API design, secure stateless authentication, global state management, and layered application architecture.**

---

## 🏗️ Architecture & Design Patterns (Interview Reference)

This system is built using standard enterprise design patterns to ensure scalability, security, and maintainability.

### 1. Spring Boot Layered Architecture
The backend strictly adheres to a multi-tier architecture to enforce separation of concerns:
* **Controller Layer (`@RestController`):** Acts as the entry point. It handles HTTP requests, maps endpoints, and validates incoming data.
* **Service Layer (`@Service`):** Contains the core business logic. It processes data and acts as a bridge between the Controller and the Repository.
* **Repository Layer (`@Repository`):** Utilizes Spring Data JPA to abstract database interactions and execute CRUD operations without boilerplate SQL.

### 2. The DTO (Data Transfer Object) Pattern
Instead of exposing raw database entities (Models) to the client, this project uses DTOs.
* **Why?** It prevents "Over-Posting" vulnerabilities, hides sensitive database fields (like passwords or internal IDs), and allows the API response to be shaped precisely for the frontend's needs.

### 3. Stateless Security with JWT & RBAC
* **JWT (JSON Web Tokens):** The API is secured statelessly. Upon login, the server issues a JWT. The React frontend stores this and attaches it to the `Authorization` header of subsequent requests.
* **Role-Based Access Control (RBAC):** Users are assigned roles (e.g., ADMIN, USER). The backend uses Spring Security filters to block unauthorized API access, while the React frontend uses `AdminRoute` and `ProtectedRoute` wrappers to conditionally render UI components.

### 4. React Context API
* Global state (like the authenticated user's session, cart items, and active products) is managed using React's Context API rather than passing props down multiple levels (Prop Drilling), ensuring a highly efficient frontend rendering cycle.

---

## ⚙️ Backend Execution Flow (Detailed Architecture)

This project strictly follows a layered Spring Boot architecture to ensure loose coupling, maintainability, and clear separation of concerns. Here is the exact step-by-step flow of how a single HTTP request travels through the QuickBill backend:

### 1. Security Interception (`/config`)
* **The Request:** An HTTP request hits the backend (e.g., `POST /api/products`).
* **JWT Filter:** Before reaching any controller, the request passes through the `JwtAuthenticationFilter`. The filter extracts the token from the `Authorization` header, validates the signature using the `JwtService`, and sets the user's authentication context in Spring Security. If the token is invalid or missing for a protected route, the request is blocked immediately with a `401 Unauthorized` or `403 Forbidden` error via `ErrorResponse.java`.

### 2. The Entry Point (`/controller`)
* **Routing:** Once authenticated, the request is routed to the appropriate REST controller (e.g., `ProductController.java`).
* **Data Binding:** The JSON payload in the request body is automatically mapped to a Data Transfer Object (e.g., `ProductRequestDTO.java`).
* **Validation:** The controller ensures the incoming data is structurally sound before passing it down the stack.

### 3. Business Logic Interface (`/service`)
* **Abstraction:** The controller passes the DTO to a Service Interface (e.g., `ProductService.java`). 
* **Why an Interface?** Using an interface allows for abstraction and loose coupling, a core Object-Oriented Programming (OOP) principle. It defines *what* the service should do without dictating *how* it does it, making the code easier to test and scale.

### 4. Business Logic Implementation (`/implement`)
* **Execution:** The concrete class (e.g., `ProductImplement.java`) executes the actual business rules. 
* **Transformation:** It takes the `ProductRequestDTO`, processes the data, and converts it into the core database entity/modal (e.g., `Product.java`).

### 5. Data Access Layer (`/repository`)
* **Persistence:** The implementation layer calls the Repository interface (e.g., `ProductRepo.java`), which extends Spring Data JPA.
* **Database Action:** Spring Data JPA automatically generates the required SQL queries (Insert, Update, Select, Delete) behind the scenes and executes them against the MySQL database.

### 6. The Response
* **Upward Flow:** Once the database operation is successful, the `Product` entity is returned to the `ProductImplement` class.
* **Security & Formatting:** The entity is mapped into a safe `ProductResponseDTO.java` (stripping out any sensitive internal database information).
* **Return to Client:** The Controller sends this Response DTO back to the React frontend with the appropriate HTTP status code (e.g., `201 Created` or `200 OK`).

---

## 📁 Project Structure Highlights

### Backend (`/pos_backend/src/main/java/...`)
* `/config` - Security and JWT filter configurations.
* `/controller` - API endpoints for Category, Order, Product, and User.
* `/dto` - Request and Response objects for secure data transfer.
* `/implement` - Concrete implementations of business logic services.
* `/modal` - Database entities.
* `/repository` - Database interaction layer.
* `/service` - Service interfaces.

### Frontend (`/src`)
* `/Component` - Reusable UI elements (HeroSection, Navbar, Modals).
    * `/Protectedroutes` - Logic for role-based route access.
* `/Page` - Main application views (Dashboard, Billing, Analytics).
* `/context` - Global state providers.
* `/utils` - Helper functions and chart setups.

---

## 🛠️ Technology Stack

**Frontend:**
* React.js (Vite)
* Context API for State Management
* CSS Modules / Custom UI

**Backend:**
* Java 17+
* Spring Boot (Web, Data JPA, Security)
* MySQL (Relational Database)
* Maven

---

## 🚀 Setup & Installation

### Environment Variables
For security, sensitive credentials are removed from the source code. You must configure your environment variables before running the application.

Create an `.env` file or configure your IDE to provide the following variables:
* `DB_URL`
* `DB_USERNAME`
* `DB_PASSWORD`
* `JWT_SECRET_KEY`

### Backend Setup
1.  Navigate to the backend directory: `cd pos_backend`
2.  Ensure your `application.properties` is configured correctly (using `server.port=8080` and `com.mysql.cj.jdbc.Driver`).
3.  Clean and compile the project: `./mvnw clean install`
4.  Run the server: `./mvnw spring-boot:run`

### Frontend Setup
1.  Navigate to the frontend directory.
2.  Install all node dependencies: `npm install`
3.  Start the Vite development server: `npm run dev`
4.  The application will be accessible at `http://localhost:5173`

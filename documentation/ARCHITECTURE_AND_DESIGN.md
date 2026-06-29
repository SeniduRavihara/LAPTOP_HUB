# Chapter 3: System Architecture and Design Strategies

## 3.1 System Architecture

### 3.1.1 High-Level Architecture View

The **Laptop Hub** platform is designed using a **Decoupled Full-Stack Architecture**, ensuring a clear separation between user interaction, business logic, and data persistence. This approach allows for independent scaling of the frontend and backend services while maintaining high performance and security.

The high-level architecture is composed of three primary layers:
- **Presentation Layer**: A responsive web interface built with **Next.js 14**, responsible for delivering a premium user experience across all devices.
- **Service & Logic Layer**: A set of **Next.js Server Actions** and **API Routes** that handle secure data mutations, validation, and complex business workflows.
- **Data Layer**: A cloud-native **Supabase (PostgreSQL)** backend that provides persistent storage, real-time synchronization, and managed authentication services.

### 3.1.2 3-Tier Client-Server Architecture

The architecture that most accurately represents the system is the **3-Tier Client-Server Architecture**. This is the industry standard for scalable web applications, dividing the application into three logical and physical tiers:

1.  **Client Tier (The Browser)**: 
    The "Client" is the user's browser running the Next.js frontend. It handles user input and visual rendering. In this tier, we use **React Client Components** for interactive elements like the bidding form and live countdown timers.

2.  **Application/Server Tier (Next.js Server)**:
    This tier acts as the "Server" or "Controller". When a user interacts with the app (e.g., placing a bid or listing a laptop), the request is sent to **Next.js Server Actions**. This tier performs:
    *   **Authentication & Authorization**: Verifying the user's identity.
    *   **Validation**: Ensuring data integrity (e.g., checking if a bid is higher than the current price).
    *   **Business Logic**: Processing the specific rules of the marketplace.

3.  **Database Tier (Supabase/PostgreSQL)**:
    The "Data Store" where all information resides. Unlike traditional architectures, this tier is not just a passive database. It includes:
    *   **Stored Procedures & Triggers**: For automated data validation.
    *   **Realtime Engine**: For pushing instant updates back to the Client Tier.
    *   **Storage Buckets**: For hosting product images and user assets.

By using this 3-tier approach, the system ensures that the **Data Tier** remains secure and isolated, the **Application Tier** remains focused on logic, and the **Client Tier** remains lightweight and fast.

---

## 3.2 Design Strategies

### 3.2.1 Component-Based Design

The UI is developed using **Atomic Design** principles. Small, reusable components (buttons, badges) are composed into larger molecules (cards, forms) and eventually full templates (Product Detail Page). This ensures visual consistency and reduces code redundancy.

### 3.2.2 Mobile-First Responsive Strategy

Using **Tailwind CSS**, the platform follows a mobile-first approach. The "AliExpress-style" layout is optimized to be information-dense yet readable on mobile devices, scaling seamlessly to 4K desktop monitors using a grid-based fluid layout.

### 3.2.3 Security Strategy: Row Level Security (RLS)

Security is not just in the code but at the data layer. We implement **Row Level Security (RLS)** in PostgreSQL. This ensures that even if a frontend vulnerability exists, a user cannot delete another user's product listing or view private order history unless explicitly authorized by the database policy.

### 3.2.4 Performance Optimization

- **Server-Side Rendering (SSR)**: Initial page loads are rendered on the server to ensure fast Time-to-Interactive and better SEO.
- **Optimistic UI Updates**: When a user places a bid, the UI updates instantly before the server confirms, providing a "lag-free" experience.

---

## 3.3 Application of Object-Oriented Programming (OOP) Concepts

Even in a modern web environment using TypeScript and React, the four pillars of OOP are foundational to the system's robustness.

### 3.3.1 Inheritance

Inheritance is used to manage **User Roles** and **Data Entities**.

- **User Hierarchy**: A base `User` interface defines core attributes (email, id). The `Seller` and `Admin` roles inherit these properties but extend them with specific permissions and metadata.
- **Component Composition**: While React favors composition over class inheritance, we use "Prop Inheritance" where specialized components (e.g., `AuctionCard`) inherit and extend the properties of a base `ProductCard`.

### 3.3.2 Encapsulation

We encapsulate complex business logic within **Service Classes** and **Custom Hooks**:

- **Service Layer**: `ProductService` encapsulates all logic for fetching and filtering laptops. The rest of the app doesn't need to know *how* the SQL query is written; it just calls `getProducts()`.
- **State Encapsulation**: React Hooks (e.g., `useCart`, `useAuth`) encapsulate the internal state and only expose the necessary methods (`addItem`, `login`) to the UI, hiding the underlying complexity.

### 3.3.3 Polymorphism

Polymorphism allows the system to treat different entities through a common interface:

- **Dynamic Rendering**: A single `ProductGrid` component can render both "Auction Items" and "Buy Now Items". It uses polymorphic logic to determine which UI elements (countdown timer vs. price tag) to display based on the product type.
- **Payment Strategy**: The system supports multiple payment methods (PayHere, COD). Both follow a common "Checkout Flow" interface, but their implementation of the `processPayment` method varies.

### 3.3.4 Abstraction

Abstraction is used to simplify the interaction with complex external systems:

- **Database Abstraction**: The `supabase-client` abstracts away the complexities of HTTP requests and WebSockets. Developers interact with a clean JavaScript API.
- **Authentication Abstraction**: The `AuthContext` provides a simple `user` object and `signOut` function, abstracting away the complex token management and session persistence happening in the background.

---

## 3.4 Software Design Patterns

Beyond architectural styles, the system implements specific software design patterns to ensure maintainability and performance.

### 3.4.1 Singleton Pattern (Supabase Client)
The **Singleton Pattern** is utilized in the initialization of the Supabase client. By creating a single instance of the client in a dedicated file (e.g., `lib/supabase.ts`), we ensure that the application does not create redundant connections or multiple client instances. This centralized instance is reused across all services and components, optimizing resource usage and maintaining a consistent authentication state.

### 3.4.2 Repository / Service Pattern
The platform follows the **Service Pattern** to decouple business logic from the UI. All database interactions are abstracted into dedicated service classes (e.g., `ProductService`, `OrderService`). This acts as a "Repository" layer, where components call high-level methods like `getFeaturedAuctions()` without needing to know the underlying table structures or SQL syntax.

### 3.4.3 Observer Pattern (Real-time Updates)
The real-time bidding system is a practical implementation of the **Observer Pattern**. 
- **Subject**: The Supabase database table for `bids`.
- **Observers**: The Client-side components listening for changes.
When a new bid is inserted, the database (Subject) notifies all connected clients (Observers) via WebSockets, allowing the UI to update the "Current Bid" price instantly.

### 3.4.4 Strategy Pattern (Payment Processing)
The system uses a **Strategy Pattern** for handling diverse checkout methods. Depending on whether the user selects "PayHere" or "Cash on Delivery", the application dynamically selects the appropriate execution strategy. Both strategies adhere to a common interface, allowing the checkout flow to remain generic while the implementation details vary.

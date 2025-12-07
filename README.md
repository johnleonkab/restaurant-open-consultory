# 🌿 Savia - Gastronomic Intelligence

> **From idea to real product in < 5 hours.** 🚀
> 
> *An experiment in Product Management + AI-Assisted Engineering.*

![Savia Banner](https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop)

## 💡 What is Savia?

Savia is an **intelligent virtual consultant for gastronomic entrepreneurs**.

It helps transform an abstract idea ("I want to open a pizzeria") into a structured and viable business plan in minutes. It guides the user through 12 critical phases: from concept and financial viability to design, suppliers, and technology.

**DEMO AVAILABLE HERE: https://dulcet-jalebi-2ed963.netlify.app**

## ⚡ The Story: The 5-Hour Challenge

This project is not just a tool; it is a **statement of intent** regarding the future of software development and Product Management.

The goal was simple yet ambitious: **Build a functional, beautiful, and useful SaaS in a single afternoon.**

### "AI-Driven Product Development" Methodology

1.  **Solid Definition (1h)**: Not a single line of code was written until the *what* and *why* were clear. Product definition, user journey, and value proposition.
2.  **Architecture & UI (1h)**: System design, stack selection (Next.js + Supabase), and interface design.
3.  **AI Development (2.5h)**: Intensive pair programming with advanced LLMs to generate code, business logic, and complex components.
4.  **Deployment & Measurement (0.5h)**: Production deployment and advanced analytics configuration with Amplitude.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14 (App Router), React, TailwindCSS, Framer Motion.
*   **Backend**: Supabase (Auth & Database).
*   **AI Core**: Google Gemini 2.0 Flash (Reasoning and plan generation).
*   **Analytics**: Amplitude (Event and user tracking).
*   **Integrations**: CoverManager (Reservation management).

## ✨ Key Features

*   🤖 **Consultative Chat**: An AI with an expert personality that interviews and advises you.
*   📊 **Real-Time Plan**: Your business plan is built and updated automatically as you chat.
*   💰 **Viability Analysis**: Automatic calculations of CAPEX, OPEX, and break-even point.
*   🔒 **Persistence**: Save your progress and continue on any device.
*   📈 **Smart Limits**: Usage control system (Rate Limiting) for cost management.

## 🚀 How to run locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/johnleonkab/restaurant-open-consultory.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables (`.env.local`):
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    GEMINI_API_KEY=your_api_key
    ```
4. Run the migrations in supabase from the folder supabase/migrations 
5.  Run the development server:
    ```bash
    npm run dev
    ```

## 👨‍💻 Author

**John Leon**
*Product Manager & Maker (Currently @ CoverManager)*

---

*Made with ❤️ and lots of ☕.*

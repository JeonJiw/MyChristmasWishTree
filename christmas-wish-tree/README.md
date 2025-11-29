🎄 My Christmas Wish Tree

A mobile-first web application for creating and sharing Christmas wishlist trees with interactive visualization.

Course: CPSC 3720 – Software Engineering (Fall 2025)
Team: Jiwon Jeon & Chloe Lee
Instructor: Dr. Jaspreet Kaur

📌 1. Project Overview

My Christmas Wish Tree is a web application that allows users to visually create and share wishlist items on a customizable Christmas tree.
Users can add gifts as ornaments, drag them around the tree, edit their information, and generate a shareable link for friends or family.

This project demonstrates:
✔️ React component architecture
✔️ State management & UI rendering
✔️ Persistent storage with LocalStorage
✔️ Shareable public viewer mode
✔️ Formal software engineering documentation
✔️ Jest + RTL testing with coverage

📌 2. Features

🎄 Create a personalized wishlist tree

🧸 Add, edit, and delete ornaments

🖱️ Drag-and-drop UI interactions

📤 Generate a public share link

🔒 Read-only shared viewer mode

💾 Automatic saving via LocalStorage

📱 Mobile-first responsive UI

🧪 Full unit & integration tests

📌 3. Tech Stack
Layer	Technology
Frontend	React (Vite)
Styling	Tailwind CSS
Testing	Jest, React Testing Library
Storage	LocalStorage
Tools	Node.js, Vite
Documentation	UML, Mermaid, Word/PDF
📌 4. Folder Structure
christmas-wish-tree/
 ├─ public/
 ├─ src/
 │   ├─ __tests__/              # Full test suite
 │   │    ├─ HomePage.test.jsx
 │   │    ├─ TreeCanvas.test.jsx
 │   │    ├─ TreeEditor.test.jsx
 │   │    ├─ shareService.test.js
 │   │    └─ storageService.test.js
 │   ├─ assets/
 │   ├─ components/
 │   ├─ pages/
 │   └─ services/
 ├─ docs/                       # Final Report, Design Doc, Testing Doc, UML, PPT
 ├─ package.json
 ├─ tailwind.config.js
 └─ vite.config.js

📌 5. Installation & Run Instructions
npm install
npm run dev


App runs at:
👉 http://localhost:5173

📌 6. Running Tests
Run all tests
npm test

Run tests with coverage
npm test -- --coverage


Coverage includes:

Component rendering

CRUD operations

ShareService logic

StorageService load/save behavior

UI interaction tests (RTL)

📌 7. Documentation

All project deliverables are included in /docs:

Final Project Report (PDF)

Design Documentation (PDF)

Testing Documentation

UML Diagrams

Presentation Slides (PPTX)

Presenter Script + Demo Script

📌 8. Team Contributions
Chloe Lee

Project setup (React + Vite + Tailwind)

UI components (HomePage, TreeCanvas, TreeEditor)

Responsive styling

Test planning & cross-browser testing

UML diagrams & documentation

Presentation prep

Jiwon Jeon

Application logic (CRUD operations)

StorageService & ShareService

State management

Test implementation (unit + integration)

Additional UI logic

📌 9. License

Created for CPSC 3720 – Fall 2025.
Not intended for commercial use.
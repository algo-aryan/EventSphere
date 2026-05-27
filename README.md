# EventSphere 🎟️

EventSphere is a modern, full-stack event management and ticketing platform designed for both organizers and attendees. Built with Next.js 15, Tailwind CSS, and Shadcn UI, it offers a seamless experience from event discovery to ticket purchase and on-site check-in.

## ✨ Key Features

### For Attendees
- **🔍 Advanced Discovery Hub**: Filter events by category, city, date, and price. 
- **🤖 AI-Powered Recommendations**: Get personalized event suggestions based on your past ticket purchases.
- **🛒 Multi-Ticket Checkout**: Purchase different tiers of tickets (e.g., VIP, General Admission) simultaneously.
- **❤️ Wishlist & Reminders**: Save events to your wishlist and receive notifications before tickets sell out.
- **🤝 Attendee Networking**: Opt-in to share your LinkedIn profile and connect with other verified attendees.
- **⭐ Post-Event Community**: Leave public reviews and star ratings, and submit private feedback to organizers.

### For Organizers
- **📊 Real-time Dashboard**: Track ticket sales, revenue, and attendance metrics at a glance.
- **📝 Event Creation**: Easily publish new events with custom ticket tiers and discount codes.
- **📋 Attendee Management**: View a dynamic table of all attendees across events.
- **📥 CSV Exports**: Download your entire attendee list for offline access with a single click.
- **📱 QR Code Check-in**: A built-in scanner interface to validate cryptographic QR tickets at the door.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 & Shadcn UI
- **State Management**: Zustand
- **Icons**: Lucide React
- **Forms**: React Hook Form & Zod
- **Utilities**: `qrcode.react` (Ticketing), `recharts` (Analytics), `sonner` (Toasts)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/algo-aryan/EventSphere.git
   cd EventSphere
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📂 Project Structure
- `/src/app`: Next.js App Router pages (Dashboard, Checkout, Events, etc.)
- `/src/components`: Reusable UI components (Shadcn UI, Navbars, Cards)
- `/src/lib`: Global Zustand store (`store.ts`) and utility functions
- `/supabase`: Database schema definitions (if applicable)

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request if you'd like to improve EventSphere.

## 📄 License
This project is licensed under the MIT License.

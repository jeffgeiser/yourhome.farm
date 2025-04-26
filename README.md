# YourHome.Farm

An AI-powered garden management platform to help you grow a better garden.

## Overview

YourHome.Farm is a subscription-based service that helps users manage their home gardens with AI-powered features, personalized care plans, and weather alerts.

## Features

- **User Authentication**: Secure email/password authentication using Supabase Auth
- **Garden Management**: Create and manage multiple garden profiles with details about size, location, etc.
- **Plant Tracking**: Add plants to your gardens and track their growth and care needs
- **AI-Powered Tasks**: Get personalized care instructions and tasks based on your plants and local conditions
- **Weather Alerts**: Receive alerts about frost, heat waves, or other weather events that affect your garden
- **Community**: Share your gardening experiences and learn from other gardeners
- **Calendar View**: View all your garden tasks and events in a calendar format

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Database/Auth**: Supabase (PostgreSQL, Supabase Auth)
- **Deployment**: Netlify
- **External APIs**:
  - AI: OpenAI GPT-4 API for personalized care plans
  - Weather: OpenWeatherMap API for weather alerts

## Getting Started

### Prerequisites

- Node.js 16+
- Supabase account
- OpenAI API key
- OpenWeatherMap API key

### Environment Setup

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Connect to Supabase and run the migrations in the `supabase/migrations` folder

### Database Setup

The database schema and migrations are located in the `supabase/migrations` directory. 

Run these migrations on your Supabase project to set up:
- Users table
- Garden profiles
- Plants catalog (with sample data)
- User plants
- Tasks
- Feedback
- Alerts

## Folder Structure

- `/app`: Next.js app router pages
- `/components`: Reusable React components
- `/lib`: Utility functions and API clients
- `/hooks`: Custom React hooks
- `/functions`: Netlify serverless functions for AI and weather processing
- `/supabase`: Supabase migrations and configuration

## Deployment

The project is configured for Netlify deployment:

1. Push your code to a Git repository
2. Create a new Netlify site from the repository
3. Configure the environment variables in Netlify
4. Deploy

## License

This project is private and not available for redistribution.
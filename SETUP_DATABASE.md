# Supabase Project Setup Guide

This guide will walk you through setting up your project on Supabase, from creating a project to initializing your database schema. Follow these steps to get started.

## Step 1: Create a Project on Supabase

Create a new project on [Supabase](https://supabase.com). Remember to save your database password securely.

## Step 2: Install Supabase CLI Locally

Install the Supabase CLI on your machine by following the guide [here](https://supabase.com/docs/guides/cli/getting-started). Please note, Docker Desktop is also required on your machine.

## Step 3: Login with Supabase CLI

Use the command below to log in to Supabase CLI:

```bash
supabase login
```

## Step 4: Link Your Project

Link the project you created earlier. Find the instructions here. Use the following command, and your database password will be requested. You can regenerate it if necessary.

```bash
supabase link --project-ref <project-id>
```

## Step 5: Create a New Migration File

Create a new migration file for your database schema:

```bash
supabase migration new init_database_schema
```

## Step 6: Initialize Database Schema

Copy and paste the contents of your schema.sql file into the migration file, then launch the migration with the following command:

```bash
supabase db reset
```

## Step 7: Push Changes

Once the migration is complete, push the changes with:

```bash
supabase db push
```

## Step 8: Configure Your .env File

Make sure to fill in your Supabase API keys in the .env file.
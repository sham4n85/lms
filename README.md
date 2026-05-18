# LearnHub LMS

A self-hosted Learning Management System built with Laravel 11. Manage courses, modules, learners, organisations, and subscriptions — all from a clean browser interface.

![PHP](https://img.shields.io/badge/PHP-8.2-blue) ![Laravel](https://img.shields.io/badge/Laravel-11-red) ![Docker](https://img.shields.io/badge/Docker-ready-blue) ![Port](https://img.shields.io/badge/port-8080-green)

## Features

### Courses & Content
- **Create and manage courses** — title, description, version, framework tags (ISO 27001, NIS2, GDPR, etc.), and publish status
- **Module system** — add text (HTML) or video modules to any course, ordered by position
- **Progress tracking** — per-module completion tracking with a visual progress bar per learner
- **Course completion** — automatically marks a course complete when all modules are done

### Learning Experience
- **Self-enrolment** — learners browse published courses and enrol with one click
- **Sequential module navigation** — previous / next navigation between modules
- **Module completion button** — learner explicitly marks each module complete, progress updates in real time

### User Management
- **Four roles**: Admin, Manager, HR, Learner (powered by Spatie Laravel Permission)
- **Admin** — full access: users, courses, organisations, subscriptions
- **Manager** — create/edit courses, view enrolments and reports
- **HR** — view enrolments and reports, enrol specific users in courses
- **Learner** — browse, enrol, and complete courses

### Organisations & Subscriptions
- **Organisation hierarchy** — parent/child organisations (e.g. group → subsidiary)
- **Subscription management** — attach named plans (Free, Professional, Enterprise) with start/end dates to each organisation
- **Expiry tracking** — subscriptions can be marked active, expired, or cancelled

### Dashboards
- **Admin dashboard** — total users, courses, enrolments, completions; recent user list; quick action buttons
- **Manager/HR dashboard** — enrolment counts and a live enrolment table
- **Learner dashboard** — "My Courses" with progress bars and available courses to enrol in

### Reporting
- **Enrollment report** — full table showing user, organisation, course, status, progress %, started date, completion date

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | PHP 8.2 / Laravel 11 |
| Auth & Roles | Laravel Auth + Spatie Laravel Permission |
| Database | SQLite (zero-config, persisted via Docker volume) |
| Frontend | Blade templates + Tailwind CSS (CDN) |
| Container | Docker (php:8.2-apache) |

## Default Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@lms.local | password | Admin |
| manager@lms.local | password | Manager |
| hr@lms.local | password | HR |
| learner@lms.local | password | Learner |

## Quick Start

### Requirements
- Docker Desktop installed and running

### Run

```bash
git clone https://github.com/sham4n85/lms.git
cd lms
docker compose up -d --build
```

App is available at **http://localhost:8080**

First build takes 5–10 minutes (downloads Laravel, Spatie, runs migrations and seeds). Subsequent starts are instant.

### Stop

```bash
docker compose down
```

Data is persisted in a named Docker volume (`lms_storage`) and survives container restarts.

## Sample Data

The seeder creates three published courses:

| Course | Framework Tags |
|--------|---------------|
| ISO 27001 Fundamentals | ISO 27001, ISMS |
| NIS2 Directive Compliance | NIS2, EU Regulation |
| Cybersecurity Awareness | Awareness, General |

Each course contains 4 text modules with real content.

# LMS Platform — Development Roadmap

**Stack:** NestJS 11 + Prisma 6 (MySQL) + Next.js 15 + Tailwind v4
**Repo:** `github.com/sham4n85/lms-platform`

---

## ✅ Phase 0 — Foundation (DONE)
- [x] Docker Compose (MySQL + API + Web)
- [x] Auth (register, login, JWT, guards, role decorators)
- [x] Users CRUD (list, profile, update)
- [x] Courses CRUD with search/filter/slug lookup
- [x] Database schema (14 tables, Prisma migrations applied)
- [x] Seed data (admin, instructor, student, sample course)
- [x] Frontend: landing, login, register, course listing, course detail, instructor dashboard

---

## Phase 1 — Course Content Management
**Goal:** Full CRUD for sections and lessons, plus lesson viewer frontend.

### Backend
- [ ] Sections module (create/update/delete/reorder within a course)
- [ ] Lessons module (create/update/delete/reorder, content types: text/video/pdf/audio/livestream)
- [ ] Lesson content viewing endpoint (GET /lessons/:id with access check)
- [ ] Lesson progress tracking (mark complete)
- [ ] File upload support for lesson attachments

### Frontend
- [ ] Lesson viewer page (`/course/[slug]/lesson/[lessonId]`)
- [ ] Section management UI in instructor dashboard
- [ ] Lesson content editor (text editor, video URL, PDF upload)
- [ ] Lesson progress UI (mark complete)

---

## Phase 2 — Enrollments & Student Experience
**Goal:** Students can enroll, track progress, see their dashboard.

### Backend
- [ ] Enrollments module (POST enroll, GET my enrollments, GET enrollment progress)
- [ ] Enrollment status tracking (active, completed, expired)
- [ ] Course completion logic

### Frontend
- [ ] Enroll button on course detail page
- [ ] Student dashboard (`/dashboard`) — enrolled courses, progress bars
- [ ] Profile settings page (`/settings`)
- [ ] "My Learning" page showing in-progress/completed courses

---

## Phase 3 — Quiz System
**Goal:** Full quiz builder with multiple question types and attempt tracking.

### Backend
- [ ] Quizzes module (CRUD, link to lesson)
- [ ] Questions module (CRUD per quiz, 8 question types)
- [ ] Quiz Attempt module (submit, score, review)
- [ ] Auto-grading for MCQ/TF/Fill-blank, manual for short answer
- [ ] Passing score logic, max attempts enforcement

### Frontend
- [ ] Quiz builder UI for instructors
- [ ] Quiz takers page for students
- [ ] Quiz result/review page
- [ ] Question type components (MCQ, TF, matching, ordering, etc.)

---

## Phase 4 — Assignments & Gradebook
**Goal:** Students submit work, instructors grade it.

### Backend
- [ ] Assignments module (CRUD, link to lesson)
- [ ] Submission module (submit file/text, re-submit)
- [ ] Grading module (score + feedback, graded status)

### Frontend
- [ ] Assignment management UI for instructors
- [ ] Assignment submission page for students
- [ ] Grading interface for instructors
- [ ] Gradebook view (per student, per course)

---

## Phase 5 — Reviews, Q&A, Course FAQs
**Goal:** Community interaction and social proof.

### Backend
- [ ] Reviews module (create/update/delete, rating + text)
- [ ] Q&A module (questions + answers, upvotes, resolved status)
- [ ] Course FAQs CRUD

### Frontend
- [ ] Review form on course detail page
- [ ] Star rating display + average rating
- [ ] Q&A tab on course page (ask question, answer, upvote)
- [ ] FAQ management for instructors

---

## Phase 6 — Certificates & Content Drip
**Goal:** Automated certificates on completion, scheduled lesson release.

### Backend
- [ ] Certificate template system (HTML template + variables)
- [ ] Certificate issuance (auto-generate on course completion)
- [ ] Certificate verification endpoint
- [ ] Content drip engine (time-interval or sequential release)
- [ ] Drip schedule configuration per course

### Frontend
- [ ] Certificate viewer/download page
- [ ] Public certificate verification page
- [ ] Drip schedule UI in course settings
- [ ] Locked/unlocked lesson indicators for students

---

## Phase 7 — Monetization (Orders, Payments, Bundles, Coupons)
**Goal:** Sell courses with payments, bundles, and coupons.

### Backend
- [ ] Orders module (create, status, history)
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Course bundles (package courses, one price)
- [ ] Coupons module (percentage/fixed, limits, expiry)
- [ ] Revenue sharing (instructor payouts)
- [ ] Subscription/recurring billing

### Frontend
- [ ] Checkout page with payment form
- [ ] Order history page
- [ ] Cart/bundle purchase flow
- [ ] Coupon code input
- [ ] Instructor earnings dashboard

---

## Phase 8 — Analytics, Admin Panel, Email, Polish
**Goal:** Comprehensive management and communication tools.

### Backend
- [ ] Dashboard analytics (enrollments, revenue, completion rates)
- [ ] Student activity log (lesson views, quiz attempts, time spent)
- [ ] Course announcements (create, notify enrolled students)
- [ ] Email integration (Mailchimp, Brevo, etc.)
- [ ] Admin panel endpoints (user management, site settings)

### Frontend
- [ ] Analytics dashboard with charts
- [ ] Admin panel (users, courses, orders, settings)
- [ ] Announcement composer + email templates
- [ ] White-label settings (branding, colors, logo)

---

## Phase 9 — AI Features & Advanced
**Goal:** AI-powered course creation and advanced platform features.

### Backend
- [ ] AI course outline generation (LLM integration)
- [ ] AI lesson content draft generation
- [ ] AI quiz question generation
- [ ] SCORM compliance
- [ ] SSO/SAML integration
- [ ] Multi-language support

### Frontend
- [ ] AI course builder wizard
- [ ] AI content assistant in editor
- [ ] SCORM import/export UI
- [ ] Language switcher

---

## Technical Debt & Cross-Cutting
- [ ] Add comprehensive test suite (unit + e2e)
- [ ] Add Swagger/OpenAPI documentation
- [ ] Rate limiting + CSRF protection
- [ ] File upload to S3/CDN
- [ ] Pagination on all list endpoints
- [ ] Loading skeletons + error boundaries on frontend
- [ ] Proper error handling + logging
- [ ] CI/CD pipeline (GitHub Actions)

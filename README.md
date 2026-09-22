# JobHub – Job Portal Management System

JobHub is a simple web-based Job Portal Management System developed to connect **Candidates** and **Recruiters**.

The project demonstrates important web development concepts such as **Authentication, CRUD Operations, API Integration, DOM Manipulation, and Entity Relationships**.

---

## 📌 Project Overview

JobHub provides separate functionalities for Candidates and Recruiters.

### 👤 Candidate

- Register and Login
- Search available jobs
- Filter jobs
- View job details
- Apply for jobs
- View submitted applications
- Track application status

### 🏢 Recruiter

- Login
- Create job postings
- View job postings
- Update job postings
- Delete job postings
- View candidate applications
- Update application status

---

## 🎯 Objectives

- Build a simple job portal using frontend web technologies.
- Implement basic authentication.
- Demonstrate CRUD operations.
- Establish relationships between Users, Jobs, and Applications.
- Understand API communication using Axios and JSON Server.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML | Webpage structure |
| CSS | Styling and layout |
| JavaScript | Application logic |
| Axios | API communication |
| JSON Server | REST API / Backend |
| LocalStorage | Maintaining logged-in user |
| db.json | Data storage |

---

## 🏗️ Project Architecture

```text
Frontend
HTML + CSS + JavaScript
          |
          ↓
        Axios
          |
          ↓
    JSON Server API
          |
          ↓
       db.json
          |
    ┌─────┼─────────┐
    ↓     ↓         ↓
  Users  Jobs  Applications

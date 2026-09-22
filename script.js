const API = "http://localhost:3000";
// LOGIN
async function login() {
    const email =
        document.getElementById("loginEmail").value;
    const password =
        document.getElementById("loginPassword").value;
    const role =
        document.getElementById("loginRole").value;
    const response = await axios.get(
        `${API}/users?email=${email}&password=${password}&role=${role}`
    );
    if (response.data.length === 0) {
        document.getElementById("loginMessage")
            .innerText = "Invalid email, password or role";
        return;
    }
    const user = response.data[0];
    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );
    window.location.href = "dashboard.html";
}
// REGISTER
async function register() {
    const name =
        document.getElementById("registerName").value;
    const email =
        document.getElementById("registerEmail").value;
    const password =
        document.getElementById("registerPassword").value;
    const role =
        document.getElementById("registerRole").value;
    const existing =
        await axios.get(
            `${API}/users?email=${email}`
        );
    if (existing.data.length > 0) {
        document.getElementById("registerMessage")
            .innerText = "Email already exists";
        return;
    }
    await axios.post(
        `${API}/users`,
        {
            name,
            email,
            password,
            role
        }
    );
    document.getElementById("registerMessage")
        .innerText = "Registration successful";
}
// GET CURRENT USER
function getUser() {
    return JSON.parse(
        localStorage.getItem("user")
    );
}
// DASHBOARD
const user = getUser();
if (document.getElementById("welcome") && user) {
    document.getElementById("welcome")
        .innerText =
        `Welcome, ${user.name}`;
    if (user.role === "candidate") {
        document.getElementById(
            "candidateSection"
        ).style.display = "block";
        document.getElementById(
            "recruiterSection"
        ).style.display = "none";
        loadJobs();
    } else {
        document.getElementById(
            "candidateSection"
        ).style.display = "none";
        document.getElementById(
            "recruiterSection"
        ).style.display = "block";
        loadRecruiterJobs();
        loadRecruiterApplications();
    }
}
// LOAD JOBS FOR CANDIDATE
async function loadJobs() {
    const search =
        document.getElementById("search").value
        .toLowerCase();
    const location =
        document.getElementById(
            "locationFilter"
        ).value;
    const response =
        await axios.get(`${API}/jobs`);
    let jobs = response.data;
    jobs = jobs.filter(job => {
        const matchSearch =
            job.title.toLowerCase().includes(search) ||
            job.company.toLowerCase().includes(search);
        const matchLocation =
            location === "" ||
            job.location === location;
        return matchSearch && matchLocation;
    });
    const list =
        document.getElementById("jobList");
    list.innerHTML = "";
    jobs.forEach(job => {
        list.innerHTML += `
        <div class="job-card">
            <h3>${job.title}</h3>
            <p>
                <b>Company:</b>
                ${job.company}
            </p>
            <p>
                <b>Location:</b>
                ${job.location}
            </p>
            <p>
                <b>Salary:</b>
                ${job.salary}
            </p>
            <p>
                <b>Experience:</b>
                ${job.experience}
            </p>
            <p>
                <b>Skills:</b>
                ${job.skills}
            </p>
            <p>
                ${job.description}
            </p>
            <button
                onclick="applyJob('${job.id}')">
                Apply
            </button>
        </div>
        `;
    });
}
// APPLY FOR JOB

async function applyJob(jobId) {

    const user = getUser();


    const existing =
        await axios.get(
            `${API}/applications?jobId=${jobId}&userId=${user.id}`
        );


    if (existing.data.length > 0) {

        alert("You already applied for this job");

        return;
    }


    await axios.post(
        `${API}/applications`,
        {

            jobId: jobId,

            userId: user.id,

            resume: "resume.pdf",

            status: "Applied",

            appliedDate:
                new Date().toISOString().split("T")[0]

        }
    );


    alert("Application submitted");

}
// ADD JOB

const jobForm =
    document.getElementById("jobForm");


if (jobForm) {

    jobForm.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();


            await axios.post(
                `${API}/jobs`,
                {

                    title:
                        document.getElementById(
                            "jobTitle"
                        ).value,

                    company:
                        document.getElementById(
                            "company"
                        ).value,

                    location:
                        document.getElementById(
                            "jobLocation"
                        ).value,

                    salary:
                        document.getElementById(
                            "salary"
                        ).value,

                    experience:
                        document.getElementById(
                            "experience"
                        ).value,

                    skills:
                        document.getElementById(
                            "skills"
                        ).value,

                    description:
                        document.getElementById(
                            "description"
                        ).value,

                    postedDate:
                        new Date()
                        .toISOString()
                        .split("T")[0]

                }
            );


            alert("Job created successfully");

            jobForm.reset();

            loadRecruiterJobs();

        }
    );

}

// RECRUITER - VIEW JOBS

async function loadRecruiterJobs() {

    const response =
        await axios.get(`${API}/jobs`);


    const list =
        document.getElementById(
            "recruiterJobs"
        );


    if (!list) return;


    list.innerHTML = "";


    response.data.forEach(job => {

        list.innerHTML += `

        <div class="job-card">

            <h3>${job.title}</h3>

            <p>${job.company}</p>

            <p>${job.location}</p>

            <p>${job.salary}</p>

            <button
                class="edit"
                onclick="editJob('${job.id}')">
                Edit
            </button>

            <button
                class="delete"
                onclick="deleteJob('${job.id}')">
                Delete
            </button>

        </div>

        `;

    });

}

// UPDATE JOB

async function editJob(id) {

    const title =
        prompt("Job Title:");

    const company =
        prompt("Company:");

    const location =
        prompt("Location:");

    const salary =
        prompt("Salary:");

    const experience =
        prompt("Experience:");

    const skills =
        prompt("Skills:");

    const description =
        prompt("Description:");


    await axios.patch(
        `${API}/jobs/${id}`,
        {
            title,
            company,
            location,
            salary,
            experience,
            skills,
            description
        }
    );


    alert("Job updated");

    loadRecruiterJobs();

}



// =================================================
// DELETE JOB
// =================================================

async function deleteJob(id) {

    if (!confirm("Delete this job?")) {
        return;
    }


    await axios.delete(
        `${API}/jobs/${id}`
    );


    alert("Job deleted");

    loadRecruiterJobs();

}



// =================================================
// RECRUITER - VIEW APPLICATIONS
// =================================================

async function loadRecruiterApplications() {

    const response =
        await axios.get(
            `${API}/applications`
        );


    const jobs =
        await axios.get(
            `${API}/jobs`
        );


    const users =
        await axios.get(
            `${API}/users`
        );


    const box =
        document.getElementById(
            "recruiterApplications"
        );


    if (!box) return;


    box.innerHTML = "";


    response.data.forEach(application => {

        const job =
            jobs.data.find(
                j => j.id === application.jobId
            );


        const applicant =
            users.data.find(
                u => u.id === application.userId
            );


        box.innerHTML += `

        <div class="application-card">

            <b>Candidate:</b>
            ${applicant ? applicant.name : "Unknown"}

            <br>

            <b>Job:</b>
            ${job ? job.title : "Unknown"}

            <br>

            <b>Status:</b>
            ${application.status}

            <br><br>

            <select
                onchange="
                    changeStatus(
                        '${application.id}',
                        this.value
                    )
                ">

                <option
                    ${application.status === "Applied"
                        ? "selected" : ""}>
                    Applied
                </option>

                <option
                    ${application.status === "Under Review"
                        ? "selected" : ""}>
                    Under Review
                </option>

                <option
                    ${application.status === "Shortlisted"
                        ? "selected" : ""}>
                    Shortlisted
                </option>

                <option
                    ${application.status === "Interview"
                        ? "selected" : ""}>
                    Interview
                </option>

                <option
                    ${application.status === "Selected"
                        ? "selected" : ""}>
                    Selected
                </option>
                <option
                    ${application.status === "Rejected"
                        ? "selected" : ""}>
                    Rejected
                </option>
            </select>
        </div>
        `;
    });
}
// =================================================
// CHANGE APPLICATION STATUS
// =================================================
async function changeStatus(id, status) {
    await axios.patch(
        `${API}/applications/${id}`,
        {
            status: status
        }
    );
    alert("Application status updated");
}
// =================================================
// CANDIDATE APPLICATIONS
// =================================================
async function loadMyApplications() {
    const box =
        document.getElementById(
            "myApplications"
        );
    if (!box) return;
    const user = getUser();
    const response =
        await axios.get(
            `${API}/applications?userId=${user.id}`
        );
    const jobs =
        await axios.get(
            `${API}/jobs`
        );
    box.innerHTML = "";
    response.data.forEach(application => {
        const job =
            jobs.data.find(
                j => j.id === application.jobId
            );
        box.innerHTML += `
        <div class="application-card">
            <h3>
                ${job ? job.title : "Job"}
            </h3>
            <p>
                Company:
                ${job ? job.company : ""}
            </p>
            <p>
                Status:
                <b>${application.status}</b>
            </p>
            <p>
                Applied Date:
                ${application.appliedDate}
            </p>
        </div>
        `;
    });
}
loadMyApplications();
// =================================================
// LOGOUT
// =================================================
function logout() {
    localStorage.removeItem("user");
}
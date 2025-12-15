const API_URL = "http://localhost:5000/api/issues";

/* Submit Issue */
const form = document.getElementById("issueForm");
if (form) {
    form.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = new FormData(form);

        await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        alert("Issue submitted");
        form.reset();
    });
}

/* Load Issues */
async function loadIssues() {
    const res = await fetch(API_URL);
    const issues = await res.json();
    displayIssues(issues);
}

/* Display Issues */
function displayIssues(issues) {
    const container = document.getElementById("issues");
    container.innerHTML = "";

    const isAdmin = location.pathname.includes("admin");

    issues.forEach(issue => {
        const div = document.createElement("div");
        div.className = "issue";

        // Format date & time
        const createdDate = new Date(issue.createdAt);
        const formattedDate = createdDate.toLocaleDateString();
        const formattedTime = createdDate.toLocaleTimeString();

        div.innerHTML = `
      <h4>${issue.title}</h4>
      <p>${issue.description}</p>

      <p><b>Category:</b> ${issue.category}</p>
      <p><b>Ward:</b> ${issue.ward}</p>
      <p><b>Address:</b> ${issue.address}</p>
      <p><b>Status:</b> ${issue.status}</p>
      <p><b>Votes:</b> ${issue.votes}</p>

      <!-- 📅 DATE & TIME -->
      <p><b>Submitted On:</b> ${formattedDate} at ${formattedTime}</p>

      ${issue.image
                ? `<img src="http://localhost:5000/uploads/${issue.image}">`
                : ""
            }
    `;

        // User vote button
        if (!isAdmin) {
            div.innerHTML += `
        <button onclick="vote('${issue._id}', this)">👍 Vote</button>
      `;
        }

        // Admin controls
        if (isAdmin) {
            div.innerHTML += `
        <select onchange="updateStatus('${issue._id}', this.value)">
          <option ${issue.status === "Pending" ? "selected" : ""}>Pending</option>
          <option ${issue.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option ${issue.status === "Resolved" ? "selected" : ""}>Resolved</option>
        </select>
        <button onclick="deleteIssue('${issue._id}')">Delete</button>
      `;
        }

        container.appendChild(div);
    });
}


/* Vote Toggle */
async function vote(id, btn) {
    const voted = btn.classList.toggle("voted");

    await fetch(`${API_URL}/${id}/vote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: voted ? "up" : "down" })
    });

    btn.innerText = voted ? "Unvote" : "Vote";
}

/* Update Status */
async function updateStatus(id, status) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });
    loadIssues();
}

/* Delete */
async function deleteIssue(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadIssues();
}

if (document.getElementById("issues")) {
    loadIssues();
}
function applyFilters() {
    const ward = document.getElementById("wardFilter")?.value;
    const status = document.getElementById("statusFilter")?.value;
    const category = document.getElementById("categoryFilter")?.value;
    const sort = document.getElementById("sortFilter")?.value;
    const search = document.getElementById("searchInput")?.value;

    let query = [];

    if (ward) query.push(`ward=${ward}`);
    if (status) query.push(`status=${status}`);
    if (category) query.push(`category=${encodeURIComponent(category)}`);
    if (sort) query.push(`sort=${sort}`);
    if (search) query.push(`search=${encodeURIComponent(search)}`);

    const url =
        query.length > 0
            ? `${API_URL}?${query.join("&")}`
            : API_URL;

    fetch(url)
        .then(res => res.json())
        .then(data => displayIssues(data));
}

function clearFilters() {
    ["wardFilter", "statusFilter", "categoryFilter", "sortFilter", "searchInput"]
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

    loadIssues();
}
const titleInput = document.getElementById("issueTitle");
const categoryInput = document.getElementById("category");
const wardInput = document.getElementById("ward");
const warningBox = document.getElementById("duplicateWarning");
const submitBtn = document.getElementById("submitBtn");

let duplicateFound = false;

async function checkDuplicate() {
    if (!titleInput || !categoryInput || !wardInput) return;

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const ward = wardInput.value;

    duplicateFound = false;
    warningBox.innerHTML = "";

    if (title.length < 3 || !category || !ward) return;

    const res = await fetch(
        `${API_URL}/search/live?q=${encodeURIComponent(title)}&ward=${ward}&category=${encodeURIComponent(category)}`
    );

    const issues = await res.json();

    if (issues.length > 0) {
        duplicateFound = true;


        warningBox.innerHTML = `
          <p style="color:red;font-weight:bold;">
            ⚠ Similar issue already reported in this ward & category
          </p>
          ${issues.map(i => `
            <div>
              <b>${i.title}</b>
              <small> (Ward ${i.ward}, ${i.category})</small>
            </div>
          `).join("")}
        `;
    }
}

titleInput?.addEventListener("keyup", checkDuplicate);
categoryInput?.addEventListener("change", checkDuplicate);
wardInput?.addEventListener("input", checkDuplicate);

/* ================= USER ANALYTICS ================= */
async function loadAnalytics() {
    const totalEl = document.getElementById("totalCount");
    if (!totalEl) return; // run only on analytics page

    const res = await fetch(API_URL);
    const issues = await res.json();

    document.getElementById("totalCount").innerText = issues.length;

    document.getElementById("pendingCount").innerText =
        issues.filter(i => i.status === "Pending").length;

    document.getElementById("progressCount").innerText =
        issues.filter(i => i.status === "In Progress").length;

    document.getElementById("resolvedCount").innerText =
        issues.filter(i => i.status === "Resolved").length;

    // Category analytics
    const categoryMap = {};
    issues.forEach(i => {
        categoryMap[i.category] = (categoryMap[i.category] || 0) + 1;
    });

    const ul = document.getElementById("categoryStats");
    ul.innerHTML = "";

    Object.keys(categoryMap).forEach(cat => {
        const li = document.createElement("li");
        li.innerText = `${cat}: ${categoryMap[cat]}`;
        ul.appendChild(li);
    });
}

// Auto-load analytics page
loadAnalytics();

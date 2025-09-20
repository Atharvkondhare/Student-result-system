const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");

let editRoll = null; // track the student being edited

async function loadStudents() {
  const res = await fetch("/students");
  const students = await res.json();

  table.innerHTML = "";
  students.forEach(s => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.name}</td>
      <td>${s.roll}</td>
      <td>${s.marks.math}</td>
      <td>${s.marks.physics}</td>
      <td>${s.marks.chemistry}</td>
      <td>${s.total}</td>
      <td>${s.percentage}</td>
      <td>${s.grade}</td>
      <td>
        <button onclick='editStudent("${s.roll}","${s.name}",${s.marks.math},${s.marks.physics},${s.marks.chemistry})'>Edit</button>
        <button onclick='deleteStudent("${s.roll}")'>Delete</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// Add or Update student
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const math = Number(document.getElementById("math").value);
  const physics = Number(document.getElementById("physics").value);
  const chemistry = Number(document.getElementById("chemistry").value);

  if ([math, physics, chemistry].some(m => m < 0 || m > 100)) {
    alert("Marks must be 0-100");
    return;
  }

  const method = editRoll ? "PUT" : "POST";
  const url = editRoll ? `/students/${editRoll}` : "/students";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, roll, marks: { math, physics, chemistry } })
  });

  const data = await res.json();
  if (data.error) alert(data.error);
  else {
    form.reset();
    editRoll = null;
    document.getElementById("roll").disabled = false; // ✅ re-enable roll input
    loadStudents();
  }
});

// Edit student
function editStudent(roll, name, math, physics, chemistry) {
  document.getElementById("name").value = name;
  document.getElementById("roll").value = roll;
  document.getElementById("roll").disabled = true; // disable roll while editing
  document.getElementById("math").value = math;
  document.getElementById("physics").value = physics;
  document.getElementById("chemistry").value = chemistry;
  editRoll = roll;
}

// Delete student
async function deleteStudent(roll) {
  if (!confirm("Are you sure?")) return;
  await fetch(`/students/${roll}`, { method: "DELETE" });
  loadStudents();
}

// Initial load
loadStudents();

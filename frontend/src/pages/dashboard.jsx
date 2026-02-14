import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const [orgs, setOrgs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeOrg, setActiveOrgs] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [activeProject, setActiveProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const { logout } = useAuth();

  const fetchOrgs = async () => {
    const res = await api.get("/org");
    setOrgs(res.data);
  };
  const fetchProjects = async () => {
    const res = await api.get("/proj");
    setProjects(res.data.data);
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  useEffect(() => {
    if (activeOrg) {
      fetchProjects();
    }
  }, [activeOrg]);

  const fetchTasks = async (projectId) => {
    const res = await api.get(`/tasks?projectId=${projectId}`);
    setTasks(res.data.data);
  };

  const selectOrg = (org) => {
    localStorage.setItem("orgId", org.id);
    setActiveOrgs(org);
  };

  // const selectOrg = (org) => {
  //   localStorage.setItem("orgId", org.id);
  //   alert(`Active org set to ${org.name}`);
  // };

  const createProject = async () => {
    if (!newProjectName) return;

    await api.post("/proj", {
      name: newProjectName,
    });

    setNewProjectName("");
    fetchProjects();
  };

  const deleteProject = async (id) => {
    await api.delete(`/proj/${id}`);
    fetchProjects();
  };

  return (
    <div style={styles.container}>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>

      <hr />

      <h3>Your Organizations</h3>
      <ul style={styles.list}>
        {orgs.map((org) => (
          <li key={org.id}>
            <strong>{org.name}</strong> ({org.role})
            <button onClick={() => selectOrg(org)}>Select</button>
          </li>
        ))}
      </ul>

      {activeOrg && (
        <>
          <hr />
          <h3>Projects in {activeOrg.name}</h3>

          <div style={styles.createBox}>
            <input
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <button onClick={createProject}>Create</button>
          </div>

          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <span
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                  onClick={() => {
                    setActiveProject(project);
                    fetchTasks(project.id);
                  }}
                >
                  {project.name}
                </span>
                <button
                  style={{ marginLeft: 10 }}
                  onClick={() => deleteProject(project.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          {activeProject && (
            <>
              <hr />
              <h3>Tasks in {activeProject.name}</h3>

              <div style={styles.createBox}>
                <input
                  placeholder="New task title"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <button
                  onClick={async () => {
                    if (!newTask) return;

                    await api.post("/tasks", {
                      title: newTask,
                      projectId: activeProject.id,
                    });

                    setNewTask("");
                    fetchTasks(activeProject.id);
                  }}
                >
                  Create Task
                </button>
              </div>

              <ul>
                {tasks.map((task) => (
                  <li key={task.id}>
                    {task.title} — {task.status}
                    <button
                      style={{ marginLeft: 10 }}
                      onClick={async () => {
                        await api.patch(`/tasks/${task.id}`, {
                          status:
                            task.status === "TODO"
                              ? "IN_PROGRESS"
                              : task.status === "IN_PROGRESS"
                                ? "DONE"
                                : "TODO",
                        });
                        fetchTasks(activeProject.id);
                      }}
                    >
                      Advance Status
                    </button>
                    <button
                      style={{ marginLeft: 10 }}
                      onClick={async () => {
                        await api.delete(`/tasks/${task.id}`);
                        fetchTasks(activeProject.id);
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  list: { display: "flex", flexDirection: "column", gap: 20 },
  container: { maxWidth: 700, margin: "40px auto" },
  createBox: { display: "flex", gap: 100, marginBottom: 10 },
};

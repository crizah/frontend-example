import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";

export function DashBoard() {
  const navigate = useNavigate();

  const [createdAt, setCreatedAt] = useState("");
  const [notes, setNotes] = useState([]);      // always array
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // profile
  useEffect(() => {
    axios
      .get("http://localhost:8081/profile", { withCredentials: true })
      .then(res => setCreatedAt(res.data.user))
      .catch(() => navigate("/"));
  }, [navigate]);

  // read notes
  useEffect(() => {
    axios
      .get("http://localhost:8081/notes", { withCredentials: true })
      .then(res => setNotes(Array.isArray(res.data) ? res.data : []));
  }, []);

  // create
  const addNote = async () => {
    if (!text.trim()) return;

    const res = await axios.post(
      "http://localhost:8081/notes",
      { text },
      { withCredentials: true }
    );

    setNotes([...notes, res.data]);
    setText("");
  };

  // update
  const updateNote = async () => {
    await axios.put(
      `http://localhost:8081/notes?id=${editId}`,
      { text: editText },
      { withCredentials: true }
    );

    setNotes(
      notes.map(n =>
        n._id === editId ? { ...n, text: editText } : n
      )
    );

    setEditId(null);
    setEditText("");
  };

  // delete
  const deleteNote = async (id) => {
    await axios.delete(
      `http://localhost:8081/notes?id=${id}`,
      { withCredentials: true }
    );

    setNotes(notes.filter(n => n._id !== id));
  };

  const logout = async () => {
    await axios.get("http://localhost:8081/logout", {
      withCredentials: true
    });
    navigate("/");
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-2">Dashboard</h1>
      <p className="mb-4">Account created at: {createdAt}</p>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="New note"
        />
        <button onClick={addNote} className="bg-blue-500 text-white px-4">
          Add
        </button>
      </div>

      {notes.map(n => (
        <div key={n._id} className="border p-2 mb-2 flex gap-2">
          {editId === n._id ? (
            <>
              <input
                className="border p-1 flex-1"
                value={editText}
                onChange={e => setEditText(e.target.value)}
              />
              <button onClick={updateNote} className="bg-green-500 text-white px-2">
                Save
              </button>
              <button
                onClick={() => setEditId(null)}
                className="bg-gray-400 text-white px-2"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span className="flex-1">{n.text}</span>
              <button
                onClick={() => {
                  setEditId(n._id);
                  setEditText(n.text);
                }}
                className="bg-yellow-400 px-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteNote(n._id)}
                className="bg-red-500 text-white px-2"
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}

      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}

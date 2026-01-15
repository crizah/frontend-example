import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";

export function DashBoard() {
  const navigate = useNavigate();
  // const x = process.env.REACT_APP_BACKEND_URL;
  const x = window.RUNTIME_CONFIG.BACKEND_URL;


  const [createdAt, setCreatedAt] = useState("");
  const [notes, setNotes] = useState([]);      // always array
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // profile
  useEffect(() => {
    axios
      .get(`${x}/profile`, { withCredentials: true })
      .then(res => setCreatedAt(res.data.user))
      .catch(() => navigate("/"));
  }, [navigate]);

  // read notes
  useEffect(() => {
    axios
      .get(`${x}/notes`, { withCredentials: true })
      .then(res => setNotes(Array.isArray(res.data) ? res.data : []));
  }, []);

  // create
  const addNote = async () => {
    if (!text.trim()) return;

    const res = await axios.post(
      `${x}/notes`,
      { text },
      { withCredentials: true }
    );

    setNotes([...notes, res.data]);
    setText("");
  };

  // update
  const updateNote = async () => {
    await axios.put(
      `${x}/notes?id=${editId}`,
      { text: editText },
      { withCredentials: true }
    );

    setNotes(
      notes.map(n =>
        n._id.toString() === editId ? { ...n, text: editText } : n
      )
    );

    setEditId(null);
    setEditText("");
  };

  // delete
  const deleteNote = async (id) => {
    await axios.delete(
      `${x}/notes?id=${id}`,
      { withCredentials: true }
    );

    setNotes(notes.filter(n => n._id.toString() !== id));
  };

  const logout = async () => {
    await axios.get(`${x}/logout`, {
      withCredentials: true
    });
    navigate("/");
  };

return (
  <div className="min-h-screen bg-slate-950 relative overflow-hidden">
    {/* Animated background */}
    <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>

    <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
      {/* Header Card */}
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-800/50 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Account created: {createdAt}
            </p>
          </div>
          <button
            onClick={logout}
            className="relative overflow-hidden px-6 py-2 rounded-lg font-semibold text-white transition-all duration-300 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Add Note Card */}
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-800/50 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Note
        </h2>
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-25 transition-opacity"></div>
            <input
              className="relative w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What's on your mind?"
            />
          </div>
          <button 
            onClick={addNote}
            className="relative overflow-hidden px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative">Add</span>
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Your Notes
        </h2>
        {notes.map(n => (
          <div key={n._id} className="bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-xl p-4 border border-slate-800/50 transition-all duration-300 hover:border-slate-700/50">
            {editId === n._id ? (
              <div className="flex gap-3 items-center">
                <div className="relative flex-1 group">
                  <input
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all duration-300"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                  />
                </div>
                <button
                  onClick={updateNote}
                  className="relative overflow-hidden px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative">Save</span>
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-3 items-center">
                <span className="flex-1 text-white text-lg">{n.text}</span>
                <button
                  onClick={() => {
                    setEditId(n._id);
                    setEditText(n.text);
                  }}
                  className="relative overflow-hidden px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </span>
                </button>
                <button
                  onClick={() => deleteNote(n._id)}
                  className="relative overflow-hidden px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
}
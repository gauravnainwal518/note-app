import React, { useEffect, useState } from "react";
import icon from "../assets/icon.svg";
import { AiOutlineDelete } from "react-icons/ai";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Note {
  _id: string;
  title: string;
  content: string;
}

const DashboardPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [noteText, setNoteText] = useState("");
  const navigate = useNavigate();

  // Fetch user info and notes
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserAndNotes = async () => {
      try {
        const userRes = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);

        const notesRes = await api.get("/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(notesRes.data);
      } catch (error) {
        console.error(error);
        alert("Error fetching data. Please login again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndNotes();
  }, [navigate]);

  const handleCreate = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!noteText.trim()) return alert("Note cannot be empty");

    try {
      const res = await api.post(
        "/notes",
        { title: noteText, content: noteText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) => [...prev, res.data]);
      setNoteText("");
    } catch (error) {
      console.error(error);
      alert("Error creating note");
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      await api.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting note");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src={icon} alt="Logo" className="w-8 h-8 mr-2" />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <button onClick={handleSignOut} className="text-blue-500 font-medium">
          Sign Out
        </button>
      </div>

      {/* Welcome Card */}
      <div className="border rounded-md shadow-sm p-4 mb-4">
        <p className="text-lg font-bold">Welcome, {user?.name || "User"}!</p>
        <p className="text-gray-600 text-sm">Email: {user?.email || "N/A"}</p>
      </div>

      {/* Create Note Input */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter note title"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-500"
        />
        <button
          onClick={handleCreate}
          className="ml-2 bg-blue-500 text-white px-4 rounded-md hover:bg-blue-600"
        >
          Create
        </button>
      </div>

      {/* Notes List */}
      <div>
        <h2 className="font-semibold mb-2">Notes</h2>
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note._id}
              className="flex justify-between items-center border rounded-md p-2"
            >
              <span>{note.title}</span>
              <button onClick={() => handleDelete(note._id)}>
                <AiOutlineDelete size={20} className="text-gray-600" />
              </button>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-gray-500 text-sm">No notes yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

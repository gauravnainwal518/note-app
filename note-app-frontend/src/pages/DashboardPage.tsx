import React, { useState } from "react";
import icon from "../assets/icon.svg";
import { AiOutlineDelete } from "react-icons/ai";

interface Note {
  id: number;
  text: string;
}

const DashboardPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, text: "Note 1" },
    { id: 2, text: "Note 2" },
  ]);

  const handleDelete = (id: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleCreate = () => {
    const newId = notes.length + 1;
    setNotes((prev) => [...prev, { id: newId, text: `Note ${newId}` }]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src={icon} alt="Logo" className="w-8 h-8 mr-2" />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <button className="text-blue-500 font-medium">Sign Out</button>
      </div>

      {/* Welcome Card */}
      <div className="border rounded-md shadow-sm p-4 mb-4">
        <p className="text-lg font-bold">Welcome, Jonas Kahnwald!</p>
        <p className="text-gray-600 text-sm">Email: xxxxxx@xxxx.com</p>
      </div>

      {/* Create Note Button */}
      <button
        onClick={handleCreate}
        className="w-full bg-blue-500 text-white py-2 rounded-md mb-4 hover:bg-blue-600"
      >
        Create Note
      </button>

      {/* Notes List */}
      <div>
        <h2 className="font-semibold mb-2">Notes</h2>
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex justify-between items-center border rounded-md p-2"
            >
              <span>{note.text}</span>
              <button onClick={() => handleDelete(note.id)}>
                <AiOutlineDelete size={20} className="text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

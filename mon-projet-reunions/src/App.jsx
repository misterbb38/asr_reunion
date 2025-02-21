// frontend/src/App.jsx
import React, { useEffect, useState } from "react";
import MeetingForm from "./components/MeetingForm";
import MeetingList from "./components/MeetingList";

const API_URL = import.meta.env.VITE_API_URL + "/meetings";

function App() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger la liste au démarrage
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setMeetings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur fetch meetings:", err);
        setLoading(false);
      });
  }, []);

  // Créer (POST)
  const handleAddMeeting = async (newMeeting) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMeeting),
      });
      const saved = await res.json();
      setMeetings((prev) => [...prev, saved]);
    } catch (error) {
      console.error("Erreur ajout:", error);
    }
  };

  // Mettre à jour (PUT)
  const handleUpdateMeeting = async (updatedMeeting) => {
    try {
      const res = await fetch(`${API_URL}/${updatedMeeting._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMeeting),
      });
      const saved = await res.json();
      // Met à jour dans le state
      setMeetings((prev) => prev.map((m) => (m._id === saved._id ? saved : m)));
    } catch (error) {
      console.error("Erreur mise à jour:", error);
    }
  };

  // Supprimer (DELETE)
  const handleDeleteMeeting = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setMeetings((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Chargement en cours...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container max-w-3xl mx-auto bg-white p-6 rounded shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Gestion des Réunions (Mongo + Sous-Listes + Édition)
        </h1>

        <MeetingForm onAddMeeting={handleAddMeeting} />

        <hr className="my-6" />

        <MeetingList
          meetings={meetings}
          onUpdateMeeting={handleUpdateMeeting}
          onDeleteMeeting={handleDeleteMeeting}
        />
      </div>
    </div>
  );
}

export default App;

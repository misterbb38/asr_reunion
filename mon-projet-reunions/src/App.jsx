// src/App.jsx
import React, { useEffect, useState } from "react";
import MeetingForm from "./components/MeetingForm";
import MeetingList from "./components/MeetingList";

// URL de l'API JSON Server
const API_URL = "http://localhost:3001/meetings";

function App() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les réunions au démarrage
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setMeetings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des réunions :", err);
        setLoading(false);
      });
  }, []);

  // Ajouter une réunion via POST
  const handleAddMeeting = async (newMeeting) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMeeting),
      });
      const savedMeeting = await response.json();
      setMeetings((prev) => [...prev, savedMeeting]);
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  // Mettre à jour une réunion existante (EDIT) via PUT (ou PATCH)
  const handleUpdateMeeting = async (updatedMeeting) => {
    try {
      const response = await fetch(`${API_URL}/${updatedMeeting.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMeeting),
      });
      const savedMeeting = await response.json();

      // Mettre à jour l'état local
      setMeetings((prev) =>
        prev.map((m) => (m.id === savedMeeting.id ? savedMeeting : m))
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  // Tri optionnel par date
  const sortedMeetings = [...meetings].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  if (loading) {
    return <p className="text-center mt-4">Chargement en cours...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-3xl bg-white p-6 rounded shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Gestion des Réunions
        </h1>

        {/* Formulaire pour créer une nouvelle réunion */}
        <MeetingForm onAddMeeting={handleAddMeeting} />

        <hr className="my-6" />

        {/* Liste des réunions + possibilité d'édition */}
        <MeetingList
          meetings={sortedMeetings}
          onUpdateMeeting={handleUpdateMeeting}
        />
      </div>
    </div>
  );
}

export default App;

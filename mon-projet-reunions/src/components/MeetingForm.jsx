// frontend/src/components/MeetingForm.jsx
import React, { useState } from "react";

function MeetingForm({ onAddMeeting }) {
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  // agenda = [ { text: string, subItems: [ { text: string }, ...] }, ...]
  const [agenda, setAgenda] = useState([]);

  const [newAgendaText, setNewAgendaText] = useState(""); // pour un item principal
  const [newSubItemText, setNewSubItemText] = useState(""); // pour un sous-item
  const [parentIndex, setParentIndex] = useState(null); // index de l'item parent

  // Ajouter un item principal
  const handleAddAgendaItem = () => {
    const trimmed = newAgendaText.trim();
    if (!trimmed) return;
    setAgenda((prev) => [...prev, { text: trimmed, subItems: [] }]);
    setNewAgendaText("");
  };

  // Ajouter un sous-item
  const handleAddSubItem = () => {
    const trimmed = newSubItemText.trim();
    if (!trimmed || parentIndex === null) return;
    setAgenda((prev) => {
      const copy = [...prev];
      copy[parentIndex] = {
        ...copy[parentIndex],
        subItems: [...copy[parentIndex].subItems, { text: trimmed }],
      };
      return copy;
    });
    setNewSubItemText("");
    setParentIndex(null);
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !title) {
      alert("Veuillez renseigner la date et le titre.");
      return;
    }
    // Construire l'objet Meeting
    const newMeeting = {
      date,
      title,
      summary,
      agenda,
    };
    onAddMeeting(newMeeting);

    // Reset
    setDate("");
    setTitle("");
    setSummary("");
    setAgenda([]);
    setNewAgendaText("");
    setNewSubItemText("");
    setParentIndex(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Date */}
      <div>
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          className="border p-2 w-full rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">Titre</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Réunion du Comité"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Ordre du jour (Items + Sous-items) */}
      <div>
        <label className="block mb-1 font-medium">Ordre du jour</label>
        {/* Ajouter un item principal */}
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Ajouter un point principal..."
            value={newAgendaText}
            onChange={(e) => setNewAgendaText(e.target.value)}
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleAddAgendaItem}
          >
            + Item
          </button>
        </div>

        {/* Ajouter un sous-item */}
        <div className="flex gap-2 mb-4">
          <select
            className="border p-2 rounded"
            value={parentIndex ?? ""}
            onChange={(e) =>
              setParentIndex(
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
          >
            <option value="">Choisir item parent</option>
            {agenda.map((item, idx) => (
              <option key={idx} value={idx}>
                {item.text}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Sous-point..."
            value={newSubItemText}
            onChange={(e) => setNewSubItemText(e.target.value)}
          />
          <button
            type="button"
            className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
            onClick={handleAddSubItem}
          >
            + Sous-item
          </button>
        </div>

        {/* Aperçu de la structure */}
        <ul className="list-disc list-inside space-y-1">
          {agenda.map((item, idx) => (
            <li key={idx} className="ml-4">
              <b>{item.text}</b>
              {item.subItems && item.subItems.length > 0 && (
                <ul className="list-circle list-inside ml-6 mt-1">
                  {item.subItems.map((sub, sIdx) => (
                    <li key={sIdx}>- {sub.text}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Résumé */}
      <div>
        <label className="block mb-1 font-medium">Résumé</label>
        <textarea
          className="border p-2 w-full rounded"
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Créer la réunion
      </button>
    </form>
  );
}

export default MeetingForm;

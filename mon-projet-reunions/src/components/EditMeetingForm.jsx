// src/components/EditMeetingForm.jsx
import React, { useState } from "react";

function EditMeetingForm({ meeting, onSubmit, onCancel }) {
  const [date, setDate] = useState(meeting.date);
  const [title, setTitle] = useState(meeting.title);
  const [summary, setSummary] = useState(meeting.summary);
  const [agendaItems, setAgendaItems] = useState(meeting.agenda || []);

  // Ajout d'un item principal
  const [newAgendaText, setNewAgendaText] = useState("");
  const handleAddAgendaItem = () => {
    const trimmedText = newAgendaText.trim();
    if (!trimmedText) return;
    setAgendaItems((prev) => [...prev, { text: trimmedText, subItems: [] }]);
    setNewAgendaText("");
  };

  // Ajout d'un sous-item
  const [newSubItemText, setNewSubItemText] = useState("");
  const [parentIndex, setParentIndex] = useState(null);
  const handleAddSubItem = () => {
    const trimmedText = newSubItemText.trim();
    if (!trimmedText || parentIndex === null) return;

    setAgendaItems((prev) => {
      const updated = [...prev];
      updated[parentIndex] = {
        ...updated[parentIndex],
        subItems: [...updated[parentIndex].subItems, { text: trimmedText }],
      };
      return updated;
    });

    setNewSubItemText("");
    setParentIndex(null);
  };

  // Validation du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !title) {
      alert("Date et Titre obligatoires");
      return;
    }

    // On reconstruit l'objet updatedMeeting
    const updatedMeeting = {
      ...meeting, // garde l'id existant
      date,
      title,
      summary,
      agenda: agendaItems,
    };

    onSubmit(updatedMeeting);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded">
      <h2 className="text-lg font-semibold">Modifier la réunion</h2>
      <div>
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          className="border p-2 w-full rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Titre</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* ORDRE DU JOUR */}
      <div>
        <label className="block mb-1 font-medium">Ordre du Jour</label>
        {/* Ajout item principal */}
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
        {/* Ajout sous-item */}
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
            <option value="">Sélectionnez l'item parent</option>
            {agendaItems.map((item, idx) => (
              <option key={idx} value={idx}>
                {item.text}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Ajouter un sous-point..."
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

        {/* Aperçu des items */}
        <ul className="list-disc list-inside space-y-1">
          {agendaItems.map((item, idx) => (
            <li key={idx} className="ml-4">
              <b>{item.text}</b>
              {item.subItems && item.subItems.length > 0 && (
                <ul className="list-circle list-inside ml-6 mt-1">
                  {item.subItems.map((sub, sIdx) => (
                    <li key={sIdx} className="text-gray-700">
                      - {sub.text}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* RESUME */}
      <div>
        <label className="block mb-1 font-medium">Résumé</label>
        <textarea
          className="border p-2 w-full rounded"
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      {/* BOUTONS */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Enregistrer
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          onClick={onCancel}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default EditMeetingForm;

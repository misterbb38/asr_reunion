// src/components/MeetingForm.jsx
import React, { useState } from "react";

function MeetingForm({ onAddMeeting }) {
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  // agendaItems = [ { text: string, subItems: [ { text: string }, ... ] }, ... ]
  const [agendaItems, setAgendaItems] = useState([]);
  const [newAgendaText, setNewAgendaText] = useState("");

  // Pour ajouter un "sous-item" (on retiendra l'index de l'item parent)
  const [newSubItemText, setNewSubItemText] = useState("");
  const [parentIndex, setParentIndex] = useState(null);

  // Ajouter un item principal à l'ordre du jour
  const handleAddAgendaItem = () => {
    const trimmedText = newAgendaText.trim();
    if (!trimmedText) return;

    const newItem = {
      text: trimmedText,
      subItems: [],
    };
    setAgendaItems((prev) => [...prev, newItem]);
    setNewAgendaText("");
  };

  // Ajouter un sous-item à un item principal
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

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !title) {
      alert("Veuillez renseigner la date et le titre.");
      return;
    }

    const newMeeting = {
      // Générer un id, JSON Server l’écrasera avec un id auto si vous voulez
      id: Date.now(),
      date,
      title,
      agenda: agendaItems,
      summary,
    };

    onAddMeeting(newMeeting);

    // Réinitialiser
    setDate("");
    setTitle("");
    setSummary("");
    setAgendaItems([]);
    setNewAgendaText("");
    setNewSubItemText("");
    setParentIndex(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Date */}
      <div>
        <label className="block mb-1 font-medium">Date de la réunion</label>
        <input
          type="date"
          className="border p-2 w-full rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Titre */}
      <div>
        <label className="block mb-1 font-medium">Titre de la réunion</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Ex: Réunion du Comité"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Ordre du jour */}
      <div>
        <label className="block mb-1 font-medium">Ordre du jour</label>
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

        {/* Ajout d'un sous-item */}
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

        {/* Aperçu de la structure */}
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

      {/* Résumé */}
      <div>
        <label className="block mb-1 font-medium">Résumé de la réunion</label>
        <textarea
          className="border p-2 w-full rounded"
          rows={3}
          placeholder="Décrivez brièvement le contenu ou les décisions prises"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Créer la réunion
      </button>
    </form>
  );
}

export default MeetingForm;

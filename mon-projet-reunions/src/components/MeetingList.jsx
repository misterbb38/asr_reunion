// src/components/MeetingList.jsx
import React, { useState } from "react";
import EditMeetingForm from "./EditMeetingForm";

function MeetingList({ meetings, onUpdateMeeting }) {
  const [editingId, setEditingId] = useState(null);

  // Lorsqu’on clique sur "Modifier", on stocke l'id de la réunion en cours d'édition
  const handleEditClick = (id) => {
    setEditingId(id);
  };

  // Lorsque le formulaire d’édition est soumis avec succès
  const handleEditSubmit = (updatedMeeting) => {
    onUpdateMeeting(updatedMeeting);
    setEditingId(null);
  };

  return (
    <div className="mt-6 space-y-4">
      {meetings.length === 0 && (
        <p className="text-center text-gray-500">
          Aucune réunion n’a encore été programmée.
        </p>
      )}

      {meetings.map((meeting) => (
        <div key={meeting.id} className="border rounded p-4 shadow-sm">
          {editingId === meeting.id ? (
            // Le formulaire d'édition pour cette réunion
            <EditMeetingForm
              meeting={meeting}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            // Affichage normal de la réunion
            <>
              <h2 className="text-xl font-semibold">{meeting.title}</h2>
              <p className="text-gray-600">Date : {meeting.date}</p>

              <div className="mt-2">
                <h3 className="font-medium">Ordre du jour :</h3>
                {meeting.agenda && meeting.agenda.length > 0 ? (
                  <ul className="list-disc list-inside ml-4">
                    {meeting.agenda.map((item, idx) => (
                      <li key={idx}>
                        <strong>{item.text}</strong>
                        {item.subItems && item.subItems.length > 0 && (
                          <ul className="list-circle ml-6 mt-1">
                            {item.subItems.map((sub, sIdx) => (
                              <li key={sIdx}>- {sub.text}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Aucun point ajouté.</p>
                )}
              </div>

              <div className="mt-2">
                <h3 className="font-medium">Résumé :</h3>
                {meeting.summary ? (
                  <p className="text-gray-700">{meeting.summary}</p>
                ) : (
                  <p className="text-sm text-gray-500">Pas de résumé.</p>
                )}
              </div>

              <button
                className="mt-3 bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                onClick={() => handleEditClick(meeting.id)}
              >
                Modifier
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default MeetingList;

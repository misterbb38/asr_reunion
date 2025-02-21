// frontend/src/components/MeetingList.jsx
import React, { useState } from "react";
import EditMeetingForm from "./EditMeetingForm";

function MeetingList({ meetings, onUpdateMeeting, onDeleteMeeting }) {
  const [editingId, setEditingId] = useState(null);

  const handleEditClick = (id) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleEditSubmit = (updatedMeeting) => {
    onUpdateMeeting(updatedMeeting);
    setEditingId(null);
  };

  if (!meetings || meetings.length === 0) {
    return <p className="text-center text-gray-500">Aucune réunion prévue.</p>;
  }

  return (
    <div className="space-y-4">
      {meetings.map((m) => (
        <div key={m._id} className="border rounded p-4 shadow-sm">
          {editingId === m._id ? (
            <EditMeetingForm
              meeting={m}
              onSubmit={handleEditSubmit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <>
              <h2 className="text-xl font-semibold">{m.title}</h2>
              <p className="text-gray-600">Date : {m.date?.slice(0, 10)}</p>

              <div className="mt-2">
                <h3 className="font-medium">Ordre du jour :</h3>
                {m.agenda && m.agenda.length > 0 ? (
                  <ul className="list-disc list-inside ml-4">
                    {m.agenda.map((item, idx) => (
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
                {m.summary ? (
                  <p className="text-gray-700">{m.summary}</p>
                ) : (
                  <p className="text-sm text-gray-500">Pas de résumé.</p>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                  onClick={() => handleEditClick(m._id)}
                >
                  Éditer
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => onDeleteMeeting(m._id)}
                >
                  Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default MeetingList;

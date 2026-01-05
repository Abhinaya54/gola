import React, { useState, useRef } from "react";

const isSpeechRecognitionSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

const VoiceNotepad = () => {
  const [mode, setMode] = useState(null); // "voice" or "notepad"
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [editText, setEditText] = useState("");
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes") || "[]"));
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const [showNoSpeechHint, setShowNoSpeechHint] = useState(false);
  const [correcting, setCorrecting] = useState(false);
  const recognitionRef = useRef(null);

  // Start voice recording and speech recognition
  const handleStartRecording = async () => {
    setTranscript("");
    setEditText("");
    setRecording(true);
    setSpeechError("");
    setShowNoSpeechHint(false);
    // Start speech recognition
    if (isSpeechRecognitionSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; ++i) {
          finalTranscript += event.results[i][0].transcript;
        }
        setTranscript(finalTranscript);
      };
      recognition.onend = () => setRecognitionActive(false);
      recognition.onerror = (event) => {
        setRecognitionActive(false);
        setSpeechError("Speech recognition error: " + (event.error || "Unknown error"));
        if (event.error === "no-speech") {
          setShowNoSpeechHint(true);
        }
      };
      try {
        recognition.start();
        recognitionRef.current = recognition;
        setRecognitionActive(true);
      } catch (err) {
        setSpeechError("Speech recognition could not start. Try refreshing or check browser permissions.");
      }
    } else {
      setSpeechError("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
    }
  };

  // Stop voice recording and speech recognition
  const handleStopRecording = () => {
    if (recognitionRef.current && recognitionActive) {
      recognitionRef.current.stop();
      setRecognitionActive(false);
    }
    setRecording(false);
    setEditText(transcript);
  };

  // Save note (voice or notepad)
  const handleSaveNote = () => {
    const noteText = editText;
    const noteObj = {
      text: noteText,
      date: new Date().toLocaleString(),
    };
    const updatedNotes = [noteObj, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setTranscript("");
    setEditText("");
    setMode(null);
  };

  // Edit note text
  const handleEditText = (e) => {
    setEditText(e.target.value);
  };

  // Clear notepad
  const handleClear = () => {
    setEditText("");
  };

  // Grammar correction using LanguageTool API
  const handleGrammarCorrection = async () => {
    setCorrecting(true);
    try {
      const response = await fetch("https://api.languagetoolplus.com/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          text: editText,
          language: "en-US"
        })
      });
      const data = await response.json();
      let corrected = editText;
      // Apply corrections from end to start to avoid index shifting
      if (data.matches && data.matches.length > 0) {
        const replacements = data.matches
          .filter(m => m.replacements && m.replacements.length > 0)
          .map(m => ({
            offset: m.offset,
            length: m.length,
            replacement: m.replacements[0].value
          }))
          .sort((a, b) => b.offset - a.offset);
        for (const { offset, length, replacement } of replacements) {
          corrected = corrected.slice(0, offset) + replacement + corrected.slice(offset + length);
        }
      }
      setEditText(corrected);
    } catch (err) {
      alert("Grammar correction failed. Please try again.");
    }
    setCorrecting(false);
  };

  // UI
  return (
    <div style={{ maxWidth: 480, margin: "2rem auto", background: "#F8F9ED", padding: "2rem", borderRadius: 16, boxShadow: "0 4px 24px rgba(128, 90, 213, 0.10)" }}>
      <h2 style={{ textAlign: "center", color: "#805AD5", marginBottom: 24 }}>Voice & Notepad</h2>
      {!isSpeechRecognitionSupported && (
        <div style={{ color: "#D53F8C", marginBottom: 16 }}>
          Voice recognition is not supported in this browser. Please use Chrome or Edge.
        </div>
      )}
      {speechError && (
        <div style={{ color: "#D53F8C", marginBottom: 16 }}>{speechError}</div>
      )}
      {showNoSpeechHint && (
        <div style={{ color: "#D53F8C", marginBottom: 16 }}>
          No speech detected. Please check your microphone, speak clearly, and try again.
        </div>
      )}
      {!mode && (
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 32 }}>
          <button type="button" onClick={() => setMode("voice")}
            style={{ background: "#805AD5", color: "#fff", border: "none", borderRadius: 12, padding: "18px 32px", fontWeight: 600, fontSize: 18, cursor: "pointer", boxShadow: "0 2px 8px #E6E6FA" }}>
            <span role="img" aria-label="mic">🎤</span> Start Record
          </button>
          <button type="button" onClick={() => setMode("notepad")}
            style={{ background: "#48BB78", color: "#fff", border: "none", borderRadius: 12, padding: "18px 32px", fontWeight: 600, fontSize: 18, cursor: "pointer", boxShadow: "0 2px 8px #E6E6FA" }}>
            <span role="img" aria-label="note">📝</span> Write Notes
          </button>
        </div>
      )}
      {mode === "voice" && (
        <div style={{ marginBottom: 24 }}>
          {!recording && (
            <button type="button" onClick={handleStartRecording}
              style={{ background: "#805AD5", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, cursor: "pointer", marginRight: 8 }}>Start Record</button>
          )}
          {recording && (
            <button type="button" onClick={handleStopRecording}
              style={{ background: "#D53F8C", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, cursor: "pointer" }}>Stop Record</button>
          )}
          <div style={{ marginTop: 16 }}>
            <label style={{ fontWeight: 500, color: "#805AD5" }}>Live Transcript:</label>
            <div style={{ minHeight: 48, background: "#fff", borderRadius: 8, border: "1px solid #E6E6FA", padding: "10px 12px", marginTop: 8, fontSize: 16 }}>
              {recording ? transcript : null}
            </div>
          </div>
          {!recording && transcript && (
            <div style={{ marginTop: 16 }}>
              <label style={{ fontWeight: 500, color: "#805AD5" }}>Edit Text:</label>
              <textarea
                value={editText}
                onChange={handleEditText}
                rows={5}
                style={{ width: "100%", marginBottom: 12, borderRadius: 8, border: "1px solid #E6E6FA", padding: "10px 12px", fontSize: 15, resize: "vertical" }}
              />
              <button type="button" onClick={handleGrammarCorrection} disabled={correcting}
                style={{ width: "100%", padding: "8px 0", background: "#6B46C1", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: "pointer", marginBottom: 8 }}>
                {correcting ? "Correcting..." : "Correct Grammar"}
              </button>
              <button type="button" onClick={handleSaveNote}
                style={{ width: "100%", padding: "10px 0", background: "#805AD5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: "pointer", marginTop: 8 }}>Save Note</button>
            </div>
          )}
        </div>
      )}
      {mode === "notepad" && (
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontWeight: 500, color: "#805AD5" }}>Write your note:</label>
          <textarea
            value={editText}
            onChange={handleEditText}
            rows={7}
            style={{ width: "100%", marginBottom: 12, borderRadius: 8, border: "1px solid #E6E6FA", padding: "10px 12px", fontSize: 15, resize: "vertical" }}
          />
          <button type="button" onClick={handleGrammarCorrection} disabled={correcting}
            style={{ width: "100%", padding: "8px 0", background: "#6B46C1", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: "pointer", marginBottom: 8 }}>
            {correcting ? "Correcting..." : "Correct Grammar"}
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={handleSaveNote}
              style={{ flex: 1, padding: "10px 0", background: "#48BB78", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: "pointer" }}>Save</button>
            <button type="button" onClick={handleClear}
              style={{ flex: 1, padding: "10px 0", background: "#D53F8C", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: "pointer" }}>Clear</button>
          </div>
        </div>
      )}
      {/* Saved notes list */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ color: "#805AD5", fontWeight: 600, marginBottom: 12 }}>Saved Notes</h3>
        {notes.length === 0 && <div style={{ color: "#888" }}>No notes yet.</div>}
        {notes.map((note, idx) => (
          <div key={idx} style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #E6E6FA", padding: "12px 16px", marginBottom: 12 }}>
            <div style={{ fontSize: 15, color: "#3a3a3a", marginBottom: 4 }}>{note.text}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{note.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceNotepad;

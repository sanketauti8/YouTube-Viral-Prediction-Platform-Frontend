import React, { useState } from "react";
import "./App.css";

/**
 * YouTube Viral Video Predictor UI
 * Features added for non‑technical friendliness:
 *  • “Prefill Example” button to auto‑populate sample values.
 *  • Helper placeholders & small hints on each field.
 *  • Collapsible “Advanced Details” section (tags & description) to reduce clutter.
 *  • Colored result badge (green ✅ / red ⚠️) for instant visual feedback.
 */
export default function YouTubeViralPredictor() {
  const [form, setForm] = useState({
    likes: "",
    dislikes: "",
    comment_count: "",
    title: "",
    description: "",
    tags: "",
    publish_hour: "",
    publish_day: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Quickly demonstrate the app to recruiters with one click
  const handlePrefill = () => {
    setForm({
      likes: 5000,
      dislikes: 120,
      comment_count: 800,
      title: "Latest iPhone 15 Review – Hands‑On!",
      description: "We tested Apple’s new iPhone 15 for a full week…",
      tags: "iphone|review|tech",
      publish_hour: 18,
      publish_day: 4 // Friday
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://youtubeviralprediction-ml-xgboost.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          likes: Number(form.likes),
          dislikes: Number(form.dislikes),
          comment_count: Number(form.comment_count),
          publish_hour: Number(form.publish_hour),
          publish_day: Number(form.publish_day)
        })
      });

      if (!response.ok) throw new Error("Server error: " + response.status);
      const data = await response.json();
      setResult(data.viral);
    } catch (error) {
      console.error(error);
      alert("API error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper row-layout">
      {/* INFO PANEL */}
      <section className="info-panel">
        <h1>YouTube Viral Video Predictor</h1>
        <p className="subtext">
          Powered by <strong>XGBoost</strong>, this tool predicts whether a YouTube video will go viral using public
          metadata like likes, comments, and publish time. Perfect for content creators &amp; recruiters evaluating ML work.
        </p>
        <div className="footer-info">
          <p><strong>Model:</strong> XGBoost (Accuracy&nbsp;91%)</p>
          <p><strong>Stack:</strong> Flask API · React UI</p>
          <p><strong>Contact:</strong> <a href="mailto:sanketauti01@gmail.com">sanketauti01@gmail.com</a></p>
          <hr style={{margin:"12px 0"}} />
          <p style={{fontWeight:"bold", marginBottom:"4px"}}>How this was built:</p>
          <ul className="build-steps">
            <li>Downloaded 500&nbsp;MB+ YouTube trending dataset (40k&nbsp;+ videos).</li>
            <li>Engineered features &nbsp;⟶ likes, dislikes, tags, title length, publish time.</li>
            <li>Trained XGBoost classifier (91% accuracy) versus LSTM baseline.</li>
            <li>Saved model with <code>joblib</code>; exposed via Flask REST API (Render).</li>
            <li>Connected React front‑end → real‑time prediction in one click.</li>
          </ul>
        </div>
      </section>

      {/* FORM PANEL */}
      <section className="form-panel">
        <div className="form">
          <div className="form-group">
            <label>Likes ⭐</label>
            <input name="likes" type="number" placeholder="e.g., 5000" value={form.likes} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Dislikes</label>
            <input name="dislikes" type="number" placeholder="e.g., 120" value={form.dislikes} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Comment Count</label>
            <input name="comment_count" type="number" placeholder="e.g., 800" value={form.comment_count} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Video Title ⭐</label>
            <input name="title" type="text" placeholder="Catchy video title" value={form.title} onChange={handleChange} />
          </div>
          {/* Collapsible advanced fields */}
          <details className="advanced">
            <summary>Advanced Details (optional)</summary>
            <div className="form-group">
              <label>Description</label>
              <input name="description" type="text" placeholder="Short description" value={form.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tags (pipe‑separated)</label>
              <input name="tags" type="text" placeholder="tech|review" value={form.tags} onChange={handleChange} />
            </div>
          </details>
          <div className="form-group">
            <label>Publish Hour (0‑23) ⭐</label>
            <input name="publish_hour" type="number" placeholder="18" value={form.publish_hour} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Publish Day (0=Mon) ⭐</label>
            <input name="publish_day" type="number" placeholder="4" value={form.publish_day} onChange={handleChange} />
          </div>

          <button onClick={handleSubmit} disabled={loading}>{loading ? "Predicting…" : "Predict Viral Potential"}</button>
          <button type="button" className="secondary" onClick={handlePrefill}>Prefill Example</button>

          {result !== null && (
            <div className={`result-badge ${result ? "viral" : "not-viral"}`}>
              {result ? "✅ Likely to go VIRAL" : "⚠️ Unlikely to go viral"}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

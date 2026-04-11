import { useMemo, useState } from "react";
import Modal from "../../common/Modal/Modal.jsx";
import Button from "../../common/Button/Button.jsx";
import "./AddBugModal.css";

const DEFAULT_STATUS = "open";
const DEFAULT_PRIORITY = "medium";

export default function AddBugModal({
  isOpen,
  onClose,
  onSubmit,
  projects = [],
  defaultProjectId = "",
}) {
  const projectOptions = useMemo(
    () =>
      [...projects].sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || "")),
      ),
    [projects],
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(DEFAULT_STATUS);
  const [priority, setPriority] = useState(DEFAULT_PRIORITY);
  const [projectId, setProjectId] = useState(defaultProjectId || "");

  const isProjectLocked = Boolean(defaultProjectId);

  function handleClose() {
    onClose?.();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return alert("Title is required.");
    if (!projectId) return alert("Please select a project.");

    const payload = {
      title: trimmedTitle,
      description: description.trim(),
      status,
      priority,
      projectId,
    };

    try {
      await onSubmit?.(payload);
      handleClose();
    } catch (err) {
      alert(err?.message || "Failed to create bug.");
    }
  }

  const footer = (
    <>
      <Button type="button" variant="ghost" onClick={handleClose}>
        Cancel
      </Button>
      <Button type="submit" form="addBugForm">
        Create Bug
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      title="New Bug"
      onClose={handleClose}
      footer={footer}
    >
      <form id="addBugForm" className="add-bug" onSubmit={handleSubmit}>
        <label className="add-bug__label">
          Title
          <input
            className="add-bug__input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short summary…"
            maxLength={140}
            required
            autoFocus
          />
        </label>

        <label className="add-bug__label">
          Description
          <textarea
            className="add-bug__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Steps to reproduce, expected vs actual…"
            maxLength={5000}
            rows={5}
          />
        </label>

        <div className="add-bug__row">
          <label className="add-bug__label add-bug__label--half">
            Status
            <select
              className="add-bug__select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </label>

          <label className="add-bug__label add-bug__label--half">
            Priority
            <select
              className="add-bug__select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </label>
        </div>

        <label className="add-bug__label">
          Project
          <select
            className="add-bug__select"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            disabled={isProjectLocked}
            required
          >
            {!isProjectLocked && <option value="">Select a project…</option>}
            {projectOptions.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </form>
    </Modal>
  );
}

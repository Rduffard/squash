import { useMemo, useState } from "react";
import Modal from "../../common/Modal/Modal.jsx";
import Button from "../../common/Button/Button.jsx";
import "./AddProjectModal.css";

export default function AddProjectModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const isValid = useMemo(() => name.trim().length >= 2, [name]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    const payload = {
      name: name.trim(),
      description: description.trim(),
    };

    // 🔥 PROOF it fired
    console.log("AddProjectModal submit payload:", payload);

    onSubmit?.(payload);
    onClose?.();
  }

  return (
    <Modal isOpen={isOpen} title="New Project" onClose={onClose}>
      <form className="add-project-form" onSubmit={handleSubmit}>
        <div className="add-project-form__field">
          <label className="add-project-form__label" htmlFor="project-name">
            Project name
          </label>
          <input
            id="project-name"
            className="add-project-form__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Squash MVP"
            autoFocus
          />
          <p className="add-project-form__hint">2–80 characters.</p>
        </div>

        <div className="add-project-form__field">
          <label className="add-project-form__label" htmlFor="project-desc">
            Description (optional)
          </label>
          <textarea
            id="project-desc"
            className="add-project-form__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this project about?"
          />
          <p className="add-project-form__hint">Up to 1000 characters.</p>
        </div>

        <div className="add-project-form__actions">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isValid}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}

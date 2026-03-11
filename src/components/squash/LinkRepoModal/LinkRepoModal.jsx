import { useEffect, useMemo, useState } from "react";
import Modal from "../../common/Modal/Modal.jsx";
import Button from "../../common/Button/Button.jsx";
import "./LinkRepoModal.css";

export default function LinkRepoModal({
  isOpen,
  onClose,
  initialValue = "",
  onSave, // async (repoFullName: string) => Promise<void>
}) {
  const [value, setValue] = useState(initialValue || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Reset modal state on open
  useEffect(() => {
    if (!isOpen) return;
    setValue(initialValue || "");
    setSaving(false);
    setError("");
  }, [isOpen, initialValue]);

  const normalized = useMemo(() => String(value || "").trim(), [value]);

  function validate(v) {
    const s = String(v || "").trim();

    // Allow clearing (unlink)
    if (!s) return "";

    if (!/^[^/]+\/[^/]+$/.test(s)) {
      return "Use format owner/repo (e.g. crossworldcreative/squash)";
    }

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const msg = validate(value);
    if (msg) {
      setError(msg);
      return;
    }

    if (typeof onSave !== "function") {
      setError("LinkRepoModal: onSave(repoFullName) is not wired yet.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave(normalized);
      onClose?.();
    } catch (err) {
      setError(err?.message || "Failed to save repo link");
    } finally {
      setSaving(false);
    }
  }

  const footer = (
    <div className="link-repo__footer">
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={onClose}
        disabled={saving}
      >
        Cancel
      </Button>

      <Button size="sm" type="submit" onClick={handleSubmit} disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      title="Link GitHub Repo"
      onClose={onClose}
      footer={footer}
    >
      <form className="link-repo" onSubmit={handleSubmit}>
        <label className="link-repo__label" htmlFor="repoFullName">
          Repo (owner/repo)
        </label>

        <input
          id="repoFullName"
          className="link-repo__input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="owner/repo"
          autoComplete="off"
          spellCheck="false"
        />

        <p className="link-repo__hint">
          Example: <code>facebook/react</code>. Leave blank to unlink.
        </p>

        {error ? <p className="link-repo__error">{error}</p> : null}

        {/* Ensures Enter submits even if footer buttons change later */}
        <button type="submit" style={{ display: "none" }} />
      </form>
    </Modal>
  );
}

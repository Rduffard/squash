import Header from "../../components/layout/Header/Header.jsx";
import Sidebar from "../../components/layout/Sidebar/Sidebar.jsx";
import "./Settings.css";

export default function Settings() {
  // temporary hard-coded user
  const user = {
    name: "Romain Duffard",
    email: "romain@example.com",
    role: "QA Engineer → Software Engineer",
  };

  return (
    <main className="settings-page">
      <Header />

      <div className="settings-page__body">
        <Sidebar />

        {/* Inner content area */}
        <section className="settings">
          <header className="settings__header">
            <div>
              <h1 className="settings__title">Settings</h1>
              <p className="settings__subtitle">
                Customize your Squash workspace, account, and preferences.
              </p>
            </div>
            <button className="settings__save-button" type="button">
              Save changes
            </button>
          </header>

          <div className="settings__layout">
            {/* LEFT COLUMN */}
            <section className="settings__column">
              {/* Account */}
              <section className="settings-card">
                <h2 className="settings-card__title">Account</h2>
                <p className="settings-card__description">
                  Manage your profile and login information.
                </p>

                <div className="settings-card__group">
                  <label className="settings-card__label">
                    Name
                    <input
                      className="settings-card__input"
                      type="text"
                      value={user.name}
                      readOnly
                    />
                  </label>

                  <label className="settings-card__label">
                    Email
                    <input
                      className="settings-card__input"
                      type="email"
                      value={user.email}
                      readOnly
                    />
                  </label>
                </div>

                <div className="settings-card__footer">
                  <span className="settings-card__meta">
                    Role: <strong>{user.role}</strong>
                  </span>
                  <button className="settings-card__link-button" type="button">
                    Change password
                  </button>
                </div>
              </section>

              {/* Notifications */}
              <section className="settings-card">
                <h2 className="settings-card__title">Notifications</h2>
                <p className="settings-card__description">
                  Choose how Squash keeps you updated about bugs and releases.
                </p>

                <div className="settings-card__group settings-card__group_vertical">
                  <label className="settings-toggle">
                    <input
                      className="settings-toggle__checkbox"
                      type="checkbox"
                    />
                    <span className="settings-toggle__visual" />
                    <span className="settings-toggle__label">
                      Email me when a bug is assigned to me
                    </span>
                  </label>

                  <label className="settings-toggle">
                    <input
                      className="settings-toggle__checkbox"
                      type="checkbox"
                    />
                    <span className="settings-toggle__visual" />
                    <span className="settings-toggle__label">
                      Email me when a status changes on my bugs
                    </span>
                  </label>

                  <label className="settings-toggle">
                    <input
                      className="settings-toggle__checkbox"
                      type="checkbox"
                    />
                    <span className="settings-toggle__visual" />
                    <span className="settings-toggle__label">
                      Weekly summary of project health
                    </span>
                  </label>
                </div>
              </section>
            </section>

            {/* RIGHT COLUMN */}
            <section className="settings__column">
              {/* Appearance */}
              <section className="settings-card">
                <h2 className="settings-card__title">Appearance</h2>
                <p className="settings-card__description">
                  Switch between light and dark themes. (Dark is basically law
                  here.)
                </p>

                <div className="settings-card__group">
                  <div className="settings-segmented">
                    <button
                      type="button"
                      className="settings-segmented__option settings-segmented__option_active"
                    >
                      Dark
                    </button>
                    <button
                      type="button"
                      className="settings-segmented__option"
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      className="settings-segmented__option"
                    >
                      System
                    </button>
                  </div>

                  <label className="settings-toggle">
                    <input
                      className="settings-toggle__checkbox"
                      type="checkbox"
                    />
                    <span className="settings-toggle__visual" />
                    <span className="settings-toggle__label">
                      Use high-contrast mode for better accessibility
                    </span>
                  </label>
                </div>
              </section>

              {/* Dev options */}
              <section className="settings-card">
                <h2 className="settings-card__title">Developer options</h2>
                <p className="settings-card__description">
                  Extra tools for debugging and QA workflows.
                </p>

                <div className="settings-card__group settings-card__group_vertical">
                  <label className="settings-toggle">
                    <input
                      className="settings-toggle__checkbox"
                      type="checkbox"
                    />
                    <span className="settings-toggle__visual" />
                    <span className="settings-toggle__label">
                      Show request/response logs in dev console
                    </span>
                  </label>

                  <label className="settings-toggle">
                    <input
                      className="settings-toggle__checkbox"
                      type="checkbox"
                    />
                    <span className="settings-toggle__visual" />
                    <span className="settings-toggle__label">
                      Enable experimental features (Squash Labs)
                    </span>
                  </label>

                  <label className="settings-toggle">
                    <input
                      className="settings-toggle__checkbox"
                      type="checkbox"
                    />
                    <span className="settings-toggle__visual" />
                    <span className="settings-toggle__label">
                      Show fake load times to simulate production
                    </span>
                  </label>
                </div>
              </section>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

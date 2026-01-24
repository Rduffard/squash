// src/data/demoData.js

export const demoProjects = [
  {
    id: "PRJ-1",
    name: "Crossworld Creative – Portfolio",
    status: "active",
    description: "Main portfolio site with Squash integration.",
  },
  {
    id: "PRJ-2",
    name: "Squash – Bug Tracker",
    status: "active",
    description: "Core Squash app.",
  },
  {
    id: "PRJ-3",
    name: "Taxi Cop – Game Prototype",
    status: "on-hold",
    description: "Prototype tactical / narrative game.",
  },
];

export const demoBugs = [
  {
    id: "BUG-101",
    title: "Login form sometimes fails silently",
    status: "open",
    projectId: "PRJ-2",
    severity: "high",
    assignee: "Romain",
    createdAt: "2025-11-20T09:15:00Z",
    updatedAt: "2025-11-27T16:30:00Z",
  },
  {
    id: "BUG-102",
    title: "Sidebar nav not highlighting active route",
    status: "in-progress",
    projectId: "PRJ-2",
    severity: "medium",
    assignee: "Romain",
    createdAt: "2025-11-21T13:00:00Z",
    updatedAt: "2025-11-27T17:00:00Z",
  },
  {
    id: "BUG-103",
    title: "Settings page sidebar padding off",
    status: "resolved",
    projectId: "PRJ-2",
    severity: "low",
    assignee: "Romain",
    createdAt: "2025-11-27T15:00:00Z",
    updatedAt: "2025-11-27T15:45:00Z",
  },
  {
    id: "BUG-104",
    title: "Project cards overflow on small screens",
    status: "open",
    projectId: "PRJ-1",
    severity: "medium",
    assignee: "Romain",
    createdAt: "2025-11-18T10:20:00Z",
    updatedAt: "2025-11-25T12:10:00Z",
  },
];

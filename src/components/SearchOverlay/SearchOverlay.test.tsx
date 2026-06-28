import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";
import { server } from "@/test/msw";
import { SearchOverlay } from "./SearchOverlay";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** Default handler returns empty competitions so useTeams makes no further requests. */
beforeEach(() => {
  server.use(http.get(`${API}/competitions`, () => HttpResponse.json([])));
});

const renderOverlay = (onClose = vi.fn()) =>
  render(
    <MemoryRouter>
      <SearchOverlay onClose={onClose} />
    </MemoryRouter>,
  );

describe("SearchOverlay", () => {
  it("renders the search input", () => {
    renderOverlay();
    expect(
      screen.getByPlaceholderText(/Rechercher une équipe ou une compétition/),
    ).toBeInTheDocument();
  });

  it("shows the empty-state prompt when the query is blank", () => {
    renderOverlay();
    expect(
      screen.getByText(/Tapez le nom d'une équipe ou d'une compétition/),
    ).toBeInTheDocument();
  });

  it("shows a no-results message when the query matches nothing", async () => {
    const user = userEvent.setup();
    renderOverlay();
    await user.type(screen.getByPlaceholderText(/Rechercher/), "xyznotfound");
    await waitFor(() => {
      expect(screen.getByText(/Aucun résultat/)).toBeInTheDocument();
    });
  });

  it("displays matching competitions after typing", async () => {
    server.use(
      http.get(`${API}/competitions`, () =>
        HttpResponse.json([{ id: 1, name: "Ligue 1", image_path: "" }]),
      ),
      http.get(`${API}/competitions/1/teams`, () => HttpResponse.json([])),
    );

    const user = userEvent.setup();
    renderOverlay();
    await user.type(screen.getByPlaceholderText(/Rechercher/), "Ligue");
    await waitFor(() => {
      expect(screen.getByText("Ligue 1")).toBeInTheDocument();
    });
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderOverlay(onClose);
    await user.click(
      screen.getByRole("button", { name: "Fermer la recherche" }),
    );
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes the overlay when a competition result is clicked", async () => {
    server.use(
      http.get(`${API}/competitions`, () =>
        HttpResponse.json([{ id: 1, name: "Ligue 1", image_path: "" }]),
      ),
      http.get(`${API}/competitions/1/teams`, () => HttpResponse.json([])),
    );

    const user = userEvent.setup();
    const onClose = vi.fn();
    renderOverlay(onClose);
    await user.type(screen.getByPlaceholderText(/Rechercher/), "Ligue");
    await waitFor(() => screen.getByText("Ligue 1"));
    await user.click(screen.getByText("Ligue 1"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shows teams alongside competitions when both match the query", async () => {
    server.use(
      http.get(`${API}/competitions`, () =>
        HttpResponse.json([{ id: 1, name: "Premier League", image_path: "" }]),
      ),
      http.get(`${API}/competitions/1/teams`, () =>
        HttpResponse.json([
          {
            team: {
              id: 10,
              name: "Arsenal",
              image_path: "",
              short_code: "ARS",
            },
          },
        ]),
      ),
    );

    const user = userEvent.setup();
    renderOverlay();
    await user.type(screen.getByPlaceholderText(/Rechercher/), "Ars");
    await waitFor(() => {
      expect(screen.getByText("Arsenal")).toBeInTheDocument();
    });
    expect(screen.getByText("Équipes")).toBeInTheDocument();
  });
});

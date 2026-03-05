```mermaid
sequenceDiagram
    autonumber
    participant U as User Browser
    participant A as c2-A
    participant B as c2-B

    Note over U, A: STEP 1: INITIAL GENERATION
    U->>A: User visits Site A (Empty Browser)
    A->>A: No cookie found? Generate GLOBAL_ID="ID-99"
    A-->>U: HTTP 200: Set-Cookie GLOBAL_ID="ID-99"
    Note right of U: ID-99 is now in Site A's Storage

    Note over U, B: STEP 2: THE SYNC ALTERNATIVES
    U->>B: User visits Site B
    B->>B: Generates own GLOBAL_ID="ID-77"
    U->>B: User clicks "Sync from Peer Domain"
    
    alt OPTION A: Positive Case (Standard Mode)
        rect rgb(235, 255, 235)
            U->>A: fetch('/get_id_sync') + SENDS GLOBAL_ID="ID-99"
            A-->>U: { "global_id": "ID-99" }
            U->>U: JS: document.cookie overwrites ID-77 with ID-99
            Note over B: Result: Site B now uses "ID-99"
        end
    else OPTION B: Negative Case (Incognito Mode)
        rect rgb(255, 235, 235)
            U-x A: fetch('/get_id_sync') -> BROWSER STRIPS ID-99
            A-->>U: { "global_id": "BROWSER_BLOCKED_COOKIE" }
            Note over B: Result: Site B keeps its own "ID-77"
        end
    end
```mermaid
sequenceDiagram
    autonumber
    participant U as User Browser
    participant A as c2-A
    participant B as c2-B
    participant H as HUB

    Note over U, H: STEP 1: Identification on Site A

    U->>A: User visits Site A
    A-->>U: Page loads (Local Cookie: None)
    U->>A: User clicks "Fetch ID from Hub"

    rect rgb(235, 255, 235)
        Note over U, H: ✅ Site A Sync (Standard Mode)
        U->>H: fetch('/pure_sync') [No Hub cookie yet]
        H->>H: Generates "ID-99"
        H-->>U: JSON {id: "ID-99"} + Set-Cookie (HUB domain)
        U->>U: JS saves "ID-99" to c2-A Jar
    end

    Note over U, H: STEP 2: The Payoff on Site B

    U->>B: User visits Site B
    B-->>U: Page loads (Local Cookie: None)
    U->>B: User clicks "Fetch ID from Hub"

    rect rgb(235, 255, 235)
        Note over U, H: ✅ Site B Sync (Standard Mode)
        U->>H: fetch('/pure_sync') + SENDS HUB COOKIE ("ID-99")
        H->>H: Recognizes "ID-99"
        H-->>U: JSON {id: "ID-99"}
        U->>U: JS saves "ID-99" to c2-B Jar
        Note over B: Result: Both sites now share "ID-99"
    end

    Note over U, H: THE NEGATIVE ALTERNATIVE

    rect rgb(255, 235, 235)
        Note over U, H: ❌ Negative Case (Incognito Mode)
        U->>H: fetch('/pure_sync') [HUB COOKIES STRIPPED]
        H-->>U: JSON { id: "COOKIE_UNKNOWN" }
        Note over B: Result: Site B remains anonymous
    end
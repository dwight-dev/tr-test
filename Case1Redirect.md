```mermaid
sequenceDiagram
    autonumber
    participant U as User Browser
    participant A as domain-a.com
    participant B as domain-b.com
    participant H as hub.com

    Note over U, H: Step 1: User visits domain-a.com for the first time
    U->>A: GET /index.html (No Cookie)
    A-->>U: HTTP 302 Redirect to hub.com.com/sync?origin=https://domain-a.com
    U->>H: GET /sync?origin=https://domain-a.com (No Hub Cookie)
    Note right of H: Hub creates UID-123 in its 1st-party context
    H-->>U: HTTP 302 (Set-Cookie: GLOBAL_ID=UID-123) + Redirect to domain-a.com?set_id=UID-123
    U->>A: GET /?set_id=UID-123
    Note left of A: A sets local 1st-party cookie 'GLOBAL_ID=UID-123'
    A-->>U: HTTP 200 OK (Page Loaded)

    Note over U, H: Step 2: User visits domain-b.com (Hours later)
    U->>B: GET /index.html (No Cookie)
    B-->>U: HTTP 302 Redirect to hub.com.com/sync?origin=https://domain-b.com
    U->>H: GET /sync?origin=https://domain-b.com (Cookie: GLOBAL_ID=UID-123 exists!)
    Note right of H: Hub recognizes existing UID-123
    H-->>U: HTTP 302 Redirect to domain-b.com?set_id=UID-123
    U->>B: GET /?set_id=UID-123
    Note left of B: B sets local 1st-party cookie 'GLOBAL_ID=UID-123'
    B-->>U: HTTP 200 OK (Page Loaded)

    Note over A, B: RESULT: Both domain-a.com and domain-b.com share UID-123
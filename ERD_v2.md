# Knuzzle ERD v1

## Overview

Knuzzle는 밴드의 공연 선곡을 지원하기 위한 웹 애플리케이션이다.

v1의 목표는 **하나의 밴드, 하나의 공연**을 기준으로 선곡 후보를 등록하고, 멤버들이 투표한 뒤 관리자가 최종 선곡을 결정할 수 있도록 하는 것이다.

현재 버전에서는 여러 밴드나 여러 공연을 지원하지 않는다. 이러한 기능은 향후 요구사항이 생길 경우 확장한다.

---

# Domain Flow

```text
User Login
     │
     ▼
Register Song Candidate
     │
     ▼
Members Vote
     │
     ├── LIKE (4~5)
     │      ├── Session
     │      └── Session Detail (optional)
     │
     └── DISLIKE
     │
     ▼
Administrator Reviews Result
     │
     ▼
Song Selected / Rejected
```

---

# Entity Relationship

```text
             User
          ┌─────────┐
          │         │
          │created  │vocal
          ▼         ▼
              Song
                │
                │
                ▼
              Vote
                ▲
                │
               User
```

---

# Entities

## User

Represents a registered member of the band.

| Field          | Description                |
| -------------- | -------------------------- |
| id             | Primary Key                |
| email          | Login email (unique)       |
| password       | Encrypted password         |
| nickname       | Display name               |
| role           | User role (ADMIN / MEMBER) |
| primarySession | Main instrument/session    |
| createdAt      | Created timestamp          |
| updatedAt      | Last updated timestamp     |

### Relations

* createdSongs
* vocalSongs
* votes

---

## Song

Represents a candidate song.

| Field        | Description                   |
| ------------ | ----------------------------- |
| id           | Primary Key                   |
| title        | Song title                    |
| artist       | Artist name                   |
| referenceUrl | Reference URL (YouTube, etc.) |
| memo         | Optional memo                 |
| createdById  | User who registered the song  |
| vocalId      | Assigned vocalist             |
| status       | Selection status              |
| createdAt    | Created timestamp             |
| updatedAt    | Last updated timestamp        |

### Relations

* createdBy
* vocal
* votes

---

## Vote

Represents one user's vote for one song.

Each user may vote only once for a given song.

| Field         | Description                                         |
| ------------- | --------------------------------------------------- |
| id            | Primary Key                                         |
| userId        | Voting user                                         |
| songId        | Target song                                         |
| rating        | rating 1 ~ 5                                        |
| session       | Desired session when voting LIKE                    |
| sessionDetail | Session-specific detail (e.g. Guitar 1, Piano, Pad) |
| createdAt     | Created timestamp                                   |
| updatedAt     | Last updated timestamp                              |

### Constraints

* UNIQUE(userId, songId)

---

# Enums

## Role

* ADMIN
* MEMBER

---

## Session

* VOCAL
* GUITAR
* KEYBOARD
* BASS
* DRUM

---

## SongStatus

* PENDING
* SELECTED
* REJECTED

---

# Business Rules

## User

* Every user has exactly one primary session.
* Every user has one role.

---

## Song

* Every song must have one assigned vocalist.
* The creator and vocalist may be different users.
* Every song starts with the `PENDING` status.

---

## Vote

* One user can vote only once per song.
* A `LIKE` vote should include the session the member wants to participate in.
* `sessionDetail` is used only when additional information is required.

Examples:

| Session  | sessionDetail |
| -------- | ------------- |
| GUITAR   | 1             |
| GUITAR   | 2             |
| KEYBOARD | Piano         |
| KEYBOARD | Pad           |
| BASS     | *(null)*      |
| DRUM     | *(null)*      |
| VOCAL    | *(null)*      |

---

# Future Considerations

The following features are intentionally excluded from v1.

* Multiple bands
* Multiple performances
* Song history
* Playlist/version management
* Social login
* Advanced permission system

These will be introduced only when they become actual requirements.

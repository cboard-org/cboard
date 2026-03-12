# Redux State Normalization Patterns

## Table of Contents
1. [Basic Normalized Structure](#basic-normalized-structure)
2. [One-to-Many Relationships](#one-to-many-relationships)
3. [Many-to-Many Relationships](#many-to-many-relationships)
4. [Top-Level State Organization](#top-level-state-organization)
5. [Reducer Patterns](#reducer-patterns)
6. [Using Normalizr](#using-normalizr)

---

## Basic Normalized Structure

Each entity type gets its own "table" with `byId` and `allIds`:

```js
{
  entityType: {
    byId: {
      "id1": { id: "id1", ...fields },
      "id2": { id: "id2", ...fields }
    },
    allIds: ["id1", "id2"]
  }
}
```

- `byId`: O(1) lookup by ID
- `allIds`: preserves ordering, used to render lists

---

## One-to-Many Relationships

Store foreign keys as ID references, never embed child objects:

```js
// BAD - nested
{
  posts: [
    {
      id: "post1",
      comments: [
        { id: "comment1", author: { id: "user2", name: "..." }, text: "..." }
      ]
    }
  ]
}

// GOOD - normalized
{
  posts: {
    byId: {
      post1: {
        id: "post1",
        authorId: "user1",
        commentIds: ["comment1", "comment2"]
      }
    },
    allIds: ["post1"]
  },
  comments: {
    byId: {
      comment1: { id: "comment1", authorId: "user2", text: "..." }
    },
    allIds: ["comment1", "comment2"]
  },
  users: {
    byId: {
      user1: { id: "user1", username: "alice" },
      user2: { id: "user2", username: "bob" }
    },
    allIds: ["user1", "user2"]
  }
}
```

---

## Many-to-Many Relationships

Use an intermediate join table (like a relational DB junction table):

```js
{
  entities: {
    authors: {
      byId: { 5: { id: 5, name: "Martin Fowler" } },
      allIds: [5, 6]
    },
    books: {
      byId: { 22: { id: 22, title: "Refactoring" } },
      allIds: [22, 23]
    },
    authorBook: {
      byId: {
        1: { id: 1, authorId: 5, bookId: 22 },
        2: { id: 2, authorId: 5, bookId: 23 }
      },
      allIds: [1, 2]
    }
  }
}
```

**Query all books by author 5:**
```js
const booksByAuthor5 = state.authorBook.allIds
  .map(id => state.authorBook.byId[id])
  .filter(rel => rel.authorId === 5)
  .map(rel => state.books.byId[rel.bookId]);
```

---

## Top-Level State Organization

Separate concerns into distinct slices:

```js
{
  // Simple domain data (non-relational)
  currentUser: { id: "user1", role: "admin" },
  config: { theme: "dark" },

  // Normalized entity tables
  entities: {
    posts: { byId: {}, allIds: [] },
    comments: { byId: {}, allIds: [] },
    users: { byId: {}, allIds: [] }
  },

  // UI state (component-level, ephemeral)
  ui: {
    postsList: { isFetching: false, selectedPostId: null },
    notifications: { isOpen: false }
  }
}
```

---

## Reducer Patterns

### Generic entity reducer

```js
function createEntityReducer(entityName) {
  return function reducer(state = { byId: {}, allIds: [] }, action) {
    switch (action.type) {
      case `ADD_${entityName}`:
        return {
          byId: { ...state.byId, [action.entity.id]: action.entity },
          allIds: state.allIds.includes(action.entity.id)
            ? state.allIds
            : [...state.allIds, action.entity.id]
        };
      case `UPDATE_${entityName}`:
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.id]: { ...state.byId[action.id], ...action.changes }
          }
        };
      case `DELETE_${entityName}`:
        const { [action.id]: removed, ...remaining } = state.byId;
        return {
          byId: remaining,
          allIds: state.allIds.filter(id => id !== action.id)
        };
      default:
        return state;
    }
  };
}
```

### Batch upsert (from API response)

```js
case FETCH_POSTS_SUCCESS: {
  const newById = { ...state.posts.byId };
  const newAllIds = [...state.posts.allIds];
  action.posts.forEach(post => {
    newById[post.id] = post;
    if (!newAllIds.includes(post.id)) newAllIds.push(post.id);
  });
  return { ...state, posts: { byId: newById, allIds: newAllIds } };
}
```

---

## Using Normalizr

Normalizr transforms nested API responses into normalized shape.

### Installation
```bash
npm install normalizr
```

### Define schemas

```js
import { schema, normalize } from 'normalizr';

const user = new schema.Entity('users');
const comment = new schema.Entity('comments', { author: user });
const post = new schema.Entity('posts', {
  author: user,
  comments: [comment]
});
```

### Normalize nested API response

```js
// Nested API response
const apiResponse = {
  id: "post1",
  author: { id: "user1", username: "alice" },
  comments: [
    { id: "c1", author: { id: "user2", username: "bob" }, text: "Nice!" }
  ]
};

const normalized = normalize(apiResponse, post);
// Result:
// {
//   result: "post1",
//   entities: {
//     posts: { post1: { id: "post1", author: "user1", comments: ["c1"] } },
//     users: { user1: { id: "user1", username: "alice" }, user2: { ... } },
//     comments: { c1: { id: "c1", author: "user2", text: "Nice!" } }
//   }
// }
```

### Dispatch normalized data to Redux

```js
dispatch({ type: FETCH_POST_SUCCESS, entities: normalized.entities });

// Reducer merges all entity tables at once
case FETCH_POST_SUCCESS:
  return mergeDeep(state, action.entities);
```

### Array responses

```js
const normalized = normalize(apiResponseArray, [post]);
// normalized.result = ["post1", "post2", ...]
// normalized.entities = { posts: {}, users: {}, comments: {} }
```

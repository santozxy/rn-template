# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## React conventions

- Destructure query results at the `useQuery` call, renaming `data` to its domain meaning. Do not keep a query object only to read properties such as `query.data` later.
- Use React Hook Form and controlled components for related screen filters and form fields. Avoid separate `useState` calls for filter values when a typed form can own them together.
- Before creating a new input, check the existing form controllers and patterns used by the other mobile projects.

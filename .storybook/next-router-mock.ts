export const useRouter = () => ({
  push: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  prefetch: () => Promise.resolve(true),
  pathname: '/',
  query: {},
  asPath: '/',
  events: {
    on: () => {},
    off: () => {},
    emit: () => {}
  }
});

export const useSearchParams = () => ({
  get: (key: string) => {
    if (key === 'userId') return 'storybook-user-id'; // valor padrão, pode alterar
    return null;
  }
});

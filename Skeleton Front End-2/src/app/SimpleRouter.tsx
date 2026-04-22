import React, { useState, useEffect, ReactNode } from 'react';

interface Route {
  path: string;
  element: ReactNode;
}

// Global state for router params
let globalParams: Record<string, string> = {};

export function SimpleRouter({ routes }: { routes: Route[] }) {
  const [path, setPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setPath(window.location.hash.slice(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Match route and extract params
  let matchedRoute: Route | null = null;
  globalParams = {};

  for (const route of routes) {
    const pathPattern = route.path.replace(/:[^/]+/g, '([^/]+)').replace(/\*/g, '.*');
    const regex = new RegExp(`^${pathPattern}$`);
    const match = path.match(regex);

    if (match) {
      matchedRoute = route;
      const paramNames = (route.path.match(/:[^/]+/g) || []).map((p) =>
        p.slice(1)
      );
      paramNames.forEach((name, index) => {
        globalParams[name] = match[index + 1];
      });
      break;
    }
  }

  return <>{matchedRoute ? matchedRoute.element : <div>404 Not Found</div>}</>;
}

// Simple hooks without useSyncExternalStore
export function useNavigate() {
  return (path: string) => {
    window.location.hash = path;
  };
}

export function useParams() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleChange = () => forceUpdate({});
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);

  return globalParams;
}

export function useLocation() {
  const [pathname, setPathname] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleChange = () => {
      setPathname(window.location.hash.slice(1) || '/');
    };
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);

  return { pathname };
}

export function Link({
  to,
  children,
  ...props
}: {
  to: string;
  children: ReactNode;
  [key: string]: any;
}) {
  return (
    <a
      href={`#${to}`}
      onClick={(e) => {
        e.preventDefault();
        window.location.hash = to;
      }}
      {...props}
    >
      {children}
    </a>
  );
}

export function NavLink({
  to,
  end,
  className,
  children,
  ...props
}: {
  to: string;
  end?: boolean;
  className?: ((args: { isActive: boolean }) => string) | string;
  children: ReactNode;
  [key: string]: any;
}) {
  const [pathname, setPathname] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleChange = () => {
      setPathname(window.location.hash.slice(1) || '/');
    };
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);

  const isActive = end
    ? pathname === to
    : pathname.startsWith(to);

  const computedClassName = typeof className === 'function'
    ? className({ isActive })
    : className;

  return (
    <a
      href={`#${to}`}
      onClick={(e) => {
        e.preventDefault();
        window.location.hash = to;
      }}
      className={computedClassName}
      {...props}
    >
      {children}
    </a>
  );
}

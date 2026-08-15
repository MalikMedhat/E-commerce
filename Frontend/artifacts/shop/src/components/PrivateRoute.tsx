import { Route } from "wouter";

export function PrivateRoute({ component: Component, path }: { component: any, path: string }) {
  return (
    <Route path={path}>
      {(params) => <Component {...params} />}
    </Route>
  );
}

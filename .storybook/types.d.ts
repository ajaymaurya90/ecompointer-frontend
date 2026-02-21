declare module 'next/dist/shared/lib/router-context' {
    import type { NextRouter } from 'next/router';
    export const RouterContext: React.Context<NextRouter>;
}
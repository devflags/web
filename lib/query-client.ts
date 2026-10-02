import { environmentManager, QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                throwOnError: true,
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                retry: 1, // Tenta apenas 1 vez extra antes de falhar
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
    if (environmentManager.isServer()) {
        return makeQueryClient();
    }

    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }

    return browserQueryClient;
}
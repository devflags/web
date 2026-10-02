"use client";

import { QueryClientProvider } from "@tanstack/react-query";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { getQueryClient } from "@/lib/query-client";

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();


	useEffect(() => {
		queryClient.setDefaultOptions({
			/* mutations: {
				onError: (error) => handleMutationError(error, t),
			}, */
		});
	}, [queryClient]);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</QueryClientProvider>
	);
}
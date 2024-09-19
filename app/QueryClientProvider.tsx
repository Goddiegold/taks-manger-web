"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
            // refetchOnMount: false,
            retry: 1,
        },
    },
});

const QueryClientProviderWrapper = ({ children }) => {
    return (
        <QueryClientProvider 
        client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default QueryClientProviderWrapper;
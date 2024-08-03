'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { SidebarProvider } from '@/lib/hooks/use-sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

export const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: error => {
        console.error(error)
      }
    }),
    defaultOptions: {
      queries: {
        networkMode: 'always',
        throwOnError: true,
        refetchOnWindowFocus: false
      },
      mutations: {
        networkMode: 'always',
        throwOnError: true
      }
    }
  })

export function Providers({ children, ...props }: ThemeProviderProps) {
  const [queryClient] = React.useState(() => createQueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider {...props}>
        <SidebarProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SidebarProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  )
}

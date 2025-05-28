import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';

import { getActiveSession } from '@/actions/utils';

/**
 * Chromium for Puppeteer
 */
const CHROMIUM_EXECUTABLE_PATH =
  'https://github.com/Sparticuz/chromium/releases/download/v135.0.0-next.3/chromium-v135.0.0-next.3-pack.x64.tarhttps://github.com/Sparticuz/chromium/releases/download/v135.0.0-next.3/chromium-v135.0.0-next.3-pack.x64.tar';

/**
 * Tailwind
 */
const TAILWIND_CDN = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4';

export async function POST(req: NextRequest) {
  let browser;
  const ENV = process.env.NODE_ENV;

  try {
    const { htmlString } = (await req.json()) as { htmlString: string };

    const session = getActiveSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (ENV === 'production') {
      const puppeteer = await import('puppeteer-core');
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(CHROMIUM_EXECUTABLE_PATH),
        headless: true,
        acceptInsecureCerts: true,
      });
    } else if (ENV === 'development') {
      const puppeteer = await import('puppeteer');
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
      });
    }

    if (!browser) {
      throw new Error('Failed to launch browser');
    }

    const page = await browser.newPage();
    console.log('Page opened'); // Debugging log

    // Set the HTML content of the page
    await page.setContent(htmlString, {
      // * "waitUntil" prop makes fonts work in templates
      waitUntil: 'networkidle0',
    });
    console.log('Page content set'); // Debugging log

    // Add Tailwind CSS
    await page.addScriptTag({
      url: TAILWIND_CDN,
    });
    console.log('Script tag added'); // Debugging log

    await page.addStyleTag({
      content: `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
      @import 'tailwindcss';
      @import 'tw-animate-css';

      @plugin 'tailwind-scrollbar-hide';

      @custom-variant dark (&:is(.dark *));

      @theme inline {
        --radius-sm: calc(var(--radius) - 4px);
        --radius-md: calc(var(--radius) - 2px);
        --radius-lg: var(--radius);
        --radius-xl: calc(var(--radius) + 4px);
        --color-background: var(--background);
        --color-foreground: var(--foreground);
        --color-card: var(--card);
        --color-card-foreground: var(--card-foreground);
        --color-popover: var(--popover);
        --color-popover-foreground: var(--popover-foreground);
        --color-primary: var(--primary);
        --color-primary-foreground: var(--primary-foreground);
        --color-secondary: var(--secondary);
        --color-secondary-foreground: var(--secondary-foreground);
        --color-muted: var(--muted);
        --color-muted-foreground: var(--muted-foreground);
        --color-accent: var(--accent);
        --color-accent-foreground: var(--accent-foreground);
        --color-destructive: var(--destructive);
        --color-border: var(--border);
        --color-input: var(--input);
        --color-ring: var(--ring);
        --color-chart-1: var(--chart-1);
        --color-chart-2: var(--chart-2);
        --color-chart-3: var(--chart-3);
        --color-chart-4: var(--chart-4);
        --color-chart-5: var(--chart-5);
        --color-sidebar: var(--sidebar);
        --color-sidebar-foreground: var(--sidebar-foreground);
        --color-sidebar-primary: var(--sidebar-primary);
        --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
        --color-sidebar-accent: var(--sidebar-accent);
        --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
        --color-sidebar-border: var(--sidebar-border);
        --color-sidebar-ring: var(--sidebar-ring);
        --font-heading: 'var(--font-heading)', 'ui-sans-serif', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI Variable Display', 'Segoe UI', 'Helvetica', 'Apple Color Emoji', 'Arial', 'sans-serif', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        --font-mono: 'var(--font-mono)', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
        --font-sans: 'var(--font-sans)', 'ui-sans-serif', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI Variable Display', 'Segoe UI', 'Helvetica', 'Apple Color Emoji', 'Arial', 'sans-serif', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        --color-highlight: var(--highlight);
        --color-brand: var(--brand);
      }

      :root {
        --radius: 0.625rem;
        --background: oklch(1 0 0);
        --foreground: oklch(0.145 0 0);
        --card: oklch(1 0 0);
        --card-foreground: oklch(0.145 0 0);
        --popover: oklch(1 0 0);
        --popover-foreground: oklch(0.145 0 0);
        --primary: oklch(0.205 0 0);
        --primary-foreground: oklch(0.985 0 0);
        --secondary: oklch(0.97 0 0);
        --secondary-foreground: oklch(0.205 0 0);
        --muted: oklch(0.97 0 0);
        --muted-foreground: oklch(0.556 0 0);
        --accent: oklch(0.97 0 0);
        --accent-foreground: oklch(0.205 0 0);
        --destructive: oklch(0.577 0.245 27.325);
        --border: oklch(0.922 0 0);
        --input: oklch(0.922 0 0);
        --ring: oklch(0.708 0 0);
        --chart-1: oklch(0.646 0.222 41.116);
        --chart-2: oklch(0.6 0.118 184.704);
        --chart-3: oklch(0.398 0.07 227.392);
        --chart-4: oklch(0.828 0.189 84.429);
        --chart-5: oklch(0.769 0.188 70.08);
        --sidebar: oklch(0.985 0 0);
        --sidebar-foreground: oklch(0.145 0 0);
        --sidebar-primary: oklch(0.205 0 0);
        --sidebar-primary-foreground: oklch(0.985 0 0);
        --sidebar-accent: oklch(0.97 0 0);
        --sidebar-accent-foreground: oklch(0.205 0 0);
        --sidebar-border: oklch(0.922 0 0);
        --sidebar-ring: oklch(0.708 0 0);

        /* Colors */
        --brand: oklch(0.623 0.214 259.815);
        --highlight: oklch(0.852 0.199 91.936);

        /* (Optional) Fonts */
        --font-heading:
          'var(--font-heading)', 'ui-sans-serif', '-apple-system', 'BlinkMacSystemFont',
          'Segoe UI Variable Display', 'Segoe UI', 'Helvetica', 'Apple Color Emoji', 'Arial',
          'sans-serif', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        --font-mono:
          'var(--font-mono)', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
          'Courier New', monospace;
        --font-sans:
          'var(--font-sans)', 'ui-sans-serif', '-apple-system', 'BlinkMacSystemFont',
          'Segoe UI Variable Display', 'Segoe UI', 'Helvetica', 'Apple Color Emoji', 'Arial',
          'sans-serif', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';

        /* ... your other existing :root variables ... */
      }

      .dark {
        --background: oklch(0.145 0 0);
        --foreground: oklch(0.985 0 0);
        --card: oklch(0.205 0 0);
        --card-foreground: oklch(0.985 0 0);
        --popover: oklch(0.205 0 0);
        --popover-foreground: oklch(0.985 0 0);
        --primary: oklch(0.922 0 0);
        --primary-foreground: oklch(0.205 0 0);
        --secondary: oklch(0.269 0 0);
        --secondary-foreground: oklch(0.985 0 0);
        --muted: oklch(0.269 0 0);
        --muted-foreground: oklch(0.708 0 0);
        --accent: oklch(0.269 0 0);
        --accent-foreground: oklch(0.985 0 0);
        --destructive: oklch(0.704 0.191 22.216);
        --border: oklch(1 0 0 / 10%);
        --input: oklch(1 0 0 / 15%);
        --ring: oklch(0.556 0 0);
        --chart-1: oklch(0.488 0.243 264.376);
        --chart-2: oklch(0.696 0.17 162.48);
        --chart-3: oklch(0.769 0.188 70.08);
        --chart-4: oklch(0.627 0.265 303.9);
        --chart-5: oklch(0.645 0.246 16.439);
        --sidebar: oklch(0.205 0 0);
        --sidebar-foreground: oklch(0.985 0 0);
        --sidebar-primary: oklch(0.488 0.243 264.376);
        --sidebar-primary-foreground: oklch(0.985 0 0);
        --sidebar-accent: oklch(0.269 0 0);
        --sidebar-accent-foreground: oklch(0.985 0 0);
        --sidebar-border: oklch(1 0 0 / 10%);
        --sidebar-ring: oklch(0.556 0 0);

        /* Colors */
        --brand: oklch(0.707 0.165 254.624);
        --highlight: oklch(0.852 0.199 91.936);
      }

      @layer base {
        * {
          @apply border-border outline-ring/50;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
      `,
    });

    await page.addStyleTag({
      content: `
      .page{
        width: 21cm;
        min-height: 29.7cm;
      }
      @page {
        size: A4;
        margin: 16px;
      }
      @media print {
        .page {
          margin: 16px;
          border: initial;
          border-radius: initial;
          width: initial;
          min-height: initial;
          box-shadow: initial;
          background: initial;
          page-break-after: always;
        }
      }
    `,
    });

    // Generate the PDF
    const pdf: Uint8Array = await page.pdf({
      format: 'a4',
      printBackground: true,
    });
    console.log('PDF generated'); // Debugging log

    for (const page of await browser.pages()) {
      await page.close();
    }

    // Close the Puppeteer browser
    await browser.close();
    console.log('Browser closed'); // Debugging log

    // Create a Blob from the PDF data
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const pdfBlob = new Blob([pdf], { type: 'application/pdf' });

    const response = new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=document.pdf',
      },
      status: 200,
    });

    return response;
  } catch (error) {
    console.error(error);

    // Return an error response
    return new NextResponse(`Error generating PDF: \n${(error as Error).message}`, {
      status: 500,
    });
  } finally {
    if (browser) {
      await Promise.race([browser.close(), browser.close(), browser.close()]);
    }
  }
}

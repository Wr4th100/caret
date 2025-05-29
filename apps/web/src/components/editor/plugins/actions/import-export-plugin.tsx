'use client';

import { exportFile, importFile } from '@lexical/file';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DownloadIcon, FileTextIcon, UploadIcon } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function ImportExportPlugin() {
  const [editor] = useLexicalComposerContext();

  const exportAsPDF = () => {
    editor.update(async () => {
      const htmlContent = $generateHtmlFromNodes(editor, null);
      console.log('Exporting as PDF:', htmlContent);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/generate/pdf`, {
        method: 'POST',
        body: JSON.stringify({
          htmlString: htmlContent,
        }),
      });

      const pdf = await response.blob();
      const url = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Playground-${new Date().toISOString()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('PDF exported successfully');
    });
  };

  const exportAsJSON = () => {
    return exportFile(editor, {
      fileName: `Playground ${new Date().toISOString()}`,
      source: 'Playground',
    });
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={'ghost'}
            onClick={() => importFile(editor)}
            title="Import"
            aria-label="Import editor state from JSON"
            size={'sm'}
            className="p-2"
          >
            <UploadIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Import Content</TooltipContent>
      </Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'p-2')}
          aria-label="Export editor state"
        >
          <DownloadIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Export</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={exportAsJSON}>
            <DownloadIcon className="mr-2 size-4" />
            Export as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportAsPDF}>
            <FileTextIcon className="mr-2 size-4" />
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
